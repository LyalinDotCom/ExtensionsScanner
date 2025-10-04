function formatRepoData(repos) {
  return repos.map(repo => ({
    url: repo.html_url,
    description: repo.description || '',
    stars: repo.stargazers_count,
    lastUpdated: repo.updated_at
  }));
}

module.exports = { formatRepoData };
