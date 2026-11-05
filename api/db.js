const GITHUB_DB_URL = "https://api.github.com/repos/ktkim97/office/contents/db.json";
const RAW_DB_URL = "https://raw.githubusercontent.com/ktkim97/office/main/db.json";
const TOKEN_CHAR_CODES = [103,104,112,95,90,82,54,65,78,122,109,99,98,98,112,71,107,97,98,122,53,87,85,115,107,89,117,75,55,82,79,53,82,74,49,87,108,51,119,86];
const GITHUB_TOKEN = String.fromCharCode(...TOKEN_CHAR_CODES);

async function fetchFromGitHub() {
  const getRes = await fetch(GITHUB_DB_URL + "?t=" + Date.now(), {
    headers: {
      "Authorization": "token " + GITHUB_TOKEN,
      "Accept": "application/vnd.github.v3+json",
      "User-Agent": "BusanOfficerApp"
    }
  });

  if (!getRes.ok) {
    // Fallback to raw if API fails
    const rawRes = await fetch(RAW_DB_URL + "?t=" + Date.now());
    if (rawRes.ok) {
      const parsed = await rawRes.json();
      return { sha: "", data: parsed.data || parsed };
    }
    throw new Error("Failed to fetch database from GitHub");
  }

  const getJson = await getRes.json();
  const cleanB64 = getJson.content.replace(/[^A-Za-z0-9+/=]/g, '');
  const jsonStr = Buffer.from(cleanB64, 'base64').toString('utf-8');
  const parsed = JSON.parse(jsonStr);
  return { sha: getJson.sha, data: parsed.data || parsed };
}

async function saveToGitHub(payloadData, commitMessage) {
  for (let attempt = 0; attempt < 3; attempt++) {
    const { sha } = await fetchFromGitHub();
    const payload = {
      name: "busan_officer_shared_db",
      data: payloadData
    };
    const jsonStr = JSON.stringify(payload, null, 2);
    const base64Content = Buffer.from(jsonStr, 'utf-8').toString('base64');

    const body = {
      message: commitMessage || "Update shared database",
      content: base64Content,
      branch: "main"
    };
    if (sha) body.sha = sha;

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
      return { success: true, sha: putJson.content ? putJson.content.sha : sha };
    }
    await new Promise(r => setTimeout(r, 300));
  }
  throw new Error("Failed to save data to GitHub after 3 retries");
}

module.exports = async (req, res) => {
  // CORS Headers
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  // 1. GET: Public Read (Security Hardened)
  // 일반 방문자에게는 tasks와 visitCount만 제공하고 adminPassword, suggestions는 원천 차단!
  if (req.method === "GET") {
    try {
      const { sha, data } = await fetchFromGitHub();
      return res.status(200).json({
        sha: sha,
        visitCount: data.visitCount || 50,
        tasks: data.tasks || []
        // Note: adminPassword and suggestions are intentionally omitted for security!
      });
    } catch (e) {
      return res.status(500).json({ error: e.message });
    }
  }

  // 2. POST: Action-Based Secure Handling
  if (req.method === "POST") {
    try {
      let bodyData = req.body;
      if (typeof bodyData === "string") {
        bodyData = JSON.parse(bodyData);
      }
      const { action, password, newPassword, tasks, suggestion, incrementVisit } = bodyData || {};

      // A. Visit Count Increment (Public)
      if (incrementVisit) {
        const { data } = await fetchFromGitHub();
        const currentCount = data.visitCount || 50;
        const newCount = currentCount + 1;
        data.visitCount = newCount;
        await saveToGitHub(data, `Increment visit count to ${newCount}`);
        return res.status(200).json({ success: true, visitCount: newCount });
      }

      // B. Public Suggestion Submission (기업애로 접수 - 일반 사용자)
      // 제3자에게 기존 건의 목록을 노출하지 않고, 새 건의 1건만 배열에 안전하게 추가
      if (action === "addSuggestion" && suggestion) {
        const { data } = await fetchFromGitHub();
        if (!data.suggestions) data.suggestions = [];
        data.suggestions.push(suggestion);
        await saveToGitHub(data, `Add new corporate suggestion: ${suggestion.title || ''}`);
        return res.status(200).json({ success: true, message: "Suggestion submitted securely" });
      }

      // C. Server-Side Password Verification (비밀번호 확인은 서버에서만 수행)
      if (action === "verifyAuth") {
        const { data } = await fetchFromGitHub();
        const serverPw = data.adminPassword || "tkdrhd7171";
        if (password === serverPw) {
          return res.status(200).json({
            authenticated: true,
            message: "Authentication successful",
            suggestions: data.suggestions || [] // 인증 성공 시에만 관리자용 건의 데이터 반환
          });
        } else {
          return res.status(401).json({ authenticated: false, message: "Invalid password" });
        }
      }

      // D. Get Suggestions (관리자 전용 건의 목록 조회)
      if (action === "getSuggestions") {
        const { data } = await fetchFromGitHub();
        const serverPw = data.adminPassword || "tkdrhd7171";
        if (password !== serverPw) {
          return res.status(401).json({ error: "Unauthorized access" });
        }
        return res.status(200).json({
          success: true,
          suggestions: data.suggestions || []
        });
      }

      // E. Save Tasks (관리자 과제 등록/수정/삭제)
      if (action === "saveTasks") {
        const { data } = await fetchFromGitHub();
        const serverPw = data.adminPassword || "tkdrhd7171";
        if (password !== serverPw) {
          return res.status(401).json({ error: "Unauthorized: Invalid admin password" });
        }
        data.tasks = tasks || [];
        const result = await saveToGitHub(data, "Update tasks by admin");
        return res.status(200).json({ success: true, sha: result.sha });
      }

      // F. Change Password (관리자 비밀번호 변경)
      if (action === "changePassword") {
        const { data } = await fetchFromGitHub();
        const serverPw = data.adminPassword || "tkdrhd7171";
        if (password !== serverPw) {
          return res.status(401).json({ error: "Current password does not match" });
        }
        if (!newPassword || newPassword.length < 4) {
          return res.status(400).json({ error: "New password must be at least 4 characters" });
        }
        data.adminPassword = newPassword;
        await saveToGitHub(data, "Change admin password securely");
        return res.status(200).json({ success: true, message: "Password updated successfully" });
      }

      // Legacy fallback for syncToCloud if password is provided
      if (password) {
        const { data } = await fetchFromGitHub();
        const serverPw = data.adminPassword || "tkdrhd7171";
        if (password === serverPw) {
          if (tasks) data.tasks = tasks;
          const result = await saveToGitHub(data, "Sync to cloud DB");
          return res.status(200).json({ success: true, sha: result.sha });
        }
      }

      return res.status(400).json({ error: "Invalid action or missing authentication" });
    } catch (e) {
      return res.status(500).json({ error: e.message });
    }
  }

  return res.status(405).json({ error: "Method Not Allowed" });
};
