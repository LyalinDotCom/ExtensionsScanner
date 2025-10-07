function deduplicateRepos(reposArrays, excludedUrls = []) {
  const repoMap = new Map();

  // Normalize excluded URLs to full_name format (owner/repo)
  const excludedNames = excludedUrls.map(url => {
    const match = url.match(/github\.com\/([^\/]+\/[^\/]+)/);
    return match ? match[1] : null;
  }).filter(Boolean);

  // Flatten all arrays and dedupe by full_name (owner/repo)
  reposArrays.flat().forEach(repo => {
    if (!repoMap.has(repo.full_name) && !excludedNames.includes(repo.full_name)) {
      repoMap.set(repo.full_name, repo);
    }
  });

  return Array.from(repoMap.values());
}

module.exports = { deduplicateRepos };
