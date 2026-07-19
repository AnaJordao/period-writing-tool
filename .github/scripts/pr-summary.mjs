import fs from "fs";
import { XMLParser } from "fast-xml-parser";

const parser = new XMLParser({
  ignoreAttributes: false,
});

function readJUnit(path) {
  const xml = fs.readFileSync(path, "utf8");
  const report = parser.parse(xml);

  const suite = report.testsuites?.testsuite ?? report.testsuite;

  return {
    tests: Number(suite["@_tests"] ?? 0),
    failures: Number(suite["@_failures"] ?? 0),
    skipped: Number(suite["@_skipped"] ?? 0),
    time: Number(suite["@_time"] ?? 0),
  };
}

function readCoverage(path) {
  const json = JSON.parse(fs.readFileSync(path, "utf8"));

  return json.total;
}

const frontendTests = readJUnit("test-results/frontend-tests.xml");

const backendTests = readJUnit("backend/test-results/backend-tests.xml");

const frontendCoverage = readCoverage("coverage/coverage-summary.json");

const backendCoverage = readCoverage("backend/coverage/coverage-summary.json");

const totalTests = frontendTests.tests + backendTests.tests;

const totalFailures = frontendTests.failures + backendTests.failures;

const totalCovered =
  frontendCoverage.lines.covered + backendCoverage.lines.covered;

const totalLines = frontendCoverage.lines.total + backendCoverage.lines.total;

const overallCoverage = ((totalCovered / totalLines) * 100).toFixed(1);

const success = totalFailures === 0;

const markdown = `# 🚀 CI Report

## ${success ? "✅ Summary" : "❌ Summary"}

| Check | Status |
|:------|:------:|
| 🧪 Frontend Tests | ${frontendTests.failures ? "❌" : "✅"} |
| 🧪 Backend Tests | ${backendTests.failures ? "❌" : "✅"} |
| 📊 Coverage | ✅ |

**Overall:** **${totalTests} tests • ${totalFailures} failures • ${overallCoverage}% coverage**

---

<details>
<summary>🧪 Test Results</summary>

### Frontend

| Metric | Value |
|---------|------:|
| Passed | ${frontendTests.tests - frontendTests.failures - frontendTests.skipped} |
| Failed | ${frontendTests.failures} |
| Skipped | ${frontendTests.skipped} |
| Time | ${frontendTests.time}s |

### Backend

| Metric | Value |
|---------|------:|
| Passed | ${backendTests.tests - backendTests.failures - backendTests.skipped} |
| Failed | ${backendTests.failures} |
| Skipped | ${backendTests.skipped} |
| Time | ${backendTests.time}s |

</details>

---

<details>
<summary>📊 Coverage</summary>

| Metric | Frontend | Backend |
|---------|---------:|---------:|
| Lines | ${frontendCoverage.lines.pct}% | ${backendCoverage.lines.pct}% |
| Statements | ${frontendCoverage.statements.pct}% | ${backendCoverage.statements.pct}% |
| Branches | ${frontendCoverage.branches.pct}% | ${backendCoverage.branches.pct}% |
| Functions | ${frontendCoverage.functions.pct}% | ${backendCoverage.functions.pct}% |

**Overall Coverage:** **${overallCoverage}%**

</details>

---

<details>
<summary>📦 Reports</summary>

- ✅ Frontend JUnit
- ✅ Backend JUnit
- ✅ Frontend LCOV
- ✅ Backend LCOV

</details>

---

*Generated automatically by GitHub Actions.*
`;

fs.writeFileSync("pr-comment.md", markdown);
