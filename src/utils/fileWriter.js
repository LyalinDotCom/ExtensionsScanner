const fs = require('fs').promises;
const path = require('path');

function getTimestampedFilename(baseFilename) {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
  const ext = path.extname(baseFilename);
  const name = path.basename(baseFilename, ext);
  return `${name}_${timestamp}${ext}`;
}

async function writeJSON(filename, data) {
  const outputDir = path.join(__dirname, '../../output');

  // Write timestamped version
  const timestampedFilename = getTimestampedFilename(filename);
  const timestampedPath = path.join(outputDir, timestampedFilename);
  await fs.writeFile(timestampedPath, JSON.stringify(data, null, 2));
  console.log(`✓ Written to ${timestampedFilename}`);

  // Write latest version (overwrites previous)
  const latestPath = path.join(outputDir, filename);
  await fs.writeFile(latestPath, JSON.stringify(data, null, 2));
  console.log(`✓ Updated ${filename}`);
}

module.exports = { writeJSON };
