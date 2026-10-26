# Question verification gate

Runs every question in the catalog through a real SQL engine and flags the ones that are broken,
mismatched, templated, or too easy to hardcode.

## Setup
```bash
npm i -D zod          # only new dependency
# requires Node >= 22.13 (uses the built-in node:sqlite, no native modules)
```
Add to `package.json`:
```json
"scripts": { "verify:questions": "tsx scripts/verify-questions/verify.ts" }
```

## Run
```bash
npm run verify:questions                          # all catalogs, exits 1 on any error
npm run verify:questions -- --platform=LeetCode   # one catalog
npm run verify:questions -- --fail-on=never       # report only
npm run verify:questions -- --min-rows=10 --cluster=5
```
Writes `reports/question-verification.json`. Add `reports/` to `.gitignore`.

## Finding codes
| Code | Severity | Meaning |
|---|---|---|
| SCHEMA / DUPLICATE_ID | error | Fails the zod shape, or id reused |
| NO_SOLUTION / PLACEHOLDER_SOLUTION | error | Missing reference SQL, or contains `...`/TODO |
| EXPECTED_MISMATCH | error | Reference SQL run in SQLite does not reproduce the stored expectedOutput |
| EXEC_EMPTY / EXPECTED_EMPTY | error | Zero-row result on the sample data |
| TOPIC_MISMATCH | error | Tag says `window`/`ctes`/`joins`/... but the SQL doesn't use it |
| NONDETERMINISTIC | error/warn | Two runs differ, or uses RANDOM()/NOW() |
| EXEC_FAILED | warn | SQLite couldn't run it (often dialect-specific SQL). **Unverified, not necessarily broken** |
| UNSTABLE_ORDER | warn | LIMIT/TOP without a top-level ORDER BY |
| TINY_DATA | warn | Fewer than `--min-rows` rows in total: trivially hardcodable |
| TEMPLATED / DUPLICATE_SOLUTION | warn | Many questions share one scenario template or one normalized solution |

## Caveats
- SQLite is a real engine but not Postgres/MySQL/Snowflake/BigQuery. Use `EXEC_FAILED` as a to-do list for a
  Postgres check (PGlite or a container), not as proof of breakage.
- Title-vs-content mismatches (e.g. a "latest version" question whose SQL returns every version) can only be
  partly caught automatically. `EXPECTED_MISMATCH` and `TEMPLATED` are the best proxies; spot-check by hand.
