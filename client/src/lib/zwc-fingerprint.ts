
const ZWC = {
  ZERO: '\u200B',
  ONE: '\u200C',
  TWO: '\u200D',
};

const DELIMITER = ZWC.ZERO + ZWC.ONE + ZWC.TWO + ZWC.ZERO;

export function encodeZWC(conversationId: string | number, messageId: string | number, timestamp: number): string {
  const payload = `${conversationId}|${messageId}|${timestamp}|UUON`;
  const encoder = new TextEncoder();
  const bytes = encoder.encode(payload);
  let zwcString = DELIMITER;

  for (const byte of bytes) {
    let n = byte;
    let base3 = '';
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
