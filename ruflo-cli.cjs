const fs = require("fs");
const { execSync } = require("child_process");

const task = process.argv.slice(2).join(" ");

const output = execSync(`npx ruflo run "${task}"`, {
  encoding: "utf-8",
  timeout: 30000
});

fs.writeFileSync(
  "ruflo-last-output.json",
  JSON.stringify({ task, output, timestamp: Date.now() }, null, 2)
);

console.log(output);
