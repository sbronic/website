const fs = require("fs");
const MinifyCSS = require("clean-css");
const postCSS = require('postcss');
const purgeCSS = require('@fullhuman/postcss-purgecss');

module.exports = async function () {
	// You must create the folder structure first.
	// WriteFile does not create files if parent folders are missing
	if (!fs.existsSync('_site')) { fs.mkdirSync('_site'); }
	if (!fs.existsSync('_site/css')) { fs.mkdirSync('_site/css'); }

	// Create a custom, purged, version of Bootstrap
	const sourceCSS = "src/css/styles.css";
	const destinationCSS = "_site/css/style.css";
	// Add in your file types here
	const sourceContent = [
		'src/**/*.njk',
		'src/**/*.html',
		'src/**/*.md',
		'src/**/*.liquid',
		'src/**/*.js'
	];

	fs.readFile(sourceCSS, (err, css) => {
		postCSS([
			// Purge CSS will scan through and remove the styles 
			// that aren't in your project
			purgeCSS({
				content: sourceContent,
				variables: true,
				keyframes: true
			})
		])
			.process(css, {
				from: sourceCSS,
				to: destinationCSS
			})
			.then(result => {
				// Combine with Reboot
				let allCSS = result.css;
				//let rebootCSS = fs.readFileSync('src/css/_reboot.css');
				//let allCSS = rebootCSS + newCSS;

				// Minify
				let compiledCSS = new MinifyCSS().minify(allCSS)['styles'];

				// Save
				fs.writeFileSync(destinationCSS, compiledCSS, { encoding: "utf8" })
			})
			.catch(error => {
				console.log(error)
			});
	})
};