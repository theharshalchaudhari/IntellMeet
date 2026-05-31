const fs = require('fs');
const path = require('path');
const semver = require('semver');

function readJSON(p){
  try{ return JSON.parse(fs.readFileSync(p,'utf8')); }catch(e){return null}
}

const root = process.cwd();
const nm = path.join(root,'node_modules');
if(!fs.existsSync(nm)){
  console.error('node_modules not found. Run `pnpm install` first.');
  process.exit(2);
}

function findAstro(dir){
  const stack = [dir];
  while(stack.length){
    const cur = stack.pop();
    let entries;
    try{ entries = fs.readdirSync(cur); }catch(e){ continue }
    for(const e of entries){
      const p = path.join(cur,e);
      const pkg = path.join(p,'package.json');
      try{ const stat = fs.statSync(p); if(stat.isDirectory()){
        if(fs.existsSync(pkg)){
          const pj = readJSON(pkg);
          if(pj && pj.name === 'astro') return {path: pkg, version: pj.version};
        }
        stack.push(p);
      }}catch(e){}
    }
  }
  return null;
}

const astroFound = findAstro(nm);
if(!astroFound){
  console.error('astro not found under node_modules. Run `pnpm install` first.');
  process.exit(2);
}
const astroVersion = astroFound.version;
console.log('Detected astro at', astroFound.path);
console.log('Installed astro:', astroVersion);

let mismatches = [];

function walkAndCheck(dir){
  const stack = [dir];
  while(stack.length){
    const cur = stack.pop();
    let entries;
    try{ entries = fs.readdirSync(cur); }catch(e){ continue }
    for(const e of entries){
      const p = path.join(cur,e);
      const pkg = path.join(p,'package.json');
      try{ const stat = fs.statSync(p); if(stat.isDirectory()){
        if(fs.existsSync(pkg)){
          const pj = readJSON(pkg);
          if(pj && pj.peerDependencies && pj.peerDependencies.astro){
            const range = pj.peerDependencies.astro;
            if(!semver.satisfies(astroVersion, range, { includePrerelease: true })){
              mismatches.push({name: pj.name || e, version: pj.version, range, pkg});
            }
          }
        }
        stack.push(p);
      }}catch(e){}
    }
  }
}

walkAndCheck(nm);

if(mismatches.length){
  console.error('Peer dependency mismatches for astro detected:');
  mismatches.forEach(m => console.error(` - ${m.name}@${m.version} expects astro ${m.range} (package: ${m.pkg})`));
  process.exit(1);
}

console.log('All astro peerDependencies satisfied.');
process.exit(0);
