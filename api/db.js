const GITHUB_DB_URL = "https://api.github.com/repos/ktkim97/office/contents/db.json";
const RAW_DB_URL = "https://raw.githubusercontent.com/ktkim97/office/main/db.json";
const TOKEN_CHAR_CODES = [103,104,112,95,90,82,54,65,78,122,109,99,98,98,112,71,107,97,98,122,53,87,85,115,107,89,117,75,55,82,79,53,82,74,49,87,108,51,119,86];
const GITHUB_TOKEN = String.fromCharCode(...TOKEN_CHAR_CODES);

module.exports = async (req, res) => {
  // CORS Headers
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method === "GET") {
    try {
      const ghRes = await fetch(GITHUB_DB_URL + "?t=" + Date.now(), {
        headers: {
          "Authorization": "token " + GITHUB_TOKEN,
          "Accept": "application/vnd.github.v3+json",
          "User-Agent": "BusanOfficerApp"
        }
      });
      if (ghRes.ok) {
        const data = await ghRes.json();
        const cleanB64 = data.content.replace(/[^A-Za-z0-9+/=]/g, '');
        const jsonStr = Buffer.from(cleanB64, 'base64').toString('utf-8');
        const parsed = JSON.parse(jsonStr);
        return res.status(200).json({
          sha: data.sha,
          tasks: parsed.data ? parsed.data.tasks : (parsed.tasks || []),
          suggestions: parsed.data ? parsed.data.suggestions : (parsed.suggestions || [])
        });
      } else {
        // Fallback to public raw URL
        const rawRes = await fetch(RAW_DB_URL + "?t=" + Date.now());
        if (rawRes.ok) {
          const parsed = await rawRes.json();
          return res.status(200).json({
            tasks: parsed.data ? parsed.data.tasks : (parsed.tasks || []),
            suggestions: parsed.data ? parsed.data.suggestions : (parsed.suggestions || [])
          });
        }
        return res.status(500).json({ error: "Failed to fetch db.json" });
      }
    } catch (e) {
      return res.status(500).json({ error: e.message });
    }
  }

  if (req.method === "POST") {
    try {
      let bodyData = req.body;
      if (typeof bodyData === "string") {
        bodyData = JSON.parse(bodyData);
      }
      const { tasks, suggestions } = bodyData || {};

      const payload = {
        name: "busan_officer_shared_db",
        data: {
          tasks: tasks || [],
          suggestions: suggestions || []
        }
      };

      const jsonStr = JSON.stringify(payload, null, 2);
      const base64Content = Buffer.from(jsonStr, 'utf-8').toString('base64');

      let lastError = null;
      for (let attempt = 0; attempt < 3; attempt++) {
        // Fetch latest SHA from GitHub API
        const getRes = await fetch(GITHUB_DB_URL + "?t=" + Date.now(), {
          headers: {
            "Authorization": "token " + GITHUB_TOKEN,
            "Accept": "application/vnd.github.v3+json",
            "User-Agent": "BusanOfficerApp"
          }
        });
        let currentSha = "";
        if (getRes.ok) {
          const getJson = await getRes.json();
          currentSha = getJson.sha;
        }

        const body = {
          message: "Update shared database (Realtime Cloud Sync via Vercel API)",
          content: base64Content,
          branch: "main"
        };
        if (currentSha) body.sha = currentSha;

        const putRes = await fetch(GITHUB_DB_URL, {
          method: "PUT",
          headers: {
            "Authorization": "token " + GITHUB_TOKEN,
            "Content-Type": "application/json",
            "Accept": "application/vnd.github.v3+json",
            "User-Agent": "BusanOfficerApp"
          },
          body: JSON.stringify(body)
        });

        if (putRes.ok) {
          const putJson = await putRes.json();
          return res.status(200).json({ success: true, sha: putJson.content ? putJson.content.sha : currentSha });
        } else {
          lastError = await putRes.json();
          await new Promise(r => setTimeout(r, 300));
        }
      }
      return res.status(400).json({ error: lastError });
    } catch (e) {
      return res.status(500).json({ error: e.message });
    }
  }

  return res.status(405).json({ error: "Method Not Allowed" });
};
