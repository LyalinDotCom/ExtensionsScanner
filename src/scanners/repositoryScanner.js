const githubClient = require('../api/github.js');

async function scanSpecificRepos(repoFullNames) {
  console.log(`Scanning ${repoFullNames.length} specific repositories...`);

  const repos = [];

  for (const fullName of repoFullNames) {
    const [owner, repo] = fullName.split('/');
    try {
      const data = await githubClient.get('GET /repos/{owner}/{repo}', {
        owner,
        repo
      });
      repos.push(data);
    } catch (error) {
      console.error(`Failed to fetch ${fullName}: ${error.message}`);
    }
  }

  console.log(`Successfully fetched ${repos.length} specific repos`);
  return repos;
}

module.exports = { scanSpecificRepos };
