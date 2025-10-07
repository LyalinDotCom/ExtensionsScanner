# GitHub Repository Scanner

A flexible Node.js tool for scanning GitHub repositories from organizations, topics, and specific repos, aggregating their data into JSON format.

## Features

- 📦 Scan entire GitHub organizations
- 🏷️ Search repositories by topic
- 🎯 Fetch specific repositories by name
- 🔄 Automatic deduplication
- 📅 Timestamped output files
- ⚙️ Fully configurable via JSON

## Installation

1. Clone this repository:
```bash
git clone <your-repo-url>
cd ExtensionsScanner
```

2. Install dependencies:
```bash
npm install
```

3. Set up your GitHub token:
```bash
cp .env.example .env
```

4. Edit `.env` and add your GitHub Personal Access Token:
```
GITHUB_TOKEN=your_github_token_here
```

### Creating a GitHub Token

1. Go to [GitHub Settings > Tokens](https://github.com/settings/tokens)
2. Click "Generate new token (classic)"
3. Select scopes:
   - `public_repo` (for public repositories)
   - `repo` (if you need private repositories)
   - `read:user` (optional, for user data)
4. Copy the token and paste it in your `.env` file

## Configuration

Edit `config/config.json` to customize what gets scanned:

```json
{
  "organizations": [
    "gemini-cli-extensions"
  ],
  "topics": [
    "gemini-cli-extensions"
  ],
  "repositories": [
    "owner/repo-name"
  ],
  "output": {
    "filename": "gemini-extensions.json"
  }
}
```

### Configuration Options

- **organizations**: Array of GitHub organization names to scan
- **topics**: Array of topics to search for
- **repositories**: Array of specific repositories in `owner/repo` format
- **output.filename**: Name of the output file (base name without timestamp)

## Usage

Run the scanner:

```bash
npm start
```

Or use the scan command:

```bash
npm run scan
```

Or execute directly:

```bash
./src/index.js
```

## Output

The scanner generates two files in the `output/` directory:

1. **Timestamped file**: `<filename>_YYYY-MM-DDTHH-MM-SS.json` - Historical record
2. **Latest file**: `<filename>.json` - Always contains the most recent scan

### Output Format

Each repository in the JSON includes:

```json
{
  "url": "https://github.com/owner/repo",
  "description": "Repository description",
  "stars": 42,
  "lastUpdated": "2024-01-15T10:30:00Z"
}
```

## Examples

### Scan a single organization

```json
{
  "organizations": ["microsoft"],
  "topics": [],
  "repositories": [],
  "output": {
    "filename": "microsoft-repos.json"
  }
}
```

### Scan multiple topics

```json
{
  "organizations": [],
  "topics": ["nodejs", "typescript", "ai-tools"],
  "repositories": [],
  "output": {
    "filename": "awesome-repos.json"
  }
}
```

### Mix and match

```json
{
  "organizations": ["vercel"],
  "topics": ["nextjs"],
  "repositories": ["facebook/react", "vuejs/vue"],
  "output": {
    "filename": "frontend-frameworks.json"
  }
}
```

## Project Structure

```
ExtensionsScanner/
├── src/
│   ├── api/
│   │   └── github.js              # GitHub API client
│   ├── scanners/
│   │   ├── organizationScanner.js # Organization repo scanner
│   │   ├── topicScanner.js        # Topic search scanner
│   │   └── repositoryScanner.js   # Specific repo scanner
│   ├── utils/
│   │   ├── deduplicator.js        # Deduplication logic
│   │   ├── formatter.js           # Data formatting
│   │   └── fileWriter.js          # JSON file writer
│   └── index.js                   # Main entry point
├── output/                         # Generated JSON files
├── config/
│   └── config.json                # Scanner configuration
├── .env                           # Environment variables (not committed)
├── .env.example                   # Environment template
└── package.json
```

