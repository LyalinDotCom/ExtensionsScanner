const githubClient = require('../api/github.js');

async function scanReposByFile(filename) {
  console.log(`Searching for repos containing file: ${filename}...`);

  const repos = [];
  let page = 1;
  let hasMore = true;

  while (hasMore) {
    const data = await githubClient.get('GET /search/code', {
      q: `filename:${filename}`,
      per_page: 100,
      page: page
    });

    // Extract unique repositories from code search results
    const repoUrls = new Set();
    for (const item of data.items) {
      if (!repoUrls.has(item.repository.url)) {
        repoUrls.add(item.repository.url);
        repos.push(item.repository);
      }
    }

    hasMore = data.items.length === 100 && repos.length < data.total_count;
    page++;

    // GitHub code search has stricter rate limits, add a small delay
    if (hasMore) {
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }

  console.log(`Found ${repos.length} repos containing ${filename}`);
  return repos;
}

module.exports = { scanReposByFile };
