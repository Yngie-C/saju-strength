import { createDecipheriv } from 'crypto';

/**
 * 토스 사용자 정보 AES-256-GCM 복호화
 * 토스 개발자 콘솔에서 제공하는 복호화 키 사용
 */
export function decryptTossUserData(encryptedData: string): Record<string, unknown> {
  const decryptKey = process.env.TOSS_DECRYPT_KEY;
  if (!decryptKey) {
    throw new Error('TOSS_DECRYPT_KEY 환경변수가 설정되지 않았습니다.');
  }

  const buffer = Buffer.from(encryptedData, 'base64');

  // AES-256-GCM: IV(12bytes) + encrypted data + auth tag(16bytes)
  const iv = buffer.subarray(0, 12);
  const authTag = buffer.subarray(buffer.length - 16);
  const encrypted = buffer.subarray(12, buffer.length - 16);

  const decipher = createDecipheriv('aes-256-gcm', Buffer.from(decryptKey, 'base64'), iv);
  decipher.setAuthTag(authTag);

  const decrypted = Buffer.concat([decipher.update(encrypted), decipher.final()]);
  return JSON.parse(decrypted.toString('utf8'));
}
