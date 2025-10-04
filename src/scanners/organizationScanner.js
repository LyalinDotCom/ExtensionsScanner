const githubClient = require('../api/github.js');

async function scanOrganizationRepos(orgName) {
  console.log(`Scanning organization: ${orgName}...`);

  const repos = [];
  let page = 1;
  let hasMore = true;

  while (hasMore) {
    const data = await githubClient.get('GET /orgs/{org}/repos', {
      org: orgName,
      per_page: 100,
      page: page
    });

    repos.push(...data);
    hasMore = data.length === 100;
    page++;
  }

  console.log(`Found ${repos.length} repos in ${orgName}`);
  return repos;
}

module.exports = { scanOrganizationRepos };
