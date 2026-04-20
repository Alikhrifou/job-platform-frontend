import CryptoJS from 'crypto-js';

const SECRET_KEY = import.meta.env.VITE_STORAGE_SECRET || 'jm-s3cur3-st0r4g3-k3y';

export function encrypt(text: string): string {
  return CryptoJS.AES.encrypt(text, SECRET_KEY).toString();
}

export function decrypt(ciphertext: string): string {
  const bytes = CryptoJS.AES.decrypt(ciphertext, SECRET_KEY);
  return bytes.toString(CryptoJS.enc.Utf8);
}

export function setEncrypted(key: string, value: string): void {
  localStorage.setItem(key, encrypt(value));
}

export function getDecrypted(key: string): string | null {
  const raw = localStorage.getItem(key);
  if (!raw) return null;
  try {
    const decrypted = decrypt(raw);
    return decrypted || null;
  } catch {
    localStorage.removeItem(key);
    return null;
  }
}
