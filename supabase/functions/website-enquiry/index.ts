import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Content-Type": "application/json",
};

function json(status: number, body: Record<string, unknown>) {
  return new Response(JSON.stringify(body), { status, headers: corsHeaders });
}

async function sha256(value: string) {
  const bytes = new TextEncoder().encode(value);
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  return Array.from(new Uint8Array(digest)).map((b) => b.toString(16).padStart(2, "0")).join("");
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "POST") return json(405, { error: "Method not allowed." });

  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  if (!supabaseUrl || !serviceKey) return json(500, { error: "Submission service is not configured." });

  let body: Record<string, unknown>;
  try {
    body = await req.json();
    if (!body || typeof body !== "object" || Array.isArray(body)) return json(400, { error: "Invalid request." });
  } catch {
    return json(400, { error: "Invalid JSON request." });
  }

  // Honeypot: silently accept bot submissions without storing them.
  if (typeof body.website === "string" && body.website.trim()) {
    return json(202, { ok: true });
  }

  const name = typeof body.name === "string" ? body.name.trim() : "";
  const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
  const phone = typeof body.phone === "string" ? body.phone.trim() : "";
  const service = typeof body.service === "string" ? body.service.trim() : "";
  const message = typeof body.message === "string" ? body.message.trim() : "";

  if (name.length < 2 || name.length > 120) return json(400, { error: "Enter a name between 2 and 120 characters." });
  if (email.length < 6 || email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return json(400, { error: "Enter a valid email address." });
  if (phone && !/^\\+?[0-9][0-9\\s().-]{6,18}$/.test(phone)) return json(400, { error: "Enter a valid phone number." });
  if (service.length < 2 || service.length > 120) return json(400, { error: "Select a valid service." });
  if (message.length > 5000) return json(400, { error: "Message is too long." });

  const forwarded = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  const ip = req.headers.get("cf-connecting-ip")?.trim() || req.headers.get("x-real-ip")?.trim() || forwarded;
  if (!ip) return json(400, { error: "Unable to validate this request. Please email us directly." });

  const supabase = createClient(supabaseUrl, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  try {
    // Store only a one-way digest, never the visitor's raw IP address.
    const ipHash = await sha256(ip + "|maveriqode-enquiry-v1");
    const { data: attempts, error: limitError } = await supabase.rpc("consume_website_enquiry_rate_limit", { p_ip_hash: ipHash });
    if (limitError) throw limitError;
    if (Number(attempts) > 5) return json(429, { error: "Too many requests. Please try again later or email us directly." });

    const { error: insertError } = await supabase.from("website_enquiries").insert({
      name, email, phone: phone || "", service, message, status: "new", admin_notes: "",
    });
    if (insertError) throw insertError;

    if (Number(attempts) === 1) {
      const cutoff = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
      await supabase.from("website_enquiry_rate_limits").delete().lt("updated_at", cutoff);
    }
    return json(201, { ok: true });
  } catch (error) {
    console.error("website-enquiry submission failed", error instanceof Error ? error.message : "unknown error");
    return json(500, { error: "We could not send your request right now. Please email us directly." });
  }
});
