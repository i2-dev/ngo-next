#!/usr/bin/env node

/**
 * 緩存清理腳本
 * 用法: node scripts/clear-cache.js [type]
 * 例如: node scripts/clear-cache.js news
 */

const { spawn } = require('child_process');

const type = process.argv[2];
const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000';

let url = `${baseUrl}/api/cache`;
if (type) {
  url += `?type=${type}`;
}

const curl = spawn('curl', ['-X', 'DELETE', url], {
  stdio: 'inherit'
});

curl.on('close', (code) => {
  if (code === 0) {
    console.log('\n✅ Cache cleared successfully');
  } else {
    console.log('\n❌ Failed to clear cache');
  }
});

curl.on('error', (err) => {
  console.error('Error running curl:', err);
  console.log('\nAlternatively, you can run:');
  console.log(`curl -X DELETE ${url}`);
});
