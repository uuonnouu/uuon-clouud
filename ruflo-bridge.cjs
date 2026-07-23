const express = require("express");
const { exec } = require("child_process");

const app = express();
app.use(express.json());

const PORT = 3030;
const AUTH = process.env.RUFLO_SECRET || "change-me";

app.post("/task", async (req, res) => {
  const { token, task } = req.body;

  if (token !== AUTH) {
    return res.status(403).json({ error: "unauthorized" });
  }

  if (!task) {
    return res.status(400).json({ error: "missing task" });
  }

  exec(`npx ruflo run "${task}"`, (err, stdout, stderr) => {
    if (err) {
      return res.status(500).json({
        error: err.message,
        stderr: stderr?.toString()
      });
    }

    res.json({
      task,
      output: stdout.toString()
    });
  });
});

app.get("/status", (req, res) => {
  res.json({ status: "ruflo-bridge-online" });
});

app.listen(PORT, () => {
  console.log(`Ruflo bridge running on port ${PORT}`);
});