// Google Sheets helper — append submission row (columns A–P)

import { google } from "googleapis";

export type SheetSubmissionPayload = {
  catalogId: string;
  title: string;
  artist: string;
  genre: string;
  duration: string;
  youtubeUrl: string;
  description?: string;
  artistEmail: string;
  socialUrl?: string;
  tools?: string;
  coverMode: string;
  coverPrompt?: string;
};

function getPrivateKey(): string {
  const raw = process.env.GOOGLE_PRIVATE_KEY;
  if (!raw) return "";
  return raw.replace(/\\n/g, "\n");
}

function getAuth() {
  const clientEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  const privateKey = getPrivateKey();
  if (!clientEmail || !privateKey) {
    throw new Error("Google service account env vars are incomplete");
  }
  return new google.auth.GoogleAuth({
    credentials: {
      client_email: clientEmail,
      private_key: privateKey,
    },
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });
}

/** Next catalog sequence from row count (column A). Assumes row 1 is header; first data row = PLG-001. */
export async function getNextCatalogNumberFromSheet(): Promise<number> {
  const spreadsheetId = process.env.GOOGLE_SHEETS_ID;
  if (!spreadsheetId) {
    throw new Error("GOOGLE_SHEETS_ID is not set");
  }

  const range = process.env.GOOGLE_SHEETS_RANGE ?? "Submissions!A:A";
  const auth = getAuth();
  const sheets = google.sheets({ version: "v4", auth });

  const res = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range,
  });

  const rows = res.data.values ?? [];
  return Math.max(1, rows.length);
}

export async function appendSubmission(data: SheetSubmissionPayload): Promise<void> {
  const spreadsheetId = process.env.GOOGLE_SHEETS_ID;
  if (!spreadsheetId) {
    throw new Error("GOOGLE_SHEETS_ID is not set");
  }

  const range = process.env.GOOGLE_SHEETS_APPEND_RANGE ?? "Submissions!A:P";
  const auth = getAuth();
  const sheets = google.sheets({ version: "v4", auth });

  const timestamp = new Date().toISOString();
  const row: (string | undefined)[] = [
    timestamp,
    data.catalogId,
    data.title,
    data.artist,
    data.genre,
    data.duration,
    data.youtubeUrl,
    data.description ?? "",
    data.artistEmail,
    data.socialUrl ?? "",
    data.tools ?? "",
    data.coverMode,
    data.coverPrompt ?? "",
    "pending",
    "",
    "",
  ];

  await sheets.spreadsheets.values.append({
    spreadsheetId,
    range,
    valueInputOption: "USER_ENTERED",
    requestBody: {
      values: [row as string[]],
    },
  });
}
