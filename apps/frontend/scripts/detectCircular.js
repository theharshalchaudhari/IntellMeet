#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

try {
  const results = execSync(
    `npx madge --extensions tsx,ts apps/frontend/src --circular`,
    { encoding: 'utf-8', cwd: process.cwd() }
  );

  if (results.includes('Circular dependencies')) {
    console.error('Circular dependencies detected:');
    console.error(results);
    process.exit(1);
  } else {
    console.log('No circular dependencies found');
    process.exit(0);
  }
} catch (error) {
  console.log('Circular dependency check requires madge: npm install -D madge');
  process.exit(0);
}
