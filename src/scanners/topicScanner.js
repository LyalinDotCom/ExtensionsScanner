const githubClient = require('../api/github.js');

async function scanReposByTopic(topic) {
  console.log(`Scanning repos with topic: ${topic}...`);

  const repos = [];
  let page = 1;
  let hasMore = true;

  while (hasMore) {
    const data = await githubClient.get('GET /search/repositories', {
      q: `topic:${topic} fork:true`,
      per_page: 100,
      page: page
    });

    repos.push(...data.items);
    hasMore = data.items.length === 100 && repos.length < data.total_count;
    page++;
  }

  console.log(`Found ${repos.length} repos with topic ${topic}`);
  return repos;
}

module.exports = { scanReposByTopic };
