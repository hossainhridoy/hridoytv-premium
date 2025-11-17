// =======================================
// 💎 HridoyTV Premium API (KV Storage Version)
// Author: Hossain Hridoy
// URL: hridoytv-premium.hridoyx.workers.dev
// =======================================
//
// 🔹 KV namespace: HRIDOY_CODES
// (Cloudflare Dashboard → Workers → KV → Create Namespace)
// তারপর Settings → Bind namespace to variable = HRIDOY_CODES
//
// =======================================

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const path = url.pathname;

    // === শুধুমাত্র /api রিকোয়েস্টের জন্য ===
    if (path === "/api") {
      const code = url.searchParams.get("code");
      if (!code) return json({ ok: false, error: "No code provided" });

      // কোডের অবস্থা চেক করো (KV থেকে)
      const status = await env.HRIDOY_CODES.get(code);

      // কোড একদমই নেই
      if (!status) return json({ ok: false, error: "Invalid code" });

      // আগে ব্যবহার হয়ে থাকলে
      if (status === "USED") return json({ ok: false, error: "Code already used" });

      // ✅ কোড সঠিক, এখন ব্যবহৃত হিসেবে মার্ক করো
      await env.HRIDOY_CODES.put(code, "USED");

      return json({ ok: true, message: "✅ Premium Unlocked" });
    }

    // === হেল্প টেক্সট (যদি কেউ /api না দেয়) ===
    return new Response(
      "💎 HridoyTV Premium API\nUsage:\n/api?code=YOURCODE",
      { headers: { "Content-Type": "text/plain; charset=utf-8" } }
    );
  },
};

// === JSON Helper ===
function json(obj) {
  return new Response(JSON.stringify(obj, null, 2), {
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*"
    }
  });
      }
