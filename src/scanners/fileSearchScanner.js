const githubClient = require('../api/github.js');

async function scanReposByFile(filename) {
  console.log(`Searching for repos containing file: ${filename}...`);

  const repoMap = new Map();
  let page = 1;
  let hasMore = true;

  while (hasMore && page <= 10) { // GitHub API max is 1000 results (10 pages)
    const data = await githubClient.get('GET /search/code', {
      q: `filename:${filename}`,
      per_page: 100,
      page: page
    });

    // Extract unique repositories from code search results
    // NOTE: Code search API returns incomplete repo data (no stars, no updated_at)
    // So we collect repo names and fetch full data later
    for (const item of data.items) {
      const repoKey = item.repository.full_name;
      if (!repoMap.has(repoKey)) {
        repoMap.set(repoKey, item.repository.full_name);
      }
    }

    console.log(`  Page ${page}: Found ${data.items.length} code results, ${repoMap.size} unique repos so far`);

    // Continue if we got a full page of results
    hasMore = data.items.length === 100;
    page++;

    // GitHub code search has stricter rate limits, add a small delay
    if (hasMore) {
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }

  const repoNames = Array.from(repoMap.values());
  console.log(`Found ${repoNames.length} unique repos, fetching full data...`);

  // Fetch full repository data for each repo (includes stars, updated_at, etc.)
  const repos = [];
  for (const fullName of repoNames) {
    const [owner, repo] = fullName.split('/');
    try {
      const repoData = await githubClient.get('GET /repos/{owner}/{repo}', {
        owner,
        repo
      });
      repos.push(repoData);

      // Small delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 100));
    } catch (error) {
      console.error(`Failed to fetch full data for ${fullName}: ${error.message}`);
    }
  }

  console.log(`Successfully fetched full data for ${repos.length}/${repoNames.length} repos`);
  return repos;
}

module.exports = { scanReposByFile };
