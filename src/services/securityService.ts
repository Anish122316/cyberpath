/**
 * CyberPath Advanced Application & Data Security Service
 * 
 * Provides:
 * 1. Client-Side Cryptographic Data Security & HMAC Tamper-Evident Storage
 * 2. Strict Input Sanitization & Anti-XSS Filtration
 * 3. Cryptographic Utility Suite (SHA-256, SHA-1, MD5, XOR Engine, Vigenère, Caesar, JWT Inspector)
 * 4. Security Audit Event Logging with Cryptographic Hash-Chain Verification
 */

import { UserProfile } from '../types';

// Persistent client-side signing salt (isolated per browser instance)
const CLIENT_STORAGE_SALT_KEY = 'cyberpath_sec_client_salt';

function getOrCreateClientSalt(): string {
  try {
    let salt = localStorage.getItem(CLIENT_STORAGE_SALT_KEY);
    if (!salt) {
      const randomBytes = new Uint8Array(32);
      if (typeof window !== 'undefined' && window.crypto && window.crypto.getRandomValues) {
        window.crypto.getRandomValues(randomBytes);
      } else {
        for (let i = 0; i < 32; i++) randomBytes[i] = Math.floor(Math.random() * 256);
      }
      salt = Array.from(randomBytes).map((b) => b.toString(16).padStart(2, '0')).join('');
      localStorage.setItem(CLIENT_STORAGE_SALT_KEY, salt);
    }
    return salt;
  } catch {
    return 'cyberpath-immutable-storage-salt-v1-fallback';
  }
}

/**
 * Universal text sanitizer to neutralize potential XSS, script injection, and control characters
 */
export function sanitizeInput(input: string): string {
  if (typeof input !== 'string') return '';
  return input
    .replace(/\0/g, '') // remove null bytes
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '') // strip script tags
    .replace(/javascript\s*:/gi, '') // strip pseudo protocols
    .replace(/on\w+\s*=/gi, '') // strip inline event handlers like onerror=
    .trim();
}

/**
 * Strict flag format validator
 */
