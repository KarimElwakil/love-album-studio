import { Album, AlbumBlock } from "@/types/album";

const ALBUMS_KEY = "love_albums";
const CODES_KEY = "love_codes";

export interface CodeData {
  code: string;
  used: boolean;
  createdAt: number;
  expiresAt: number; // 24h after first use
  firstUsedAt?: number;
}

// Demo codes for testing
const DEMO_CODES: CodeData[] = [
  { code: "LOVE2024", used: false, createdAt: Date.now(), expiresAt: 0 },
  { code: "HEART999", used: false, createdAt: Date.now(), expiresAt: 0 },
  { code: "ROSE1234", used: false, createdAt: Date.now(), expiresAt: 0 },
];

function getCodes(): CodeData[] {
  const stored = localStorage.getItem(CODES_KEY);
  if (!stored) {
    localStorage.setItem(CODES_KEY, JSON.stringify(DEMO_CODES));
    return DEMO_CODES;
  }
  return JSON.parse(stored);
}

function saveCodes(codes: CodeData[]) {
  localStorage.setItem(CODES_KEY, JSON.stringify(codes));
}

export function validateCode(code: string): { valid: boolean; editable: boolean; message: string } {
  const codes = getCodes();
  const found = codes.find((c) => c.code === code.toUpperCase());

  if (!found) {
    return { valid: false, editable: false, message: "الكود غير صحيح. تأكد من كتابة الكود بشكل صحيح." };
  }

  if (found.used && found.firstUsedAt) {
    const now = Date.now();
    const hoursElapsed = (now - found.firstUsedAt) / (1000 * 60 * 60);
    if (hoursElapsed > 24) {
      return { valid: true, editable: false, message: "انتهت مدة التعديل. الألبوم متاح للعرض فقط." };
    }
  }

  // Mark as used if first time
  if (!found.used) {
    found.used = true;
    found.firstUsedAt = Date.now();
    found.expiresAt = Date.now() + 24 * 60 * 60 * 1000;
    saveCodes(codes);
  }

  return { valid: true, editable: true, message: "تم التحقق بنجاح!" };
}

export function getAlbum(code: string): Album | null {
  const stored = localStorage.getItem(`album_${code.toUpperCase()}`);
  return stored ? JSON.parse(stored) : null;
}

export function saveAlbum(album: Album) {
  localStorage.setItem(`album_${album.id}`, JSON.stringify(album));
}

export function createDefaultAlbum(code: string): Album {
  return {
    id: code.toUpperCase(),
    senderName: "",
    receiverName: "",
    password: "",
    passwordHint: "",
    mainMessage: "",
    backgroundColor: "#0d0d0d",
    textColor: "#e6d5b8",
    borderColor: "#b8860b",
    enableHearts: true,
    enableLights: true,
    animationSpeed: "normal",
    textSpeed: "normal",
    blocks: [],
    createdAt: Date.now(),
    relationshipStartDate: "",
  };
}

export function getAllCodes(): CodeData[] {
  return getCodes();
}

export function addCode(code: string) {
  const codes = getCodes();
  codes.push({
    code: code.toUpperCase(),
    used: false,
    createdAt: Date.now(),
    expiresAt: 0,
  });
  saveCodes(codes);
}

export function deleteCode(code: string) {
  const codes = getCodes().filter((c) => c.code !== code);
  saveCodes(codes);
  localStorage.removeItem(`album_${code}`);
}

export function extendCode(code: string, hours: number) {
  const codes = getCodes();
  const found = codes.find((c) => c.code === code);
  if (found && found.firstUsedAt) {
    found.expiresAt = Date.now() + hours * 60 * 60 * 1000;
    found.firstUsedAt = Date.now() - (24 - hours) * 60 * 60 * 1000;
  }
  saveCodes(codes);
}
