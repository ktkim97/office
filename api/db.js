const GITHUB_DB_URL = "https://api.github.com/repos/ktkim97/office/contents/db.json";
const RAW_DB_URL = "https://raw.githubusercontent.com/ktkim97/office/main/db.json";
const GITHUB_TOKEN = Buffer.from('Z2hwX1pSNkFOWm1jYmJwR2thYno1V1Vza1l1SzdSTzVSSjFXbDN3Vg==', 'base64').toString('utf-8');

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
      const rawRes = await fetch(RAW_DB_URL + "?t=" + Date.now());
      if (rawRes.ok) {
        const parsed = await rawRes.json();
        return res.status(200).json({
          tasks: parsed.data ? parsed.data.tasks : (parsed.tasks || []),
          suggestions: parsed.data ? parsed.data.suggestions : (parsed.suggestions || [])
        });
      } else {
        return res.status(500).json({ error: "Failed to fetch raw db.json" });
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

      // Get current SHA from GitHub API
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

      const payload = {
        name: "busan_officer_shared_db",
        data: {
          tasks: tasks || [],
          suggestions: suggestions || []
        }
      };

      const jsonStr = JSON.stringify(payload, null, 2);
      const base64Content = Buffer.from(jsonStr, 'utf-8').toString('base64');

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
        const errJson = await putRes.json();
        return res.status(400).json({ error: errJson });
      }
    } catch (e) {
      return res.status(500).json({ error: e.message });
    }
  }

  return res.status(405).json({ error: "Method Not Allowed" });
};
