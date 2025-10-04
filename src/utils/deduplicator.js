function deduplicateRepos(reposArrays) {
  const repoMap = new Map();

  // Flatten all arrays and dedupe by full_name (owner/repo)
  reposArrays.flat().forEach(repo => {
    if (!repoMap.has(repo.full_name)) {
      repoMap.set(repo.full_name, repo);
    }
  });

  return Array.from(repoMap.values());
}

module.exports = { deduplicateRepos };
