import { randomBytes, scrypt, timingSafeEqual } from "node:crypto";
import { promisify } from "node:util";

const scryptAsync = promisify(scrypt) as (
  password: string,
  salt: string,
  keyLength: number,
) => Promise<Buffer>;

const KEY_LENGTH = 64;

/** Hash format: `<salt hex>:<derived key hex>`. */
export async function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const derived = await scryptAsync(password, salt, KEY_LENGTH);
  return `${salt}:${derived.toString("hex")}`;
}

export async function verifyPassword(password: string, passwordHash: string) {
  const [salt, key] = passwordHash.split(":");
  if (!salt || !key) {
    return false;
  }

  const expected = Buffer.from(key, "hex");
  const derived = await scryptAsync(password, salt, expected.length);
  return timingSafeEqual(derived, expected);
}
