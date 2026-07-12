1. Never edit, delete, or reorganize anything in /Raw. It is the immutable source of truth.
2. New files are added to /Raw by content hash — if a file's hash matches one already there, skip it; if changed, add a new timestamped copy alongside the old one. Never overwrite.
3. /Wiki is generated from /Raw, not hand-authored. It can be regenerated or edited freely. Every /Wiki page must cite which /Raw file(s) it came from.
