import fs from "fs";
const backup = JSON.parse(fs.readFileSync("/tmp/backup-shape_token_ledger.json", "utf8"));

console.log("total rows:", backup.length);

// genesis anchor check
const genesis = backup.filter(r => r.token_id?.includes("GENESIS"));
console.log("genesis rows:", JSON.stringify(genesis, null, 2));

// shape_type diversity over time — does variety/rate look like a bot loop or organic use?
const byHour = {};
for (const r of backup) {
  const hr = r.created_at?.slice(0,13);
  byHour[hr] = (byHour[hr]||0) + 1;
}
console.log("rows per hour:", byHour);

// distinct issuance_tx_id patterns, and whether equationSnapshot/mathematicalProperties (real interaction payloads) are present
console.log("sample with full fields:", JSON.stringify(backup[Math.floor(backup.length/2)], null, 2));
