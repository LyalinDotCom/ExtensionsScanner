function formatRepoData(repos) {
  // Sort by stars descending
  const sortedRepos = repos.sort((a, b) => b.stargazers_count - a.stargazers_count);

  // Add rank and format
  return sortedRepos.map((repo, index) => ({
    rank: index + 1,
    url: repo.html_url,
    repoDescription: repo.description || '',
    stars: repo.stargazers_count,
    lastUpdated: repo.updated_at,
    extensionName: repo.extensionMetadata?.extensionName || '',
    extensionVersion: repo.extensionMetadata?.extensionVersion || '',
    extensionDescription: repo.extensionMetadata?.extensionDescription || '',
    hasMCP: repo.extensionMetadata?.hasMCP || 'No',
    hasContext: repo.extensionMetadata?.hasContext || 'No'
  }));
}

module.exports = { formatRepoData };
