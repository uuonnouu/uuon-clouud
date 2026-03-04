
const ZWC = {
  ZERO: '\u200B', // zero-width space
  ONE: '\u200C',  // zero-width non-joiner
  TWO: '\u200D',  // zero-width joiner
};

const DELIMITER = ZWC.ZERO + ZWC.ONE + ZWC.TWO + ZWC.ZERO; // Pattern to mark start/end

export function encodeFingerprint(sessionId: string, timestamp: number): string {
  const payload = `${sessionId}|${timestamp}|UUON`;
  const buffer = Buffer.from(payload, 'utf8');
  let zwcString = DELIMITER;

  for (const byte of buffer) {
    let n = byte;
    let base3 = '';
    // Each byte (0-255) can be represented by up to 6 base-3 digits (3^5=243, 3^6=729)
    // To keep it fixed length and easier to parse, we'll use 6 digits.
    for (let i = 0; i < 6; i++) {
      const digit = n % 3;
      base3 = digit.toString() + base3;
      n = Math.floor(n / 3);
    }

    for (const char of base3) {
      if (char === '0') zwcString += ZWC.ZERO;
      else if (char === '1') zwcString += ZWC.ONE;
      else if (char === '2') zwcString += ZWC.TWO;
    }
  }

  zwcString += DELIMITER;
  return zwcString;
}

export function decodeFingerprint(text: string): { sessionId: string; timestamp: number; valid: boolean } {
  const startIdx = text.indexOf(DELIMITER);
  if (startIdx === -1) return { sessionId: '', timestamp: 0, valid: false };

  const endIdx = text.indexOf(DELIMITER, startIdx + DELIMITER.length);
  if (endIdx === -1) return { sessionId: '', timestamp: 0, valid: false };

  const zwcPayload = text.substring(startIdx + DELIMITER.length, endIdx);
  if (zwcPayload.length % 6 !== 0) return { sessionId: '', timestamp: 0, valid: false };

  const bytes: number[] = [];
  for (let i = 0; i < zwcPayload.length; i += 6) {
    const chunk = zwcPayload.substring(i, i + 6);
    let n = 0;
    for (let j = 0; j < 6; j++) {
      const char = chunk[j];
      let digit = 0;
      if (char === ZWC.ZERO) digit = 0;
      else if (char === ZWC.ONE) digit = 1;
      else if (char === ZWC.TWO) digit = 2;
      n = n * 3 + digit;
    }
    bytes.push(n);
  }

  try {
    const decoded = Buffer.from(bytes).toString('utf8');
    const parts = decoded.split('|');
    if (parts.length === 3 && parts[2] === 'UUON') {
      return {
        sessionId: parts[0],
        timestamp: parseInt(parts[1], 10),
        valid: true,
      };
    }
  } catch (e) {
    // Ignore decoding errors
  }

  return { sessionId: '', timestamp: 0, valid: false };
}

export function stripFingerprint(text: string): string {
  const zwcRegex = new RegExp(`[${ZWC.ZERO}${ZWC.ONE}${ZWC.TWO}]`, 'g');
  return text.replace(zwcRegex, '');
}
