import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

const PUBLIC_ORIGINS = new Set([
  "https://mouhamed-ai.github.io",
  "http://localhost:3000",
]);

let tokenCache: { value: string; expiresAt: number } | null = null;

function corsHeaders(request: NextRequest) {
  const origin = request.headers.get("origin") || "";
  const allowedOrigin = PUBLIC_ORIGINS.has(origin)
    ? origin
    : "https://mouhamed-ai.github.io";

  return {
    "Access-Control-Allow-Origin": allowedOrigin,
    "Access-Control-Allow-Methods": "GET, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    Vary: "Origin",
  };
}

async function getAccessToken() {
  if (tokenCache && tokenCache.expiresAt > Date.now() + 60_000) {
    return tokenCache.value;
  }

  const clientId = process.env.QF_CLIENT_ID;
  const clientSecret = process.env.QF_CLIENT_SECRET;
  const environment = process.env.QF_ENV === "prelive" ? "prelive" : "production";

  if (!clientId || !clientSecret) {
    throw new Error("Les identifiants Quran Foundation ne sont pas configurés.");
  }

  const oauthBase = environment === "production"
    ? "https://oauth2.quran.foundation"
    : "https://prelive-oauth2.quran.foundation";

  const response = await fetch(`${oauthBase}/oauth2/token`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString("base64")}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials&scope=content",
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Authentification Quran Foundation impossible (${response.status}).`);
  }

  const payload = await response.json() as { access_token: string; expires_in?: number };
  tokenCache = {
    value: payload.access_token,
    expiresAt: Date.now() + Math.max(60, payload.expires_in ?? 3600) * 1000,
  };
  return tokenCache.value;
}

export function OPTIONS(request: NextRequest) {
  return new NextResponse(null, { status: 204, headers: corsHeaders(request) });
}

export async function GET(request: NextRequest, context: { params: Promise<{ page: string }> }) {
  const { page: rawPage } = await context.params;
  const page = Number(rawPage);
  const headers = corsHeaders(request);

  if (!Number.isInteger(page) || page < 1 || page > 604) {
    return NextResponse.json({ error: "La page doit être comprise entre 1 et 604." }, { status: 400, headers });
  }

  try {
    const clientId = process.env.QF_CLIENT_ID;
    const environment = process.env.QF_ENV === "prelive" ? "prelive" : "production";
    const apiBase = environment === "production"
      ? "https://apis.quran.foundation"
      : "https://apis-prelive.quran.foundation";
    const accessToken = await getAccessToken();
    const response = await fetch(
      `${apiBase}/content/api/v4/verses/by_page/${page}?mushaf=1&fields=text_uthmani,chapter_id&words=true`,
      { headers: { "x-auth-token": accessToken, "x-client-id": clientId! }, next: { revalidate: 86_400 } },
    );

    if (!response.ok) {
      return NextResponse.json({ error: "La page du Mushaf est indisponible." }, { status: response.status, headers });
    }

    const payload = await response.json() as { verses?: Array<Record<string, unknown>> };
    const verses = (payload.verses ?? []).map((verse) => ({
      verseKey: verse.verse_key,
      chapterId: verse.chapter_id,
      verseNumber: verse.verse_number,
      text: verse.text_uthmani ?? verse.text_imlaei_simple ?? verse.text,
      words: verse.words,
    }));

    return NextResponse.json(
      { page, mushaf: 1, totalPages: 604, verses },
      { headers: { ...headers, "Cache-Control": "public, s-maxage=86400, stale-while-revalidate=604800" } },
    );
  } catch (error) {
    console.error("Mushaf proxy error", error);
    return NextResponse.json({ error: "Impossible de charger le Mushaf pour le moment." }, { status: 502, headers });
  }
}
