# PhishGuard ![alt text](Logo.png)

**AI-Powered Phishing Detection for Gmail**

PhishGuard is a Chrome extension that helps users identify potentially malicious emails through AI-powered content analysis and URL reputation checking.

Rather than relying exclusively on known malicious URLs, PhishGuard combines Google Safe Browsing with Google Gemini to identify suspicious email content and explain potential phishing indicators.

## Features

- **Gmail Integration:** Extracts email information directly from opened Gmail messages.
- **URL Reputation:** Checks links against Google Safe Browsing.
- **AI Phishing Analysis:** Uses Gemini to analyze potential social engineering, impersonation, and credential harvesting.
- **Risk Classification:** Categorizes potential threats as LOW, MEDIUM, HIGH, or UNKNOWN.
- **Explainable Results:** Displays suspicious indicators and an understandable threat assessment.

## Technology Stack

| Component | Technology |
|---|---|
| Chrome extension | JavaScript, HTML, CSS |
| Backend | Node.js, Express |
| URL reputation | Google Safe Browsing API v5 |
| AI analysis | Google Gemini API |
| Data exchange | REST APIs and JSON |
| Threat response decoding | Protocol Buffers |

## Getting Started

1. Clone the repository.
2. Install Node.js 18 or later.
3. Navigate to the `backend` directory and run `npm install`.
4. Copy `.env.example` to `.env` and configure your API keys.
5. Start the backend using `node server.js`.
6. Open `chrome://extensions` and enable Developer mode.
7. Select **Load unpacked** and choose the project's extension directory.
8. Open Gmail, select an email, and click **Analyze Email**.

## Limitations

PhishGuard is a hackathon prototype, not a replacement for established email security systems.

- AI assessments may produce false positives or miss phishing attempts.
- A clean Safe Browsing lookup does not guarantee a URL is safe.
- Gmail interface changes may affect email extraction.
- Analysis requires a running local backend and access to external APIs.
- Analyzed email content is sent to the Gemini API. Users should avoid submitting sensitive information without understanding the service's data-handling terms.

## Project Status

Hackathon prototype — active development.

## Author

Luca Lofranco

Computer Science, Trent University