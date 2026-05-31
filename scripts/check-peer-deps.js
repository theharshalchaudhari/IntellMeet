const fs = require('fs');
const path = require('path');
const semver = require('semver');

function readJSON(filePath) {
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch (error) {
    return null;
  }
}

function isIgnoredDirectory(directoryName) {
  return (
    directoryName === 'node_modules' ||
    directoryName === 'dist' ||
    directoryName === 'build' ||
    directoryName === 'coverage' ||
    directoryName === '.git' ||
    directoryName === '.astro' ||
    directoryName === '.turbo'
  );
}

function collectPackageJsonFiles(rootDirectory) {
  const packageJsonFiles = [];
  const stack = [rootDirectory];

  while (stack.length) {
    const currentDirectory = stack.pop();
    let entries;

    try {
      entries = fs.readdirSync(currentDirectory, { withFileTypes: true });
    } catch (error) {
      continue;
    }

    for (const entry of entries) {
      const entryPath = path.join(currentDirectory, entry.name);

      if (entry.isDirectory()) {
        if (isIgnoredDirectory(entry.name)) {
          continue;
        }

        stack.push(entryPath);
        continue;
      }

      if (entry.isFile() && entry.name === 'package.json') {
        packageJsonFiles.push(entryPath);
      }
    }
  }

  return packageJsonFiles;
}

function resolvePackageJson(packageName, fromDirectory) {
  return require.resolve(`${packageName}/package.json`, { paths: [fromDirectory] });
}

const root = process.cwd();
const workspaceRoots = ['apps', 'packages', 'services']
  .map((directory) => path.join(root, directory))
  .filter((directory) => fs.existsSync(directory));

if (!workspaceRoots.length) {
  console.error('No workspace roots found.');
  process.exit(2);
}

const packageJsonFiles = workspaceRoots.flatMap((workspaceRoot) => collectPackageJsonFiles(workspaceRoot));
const mismatches = [];
let checkedPackages = 0;

for (const packageJsonPath of packageJsonFiles) {
  const packageJson = readJSON(packageJsonPath);

  if (!packageJson) {
    continue;
  }

  const workspaceDirectory = path.dirname(packageJsonPath);
  const directDependencies = {
    ...packageJson.dependencies,
    ...packageJson.devDependencies,
    ...packageJson.peerDependencies,
  };

  if (!directDependencies.astro) {
    continue;
  }

  let installedAstroVersion;

  try {
    installedAstroVersion = readJSON(resolvePackageJson('astro', workspaceDirectory))?.version;
  } catch (error) {
    console.error(`astro not found for ${packageJsonPath}. Run pnpm install first.`);
    process.exit(2);
  }

  checkedPackages += 1;

  for (const dependencyName of Object.keys(directDependencies)) {
    if (dependencyName === 'astro' || !dependencyName.startsWith('@astrojs/')) {
      continue;
    }

    let dependencyPackage;

    try {
      dependencyPackage = readJSON(resolvePackageJson(dependencyName, workspaceDirectory));
    } catch (error) {
      continue;
    }

    const astroPeerRange = dependencyPackage?.peerDependencies?.astro;

    if (!astroPeerRange) {
      continue;
    }

    if (!semver.satisfies(installedAstroVersion, astroPeerRange, { includePrerelease: true })) {
      mismatches.push({
        packageName: packageJson.name || path.basename(workspaceDirectory),
        packageVersion: packageJson.version || '0.0.0',
        dependencyName,
        dependencyVersion: dependencyPackage.version || 'unknown',
        astroVersion: installedAstroVersion,
        astroPeerRange,
        dependencyPath: resolvePackageJson(dependencyName, workspaceDirectory),
      });
    }
  }
}

if (!checkedPackages) {
  console.log('No workspace Astro packages found.');
  process.exit(0);
}

if (mismatches.length) {
  console.error('Peer dependency mismatches for astro detected:');
  for (const mismatch of mismatches) {
    console.error(
      ` - ${mismatch.packageName}@${mismatch.packageVersion} uses astro ${mismatch.astroVersion} but ${mismatch.dependencyName}@${mismatch.dependencyVersion} expects astro ${mismatch.astroPeerRange} (package: ${mismatch.dependencyPath})`,
    );
  }

  process.exit(1);
}

console.log('All workspace astro peerDependencies satisfied.');
process.exit(0);
