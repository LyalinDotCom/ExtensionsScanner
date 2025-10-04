const { Octokit } = require('@octokit/rest');
require('dotenv').config();

class GitHubClient {
  constructor() {
    this.octokit = new Octokit({
      auth: process.env.GITHUB_TOKEN
    });
  }

  async get(endpoint, params = {}) {
    try {
      const response = await this.octokit.request(endpoint, params);
      return response.data;
    } catch (error) {
      console.error(`Error fetching ${endpoint}:`, error.message);
      throw error;
    }
  }
}

module.exports = new GitHubClient();
