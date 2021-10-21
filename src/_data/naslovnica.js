// required packages
const fetch = require("node-fetch");
const slugify = require('slugify');

// get Objave
async function getNaslovnica() {

	// Objave array
	let svenaslovnice = [];

	try {
		// initiate fetch
		const graphcms = await fetch("https://api-eu-central-1.graphcms.com/v2/ckhhcs4a0ds0501xs7lx6803e/master", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Accept: "application/json",
			},
			body: JSON.stringify({
				query: `{
                    naslovneFotke {
						naslovnaFotka {
							handle
						}
					}
                }`
			})
		});

		// store the JSON response when promise resolves
		const response = await graphcms.json();

		// handle DatoCMS errors
		if (response.errors) {
			let errors = response.errors;
			errors.map((error) => {
				console.log(error.message);
			});
			throw new Error("Aborting: GraphCMS errors");
		}

		// update blogpost array with the data from the JSON response
		svenaslovnice = svenaslovnice.concat(response.data.naslovneFotke);

	} catch (error) {
		throw new Error(error);
	}

	// format blogposts objects
	const formatnaslovnica = svenaslovnice.map((item) => {
		return {
			naslovnica: item.naslovnaFotka.handle,
		};
	}).filter(Boolean);

	// return formatted blogposts
	return formatnaslovnica;
}

// export for 11ty
module.exports = getNaslovnica;