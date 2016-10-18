const packages = ['./', './node_modules/island/', './node_modules/island-keeper/'];
packages.forEach(d => {
	const p = require(d + 'package.json');
	console.log(p.name, p.version);
});
const versions = process.versions;
console.log('v8', versions.v8);
console.log('node', versions.node);