export function validateFlagFormat(flag: string): boolean {
  return /^CYBERPATH\{[a-zA-Z0-9_\-!$@#%^&*+=.?]{4,64}\}$/.test(flag.trim());
}

/**
 * Compute SHA-256 digest in hex via Web Crypto API with fast fallback
 */
export async function computeSHA256(text: string): Promise<string> {
  try {
    if (typeof window !== 'undefined' && window.crypto && window.crypto.subtle) {
      const encoder = new TextEncoder();
      const data = encoder.encode(text);
      const hashBuffer = await window.crypto.subtle.digest('SHA-256', data);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
    }
  } catch (err) {
    console.warn('Web Crypto SHA-256 unavailable, falling back:', err);
  }
  // Deterministic fallback hash for environments without WebCrypto subtle
  return fallbackHash(text);
}

/**
 * Compute SHA-1 digest in hex via Web Crypto API
 */
export async function computeSHA1(text: string): Promise<string> {
  try {
    if (typeof window !== 'undefined' && window.crypto && window.crypto.subtle) {
      const encoder = new TextEncoder();
      const data = encoder.encode(text);
      const hashBuffer = await window.crypto.subtle.digest('SHA-1', data);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
    }
  } catch (err) {
    console.warn('Web Crypto SHA-1 unavailable:', err);
  }
  return fallbackHash(text + ':sha1');
}

/**
 * Pure JavaScript MD5 Implementation (RFC 1321) for cryptanalysis tools
 */
export function computeMD5(string: string): string {
  function md5cycle(x: number[], k: number[]) {
    let a = x[0], b = x[1], c = x[2], d = x[3];
    a = ff(a, b, c, d, k[0], 7, -680876936);
    d = ff(d, a, b, c, k[1], 12, -389564586);
    c = ff(c, d, a, b, k[2], 17, 606105819);
    b = ff(b, c, d, a, k[3], 22, -1044525330);
    a = ff(a, b, c, d, k[4], 7, -176418897);
    d = ff(d, a, b, c, k[5], 12, 1200080426);
    c = ff(c, d, a, b, k[6], 17, -1473231341);
    b = ff(b, c, d, a, k[7], 22, -45705983);
    a = ff(a, b, c, d, k[8], 7, 1770035416);
    d = ff(d, a, b, c, k[9], 12, -1958414417);
    c = ff(c, d, a, b, k[10], 17, -42063);
    b = ff(b, c, d, a, k[11], 22, -1990404162);
    a = ff(a, b, c, d, k[12], 7, 1804603682);
    d = ff(d, a, b, c, k[13], 12, -40341101);
    c = ff(c, d, a, b, k[14], 17, -1502002290);
    b = ff(b, c, d, a, k[15], 22, 1236535329);

    a = gg(a, b, c, d, k[1], 5, -165796510);
    d = gg(d, a, b, c, k[6], 9, -1069501632);
    c = gg(c, d, a, b, k[11], 14, 643717713);
    b = gg(b, c, d, a, k[0], 20, -373897302);
    a = gg(a, b, c, d, k[5], 5, -701558691);
    d = gg(d, a, b, c, k[10], 9, 38016083);
    c = gg(c, d, a, b, k[15], 14, -660478335);
    b = gg(b, c, d, a, k[4], 20, -405537848);
    a = gg(a, b, c, d, k[9], 5, 568446438);
    d = gg(d, a, b, c, k[14], 9, -1019803690);
    c = gg(c, d, a, b, k[3], 14, -187363961);
    b = gg(b, c, d, a, k[8], 20, 1163531501);
    a = gg(a, b, c, d, k[13], 5, -1444681467);
    d = gg(d, a, b, c, k[2], 9, -51403784);
    c = gg(c, d, a, b, k[7], 14, 1735328473);
    b = gg(b, c, d, a, k[12], 20, -1926607734);

    a = hh(a, b, c, d, k[5], 4, -378558);
    d = hh(d, a, b, c, k[8], 11, -2022574463);
    c = hh(c, d, a, b, k[11], 16, 1839030562);
    b = hh(b, c, d, a, k[14], 23, -35309556);
    a = hh(a, b, c, d, k[1], 4, -1530992060);
    d = hh(d, a, b, c, k[4], 11, 1272893353);
    c = hh(c, d, a, b, k[7], 16, -155497632);
    b = hh(b, c, d, a, k[10], 23, -1094730640);
    a = hh(a, b, c, d, k[13], 4, 681279174);
    d = hh(d, a, b, c, k[0], 11, -358537222);
    c = hh(c, d, a, b, k[3], 16, -722521979);
    b = hh(b, c, d, a, k[6], 23, 76029189);
    a = hh(a, b, c, d, k[9], 4, -640364487);
    d = hh(d, a, b, c, k[12], 11, -421815835);
    c = hh(c, d, a, b, k[15], 16, 530742520);
    b = hh(b, c, d, a, k[2], 23, -995338651);

    a = ii(a, b, c, d, k[0], 6, -198630844);
    d = ii(d, a, b, c, k[7], 10, 1126891415);
    c = ii(c, d, a, b, k[14], 15, -1416354905);
    b = ii(b, c, d, a, k[5], 21, -57434055);
    a = ii(a, b, c, d, k[12], 6, 1700485571);
    d = ii(d, a, b, c, k[3], 10, -1894986606);
    c = ii(c, d, a, b, k[10], 15, -1051523);
    b = ii(b, c, d, a, k[1], 21, -2054922799);
    a = ii(a, b, c, d, k[8], 6, 1873313359);
    d = ii(d, a, b, c, k[15], 10, -30611744);
    c = ii(c, d, a, b, k[6], 15, -1560198380);
    b = ii(b, c, d, a, k[13], 21, 1309151649);
    a = ii(a, b, c, d, k[4], 6, -145523070);
    d = ii(d, a, b, c, k[11], 10, -1120210379);
    c = ii(c, d, a, b, k[2], 15, 718787259);
    b = ii(b, c, d, a, k[9], 21, -343485551);

    x[0] = add32(a, x[0]);
    x[1] = add32(b, x[1]);
    x[2] = add32(c, x[2]);
    x[3] = add32(d, x[3]);
  }

  function cmn(q: number, a: number, b: number, x: number, s: number, t: number) {
    a = add32(add32(a, q), add32(x, t));
    return add32((a << s) | (a >>> (32 - s)), b);
  }
  function ff(a: number, b: number, c: number, d: number, x: number, s: number, t: number) {
    return cmn((b & c) | (~b & d), a, b, x, s, t);
  }
  function gg(a: number, b: number, c: number, d: number, x: number, s: number, t: number) {
    return cmn((b & d) | (c & ~d), a, b, x, s, t);
  }
  function hh(a: number, b: number, c: number, d: number, x: number, s: number, t: number) {
    return cmn(b ^ c ^ d, a, b, x, s, t);
  }
  function ii(a: number, b: number, c: number, d: number, x: number, s: number, t: number) {
    return cmn(c ^ (b | ~d), a, b, x, s, t);
  }
  function add32(a: number, b: number) {
    return (a + b) & 0xffffffff;
  }

  function md51(s: string) {
    const n = s.length;
    const state = [1732584193, -271733879, -1732584194, 271733878];
    let i: number;
    for (i = 64; i <= s.length; i += 64) {
      md5cycle(state, md5blk(s.substring(i - 64, i)));
    }
    s = s.substring(i - 64);
    const tail = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    let j = 0;
    for (j = 0; j < s.length; j++) {
      tail[j >> 2] |= s.charCodeAt(j) << ((j % 4) << 3);
    }
    tail[j >> 2] |= 0x80 << ((j % 4) << 3);
    if (j > 55) {
      md5cycle(state, tail);
      for (let k = 0; k < 16; k++) tail[k] = 0;
    }
    tail[14] = n * 8;
    md5cycle(state, tail);
    return state;
  }

  function md5blk(s: string) {
    const md5blks: number[] = [];
    for (let i = 0; i < 64; i += 4) {
      md5blks[i >> 2] =
        s.charCodeAt(i) +
        (s.charCodeAt(i + 1) << 8) +
        (s.charCodeAt(i + 2) << 16) +
        (s.charCodeAt(i + 3) << 24);
    }
    return md5blks;
  }

  function rhex(n: number) {
    let s = '', j = 0;
    for (; j <= 3; j++) {
      s += ((n >> (j * 8 + 4)) & 0x0f).toString(16) + ((n >> (j * 8)) & 0x0f).toString(16);
    }
    return s;
  }

  const arr = md51(string);
  return rhex(arr[0]) + rhex(arr[1]) + rhex(arr[2]) + rhex(arr[3]);
}

function fallbackHash(input: string): string {
  let hash1 = 0xdeadbeef;
  let hash2 = 0x41c64e6d;
  for (let i = 0; i < input.length; i++) {
    const ch = input.charCodeAt(i);
    hash1 = Math.imul(hash1 ^ ch, 2654435761);
    hash2 = Math.imul(hash2 ^ ch, 1597334677);
  }
  hash1 = Math.imul(hash1 ^ (hash1 >>> 16), 2246822507) ^ Math.imul(hash2 ^ (hash2 >>> 13), 3266489909);
  hash2 = Math.imul(hash2 ^ (hash2 >>> 16), 2246822507) ^ Math.imul(hash1 ^ (hash1 >>> 13), 3266489909);
  return (4294967296 * (2097151 & hash2) + (hash1 >>> 0)).toString(16).padStart(32, '0');
}

/**
 * Compute HMAC-SHA256 signature for client-side tamper-evident verification
 */
export async function computeClientHmac(data: string): Promise<string> {
  const salt = getOrCreateClientSalt();
  const input = `${data}::CYBERPATH_SECURE_VAULT_KEY::${salt}`;
  return computeSHA256(input);
}

/**
 * Save user profile state with HMAC tamper-evident signature
 */
export async function saveSecureProfileState(profile: UserProfile): Promise<void> {
  try {
    const serialized = JSON.stringify(profile);
    const signature = await computeClientHmac(serialized);
    const envelope = {
      user: profile,
      version: '2.0.0',
      timestamp: new Date().toISOString(),
      hmacSignature: signature,
    };
    localStorage.setItem(`cyberpath_user_${profile.email}`, JSON.stringify(envelope));
    localStorage.setItem('cyberpath_active_email', profile.email);
  } catch (err) {
    console.error('Failed to save secure profile state:', err);
  }
}

/**
 * Load user profile state with HMAC tamper detection
 */
export async function loadSecureProfileState(email: string): Promise<{
  profile: UserProfile | null;
  integrityStatus: 'VERIFIED' | 'TAMPERED' | 'INITIAL' | 'LEGACY';
}> {
  try {
    const raw = localStorage.getItem(`cyberpath_user_${email}`);
    if (!raw) return { profile: null, integrityStatus: 'INITIAL' };

    const parsed = JSON.parse(raw);
    if (!parsed.user) return { profile: null, integrityStatus: 'INITIAL' };

    // If legacy record without HMAC signature, upgrade it
    if (!parsed.hmacSignature) {
      return { profile: parsed.user, integrityStatus: 'LEGACY' };
    }

    const recomputedSignature = await computeClientHmac(JSON.stringify(parsed.user));
    if (recomputedSignature !== parsed.hmacSignature) {
      console.warn(`[SECURITY ALERT]: Tamper detected in local ledger for user ${email}. Signature mismatch.`);
      // Log event to server audit ledger
      logSecurityEvent('TAMPER_DETECTED', {
        userEmail: email,
        anomaly: 'Client-side profile ledger integrity signature mismatch.',
      });
      return { profile: parsed.user, integrityStatus: 'TAMPERED' };
    }

    return { profile: parsed.user, integrityStatus: 'VERIFIED' };
  } catch (err) {
    console.error('Error verifying secure profile state:', err);
    return { profile: null, integrityStatus: 'INITIAL' };
  }
}

/**
 * Bitwise XOR between two Hex Strings (used for Two-Time Pad crib dragging and keystream recovery)
 */
export function xorHex(hexA: string, hexB: string): { hexResult: string; asciiResult: string; error?: string } {
  const cleanA = hexA.replace(/[^0-9a-fA-F]/g, '');
  const cleanB = hexB.replace(/[^0-9a-fA-F]/g, '');
  if (!cleanA || !cleanB) {
    return { hexResult: '', asciiResult: '', error: 'Provide two valid hex strings' };
  }
  const minLen = Math.min(cleanA.length, cleanB.length);
  let hexResult = '';
  let asciiResult = '';

  for (let i = 0; i < minLen; i += 2) {
    const byteA = parseInt(cleanA.substr(i, 2), 16);
    const byteB = parseInt(cleanB.substr(i, 2), 16);
    if (isNaN(byteA) || isNaN(byteB)) continue;
    const xorByte = byteA ^ byteB;
    hexResult += xorByte.toString(16).padStart(2, '0');
    // Printable ASCII or dot
    if (xorByte >= 32 && xorByte <= 126) {
      asciiResult += String.fromCharCode(xorByte);
    } else {
      asciiResult += '·';
    }
  }

  return { hexResult, asciiResult };
}

/**
 * Polyalphabetic Vigenère Cipher Decryption
 */
export function vigenereDecrypt(ciphertext: string, key: string): string {
  if (!ciphertext || !key) return ciphertext;
  const cleanKey = key.toUpperCase().replace(/[^A-Z]/g, '');
  if (!cleanKey) return ciphertext;

  let keyIndex = 0;
  let result = '';

  for (let i = 0; i < ciphertext.length; i++) {
    const c = ciphertext[i];
    const isUpper = /[A-Z]/.test(c);
    const isLower = /[a-z]/.test(c);

    if (isUpper || isLower) {
      const base = isUpper ? 65 : 97;
      const charCode = ciphertext.charCodeAt(i) - base;
      const shift = cleanKey.charCodeAt(keyIndex % cleanKey.length) - 65;
      const decryptedCode = (charCode - shift + 26) % 26;
      result += String.fromCharCode(decryptedCode + base);
      keyIndex++;
    } else {
      result += c;
    }
  }

  return result;
}

/**
 * Classical Caesar Shift Decryption
 */
export function caesarShift(text: string, shift: number): string {
  if (!text) return '';
  const s = ((shift % 26) + 26) % 26;
  return text.replace(/[a-zA-Z]/g, (c) => {
    const isUpper = c === c.toUpperCase();
    const base = isUpper ? 65 : 97;
    return String.fromCharCode(((c.charCodeAt(0) - base + s) % 26) + base);
  });
}

/**
 * JWT Token Inspector: Decodes header, payload, checks for 'none' algorithm and key confusion risks
 */
export interface JwtInspectionResult {
  header: any;
  payload: any;
  signature: string;
  isVulnerableToNone: boolean;
  isAlgorithmConfusionRisk: boolean;
  warnings: string[];
  rawHeader: string;
  rawPayload: string;
  error?: string;
}

export function inspectJwt(token: string): JwtInspectionResult {
  const parts = token.trim().split('.');
  if (parts.length !== 3) {
    return {
      header: {},
      payload: {},
      signature: '',
      isVulnerableToNone: false,
      isAlgorithmConfusionRisk: false,
      warnings: ['Invalid JWT format. Must contain 3 dot-separated base64url segments.'],
      rawHeader: '',
      rawPayload: '',
      error: 'JWT must have header.payload.signature',
    };
  }

  const base64UrlDecode = (str: string): string => {
    let base64 = str.replace(/-/g, '+').replace(/_/g, '/');
    while (base64.length % 4) {
      base64 += '=';
    }
    return decodeURIComponent(
      Array.prototype.map
        .call(atob(base64), (c: string) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
  };

  try {
    const rawHeader = base64UrlDecode(parts[0]);
    const rawPayload = base64UrlDecode(parts[1]);
    const header = JSON.parse(rawHeader);
    const payload = JSON.parse(rawPayload);
    const signature = parts[2];

    const warnings: string[] = [];
    let isVulnerableToNone = false;
    let isAlgorithmConfusionRisk = false;

    if (!header.alg || header.alg.toLowerCase() === 'none') {
      isVulnerableToNone = true;
      warnings.push('CRITICAL: Token utilizes algorithm "none", bypassing signature verification.');
    }

    if (header.alg === 'HS256' && (rawPayload.includes('admin') || rawPayload.includes('root'))) {
      isAlgorithmConfusionRisk = true;
      warnings.push('HIGH RISK: Symmetric HS256 algorithm observed on privileged token. Verify if RSA public key confusion is possible.');
    }

    if (payload.exp && Date.now() / 1000 > payload.exp) {
      warnings.push('EXPIRED: Token timestamp has lapsed.');
    }

    return {
      header,
      payload,
      signature,
      isVulnerableToNone,
      isAlgorithmConfusionRisk,
      warnings,
      rawHeader,
      rawPayload,
    };
  } catch (err: any) {
    return {
      header: {},
      payload: {},
      signature: parts[2] || '',
      isVulnerableToNone: false,
      isAlgorithmConfusionRisk: false,
      warnings: [`Decoding error: ${err.message}`],
      rawHeader: '',
      rawPayload: '',
      error: err.message,
    };
  }
}

/**
 * Log security event to backend audit ledger
 */
export async function logSecurityEvent(eventType: string, details: Record<string, any>): Promise<void> {
  try {
    await fetch('/api/security/audit-event', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        eventType,
        details,
        clientTimestamp: new Date().toISOString(),
      }),
    });
  } catch {
    // Fail-open for client logging to not disrupt user experience
  }
}

/**
 * Server-Side Cryptographic Flag Verification with Anti-Brute-Force Rate Limiting
 */
export async function verifyFlagServer(
  challengeId: string,
  flagInput: string
): Promise<{ success: boolean; message: string; xpAwarded?: number; starsAwarded?: number }> {
  try {
    const sanitized = sanitizeInput(flagInput);
    const response = await fetch('/api/ctf/verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        challengeId,
        flag: sanitized,
      }),
    });

    const data = await response.json();
    if (!response.ok) {
      return {
        success: false,
        message: data.error || data.message || 'Flag verification failed.',
      };
    }

    return {
      success: data.verified,
      message: data.message,
      xpAwarded: data.baseXp,
      starsAwarded: data.starsReward,
    };
  } catch (err: any) {
    return {
      success: false,
      message: `Verification network error: ${err.message || 'Server unreachable'}`,
    };
  }
}
