/**
 * Keep-Alive Pinger for Portfolio Playground Backends
 * Periodically hits each backend to prevent free-tier Hugging Face Spaces from going to sleep.
 */

const ENDPOINTS = [
  {
    name: "BitCheck Authenticator API",
    url: "https://jaykay73-bitcheck-image.hf.space/docs",
    method: "GET",
  },
  {
    name: "Nigerian Pidgin Next-Word Predictor (Trigram / LSTM)",
    url: "https://jaykay73-nextword-pidgin-api.hf.space/predict",
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      context: "how far",
      top_k: 3,
      model: "both",
    }),
  },
  {
    name: "LockedIn AI Service",
    url: "https://jaykay73-lockedin.hf.space/docs",
    method: "GET",
  },
  {
    name: "LockedIn Roadmap Warmup (Cached Query)",
    url: "https://jaykay73-lockedin.hf.space/api/v1/roadmaps/generate",
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      skill: "python",
      user_level: "beginner",
      goal: "basics",
      time_commitment: "3 hours",
    }),
  },
];

async function pingEndpoint(endpoint, retries = 2) {
  const startTime = Date.now();
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const options = {
        method: endpoint.method,
        headers: endpoint.headers || {},
      };
      if (endpoint.body) options.body = endpoint.body;

      const res = await fetch(endpoint.url, options);
      const elapsed = Date.now() - startTime;
      if (res.ok) {
        console.log(`[PASS] ${endpoint.name}: HTTP ${res.status} (${elapsed}ms)`);
        return true;
      } else {
        console.warn(`[WARN] ${endpoint.name} attempt ${attempt}: HTTP ${res.status} (${elapsed}ms)`);
      }
    } catch (err) {
      console.warn(`[FAIL] ${endpoint.name} attempt ${attempt}: ${err.message}`);
    }
    if (attempt < retries) {
      await new Promise((resolve) => setTimeout(resolve, 3000));
    }
  }
  return false;
}

async function main() {
  console.log(`--- Starting Keep-Alive Backend Ping at ${new Date().toISOString()} ---`);
  let allHealthy = true;
  for (const ep of ENDPOINTS) {
    const success = await pingEndpoint(ep);
    if (!success) allHealthy = false;
  }
  console.log(`--- Finished Keep-Alive Run. All backends active: ${allHealthy} ---`);
}

main().catch((err) => {
  console.error("Keep-alive error:", err);
  process.exit(1);
});
