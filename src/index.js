#!/usr/bin/env node

require('dotenv').config();
const fs = require('fs').promises;
const path = require('path');
const { scanOrganizationRepos } = require('./scanners/organizationScanner');
const { scanReposByTopic } = require('./scanners/topicScanner');
const { scanSpecificRepos } = require('./scanners/repositoryScanner');
const { deduplicateRepos } = require('./utils/deduplicator');
const { formatRepoData } = require('./utils/formatter');
const { writeJSON } = require('./utils/fileWriter');

async function loadConfig() {
  const configPath = path.join(__dirname, '../config/config.json');
  const configFile = await fs.readFile(configPath, 'utf-8');
  return JSON.parse(configFile);
}

async function main() {
  console.log('GitHub Scanner starting...\n');

  // Load configuration
  const config = await loadConfig();
  const allRepoSets = [];

  // Scan organizations
  if (config.organizations && config.organizations.length > 0) {
    for (const org of config.organizations) {
      const repos = await scanOrganizationRepos(org);
      allRepoSets.push(repos);
    }
  }

  // Scan by topics
  if (config.topics && config.topics.length > 0) {
    for (const topic of config.topics) {
      const repos = await scanReposByTopic(topic);
      allRepoSets.push(repos);
    }
  }

  // Scan specific repositories
  if (config.repositories && config.repositories.length > 0) {
    const repos = await scanSpecificRepos(config.repositories);
    allRepoSets.push(repos);
  }

  // Deduplicate
  const allRepos = deduplicateRepos(allRepoSets);
  console.log(`\nTotal unique repos: ${allRepos.length}`);

  // Format and save
  const formattedData = formatRepoData(allRepos);
  const outputFilename = config.output?.filename || 'repositories.json';
  await writeJSON(outputFilename, formattedData);

  console.log('\nScan complete!');
}

main().catch(console.error);
