# Security Policy

## Supported Versions

| Version         | Supported   |
| --------------- | ----------- |
| `main`          | supported   |
| legacy branches | unsupported |

---

## Reporting a Vulnerability

Do not disclose vulnerabilities publicly.

Report security issues through:

* GitHub Security Advisories
* approved private contact channels

Include:

* affected service or component
* reproduction steps
* impact assessment
* proof of concept if applicable

Reports are reviewed privately. Validated issues are prioritized based on severity and resolved before disclosure when applicable.

---

## Repository Protection

The `main` branch is protected.

The following controls may be enforced:

* pull request requirements
* required reviews
* passing CI checks
* restricted pushes
* signed commits
* deployment approvals

Direct modification of protected branches is restricted to authorized maintainers.

---

## Access & Secrets

Repository, infrastructure, deployment, and production access are restricted to authorized maintainers.

Never commit:

* API keys
* tokens
* credentials
* private keys
* environment secrets

Use managed secrets and environment variables instead.

---

## Dependency & Build Security

Dependencies must remain:

* pinned
* reviewable
* reproducible

Do not modify `node_modules` or bypass CI validation.

All infrastructure, SSR, authentication, and deployment-related dependency updates should be validated before merge.
