## File & search rules
- NEVER use Read tool — always Bash: `cat file` or `rtk read file`
- NEVER use Grep tool — always Bash: `rg "pattern" .` or `rtk grep "pattern" .`
- NEVER use Glob tool — always Bash: `find . -name "*.ts"` or `rtk find "*.ts" .`

## Output rules
- Return ONLY changed code, never full files unless asked
- No preamble, no closing summary
- Diffs > 50 lines: patch format only
- Never full stack traces — summarize: file, line, error type