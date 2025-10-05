const githubClient = require('../api/github.js');

async function fetchExtensionMetadata(repo) {
  try {
    const [owner, repoName] = repo.full_name.split('/');

    // Fetch the gemini-extension.json file content
    const fileContent = await githubClient.get('GET /repos/{owner}/{repo}/contents/{path}', {
      owner,
      repo: repoName,
      path: 'gemini-extension.json'
    });

    // Decode base64 content
    const jsonContent = Buffer.from(fileContent.content, 'base64').toString('utf-8');
    const extensionData = JSON.parse(jsonContent);

    return {
      extensionName: extensionData.name || '',
      extensionVersion: extensionData.version || '',
      extensionDescription: extensionData.description || '',
      hasMCP: extensionData.mcpServers && Object.keys(extensionData.mcpServers).length > 0 ? 'Yes' : 'No',
      hasContext: extensionData.contextFileName ? 'Yes' : 'No'
    };
  } catch (error) {
    // If file doesn't exist or can't be parsed, return empty metadata
    return {
      extensionName: '',
      extensionVersion: '',
      extensionDescription: '',
      hasMCP: 'No',
      hasContext: 'No'
    };
  }
}

async function enrichReposWithMetadata(repos) {
  console.log('\nFetching extension metadata from repositories...');

  const enrichedRepos = [];
  let count = 0;

  for (const repo of repos) {
    count++;
    if (count % 10 === 0) {
      console.log(`Progress: ${count}/${repos.length}`);
    }

    const metadata = await fetchExtensionMetadata(repo);
    enrichedRepos.push({
      ...repo,
      extensionMetadata: metadata
    });

    // Small delay to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 100));
  }

  console.log(`Completed: ${count}/${repos.length}`);
  return enrichedRepos;
}

module.exports = { enrichReposWithMetadata };
