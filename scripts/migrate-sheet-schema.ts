/**
 * One-shot: ensure row 1 of Submissions has headers for columns Q–Z.
 * Run: npm run migrate:sheet  (requires .env.local with Google Sheets credentials)
 */

import { google } from "googleapis";

const TAB = "Submissions";

const EXTRA_HEADERS = [
  "position_row",
  "position_col",
  "coverBg",
  "side",
  "tags",
  "listens",
  "likes",
  "publishedAt",
  "ai_approach",
  "human_input",
] as const;

function getPrivateKey(): string {
  const raw = process.env.GOOGLE_PRIVATE_KEY;
  if (!raw) return "";
  return raw.replace(/\\n/g, "\n");
}

function getAuth() {
  const clientEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  const privateKey = getPrivateKey();
  if (!clientEmail || !privateKey) {
    throw new Error("GOOGLE_SERVICE_ACCOUNT_EMAIL / GOOGLE_PRIVATE_KEY missing");
  }
  return new google.auth.GoogleAuth({
    credentials: { client_email: clientEmail, private_key: privateKey },
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });
}

async function main() {
  const spreadsheetId = process.env.GOOGLE_SHEETS_ID;
  if (!spreadsheetId) {
    throw new Error("GOOGLE_SHEETS_ID is not set");
  }

  const auth = getAuth();
  const sheets = google.sheets({ version: "v4", auth });

  const headerRes = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range: `${TAB}!1:1`,
  });

  const row = (headerRes.data.values?.[0] ?? []) as string[];
  const needQ = row.length < 17 || !(row[16]?.trim());

  if (!needQ) {
    console.log("Row 1 already has column Q (position_row). Nothing to do.");
    return;
  }

  const extended = [...row];
  while (extended.length < 16) {
    extended.push("");
  }
  for (let i = 0; i < EXTRA_HEADERS.length; i++) {
    extended[16 + i] = EXTRA_HEADERS[i]!;
  }

  await sheets.spreadsheets.values.update({
    spreadsheetId,
    range: `${TAB}!1:1`,
    valueInputOption: "USER_ENTERED",
    requestBody: { values: [extended] },
  });

  console.log("Updated row 1 with headers Q–Z:", EXTRA_HEADERS.join(", "));
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
