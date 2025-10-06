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
    for (const item of data.items) {
      const repoKey = item.repository.full_name;
      if (!repoMap.has(repoKey)) {
        repoMap.set(repoKey, item.repository);
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

  const repos = Array.from(repoMap.values());
  console.log(`Found ${repos.length} unique repos containing ${filename}`);
  return repos;
}

module.exports = { scanReposByFile };
