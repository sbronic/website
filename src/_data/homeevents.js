// required packages
const fetch = require("node-fetch");
const slugify = require("slugify");

// get Seminari
async function getDatumi() {
	// Objave array
	let svidatumi = [];
	let svizoom = [];
	const today = new Date().toISOString();

	try {
		// initiate fetch
		const graphcms = await fetch(
			"https://api-eu-central-1.graphcms.com/v2/ckhhcs4a0ds0501xs7lx6803e/master",
			{
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Accept: "application/json",
				},
				body: JSON.stringify({
					variables: { today },
					query: `query 
										DatumiSeminara($today: DateTime!) {
											datumiSeminara (orderBy: dateAndTime_ASC, stage: PUBLISHED, where: {dateAndTime_gt: $today}) {
													dateAndTime
													popunjen
													dvorana
													lokacija {
															adresa
															grad
															nazivLokacije
													}
													odDo
													seminar {
															nazivSeminara
															cijena
															kategorija {
																	kod
																	naziv
															}
															fotografija {
																	handle
															}
															sazetakSeminara
															autoriIPredavaci {
																	imeIPrezime
															}
													}
											}
										onLineEdukacije(where: {vrstaEdukacije: Zoom_meeting}, stage: PUBLISHED, orderBy: zoomDatumIVrijemePocetka_ASC) {
                        naziv
                        kategorija {
                            id
                            kod
                            naziv
                        }
                        trajanje
                        zoomDatumIVrijemePocetka
												vrstaEdukacije
                    }
									}`,
				}),
			}
		);

		// store the JSON response when promise resolves
		const response = await graphcms.json();

		// handle Hygraph errors
		if (response.errors) {
			let errors = response.errors;
			errors.map((error) => {
				console.log(error.message);
			});
			throw new Error("Aborting: GraphCMS errors");
		}

		// update blogpost array with the data from the JSON response
		svidatumi = svidatumi.concat(response.data.datumiSeminara);
		svizoom = svizoom.concat(response.data.onLineEdukacije);
	} catch (error) {
		throw new Error(error);
	}

	// konverzija u EUR
	function konverzija(num) {
		var m = Number((Math.abs(num) * 100).toPrecision(15)) / 7.5345;
		return (Math.round(m) / 100) * Math.sign(num);
	}

	// format seminar objects
	const formatdatumi = svidatumi
		.map((item) => {
			return {
				datumseminara: item.dateAndTime,
				popunjen: item.popunjen,
				lokacijaadresa: item.lokacija.adresa,
				lokacijagrad: item.lokacija.grad,
				lokacijanaziv: item.lokacija.nazivLokacije,
				dvorana: item.dvorana,
				seminarnaziv: item.seminar.nazivSeminara,
				seminarnazivslug: slugify(item.seminar.nazivSeminara, {
					lower: true,
					strict: true,
				}),
				seminarcijena:
					item.seminar.cijena.toLocaleString("hr-HR") + ",00 Kn + PDV",
				seminarcijenaEUR:
					konverzija(item.seminar.cijena).toLocaleString("hr-HR") +
					" EUR + PDV", // za prikazivanje cijene
				kategorijanaziv: item.seminar.kategorija.naziv,
				kategorijaslug: slugify(item.seminar.kategorija.naziv, {
					lower: true,
					strict: true,
				}),
				kategorijakod: item.seminar.kategorija.kod,
				photo: item.seminar.fotografija.handle,
				excerpt: item.seminar.sazetakSeminara,
				predavaci: item.seminar.autoriIPredavaci,
				vrijeme: item.odDo,
			};
		})
		.filter(Boolean);

	if (formatdatumi === undefined || formatdatumi.length == 0) {
		formatdatumi.push("prazno");
	}

	// format zoom objects
	const formatedukacije = svizoom
		.map((item) => {
			const now = Date.now();
			const futureDates = item.zoomDatumIVrijemePocetka.filter((date) => {
				// Filter out dates in the past or falsey values
				return date && new Date(date).getTime() > now;
			});

			return {
				title: item.naziv,
				titleslug: slugify(item.naziv, { lower: true, strict: true }),
				category: item.kategorija.naziv,
				categoryslug: slugify(item.kategorija.naziv, {
					lower: true,
					strict: true,
				}),
				trajanje: item.trajanje,
				zoomDatumIVrijemePocetka: futureDates,
			};
		})
		.filter(Boolean);

	var sortzoommeetings = [];
	var zoommeetings = []

	if (formatedukacije === undefined || formatedukacije.length == 0) {
		formatedukacije.push("prazno");
	} else {
		var zoomlist = {};
		var zoomitems = [];
		zoomlist.zoomitems = zoomitems;
		formatedukacije.forEach((zoom) => {
			var zoomdates = zoom.zoomDatumIVrijemePocetka;
			if (zoomdates.length) {
				zoomdates.forEach((zoomdate) => {
					var zoomitem = {
						title: zoom.title,
						titleslug: zoom.titleslug,
						category: zoom.category,
						categoryslug: zoom.categoryslug,
						zoomDatumIVrijemePocetka: zoomdate,
						trajanje: zoom.trajanje,
						datumseminara: zoomdate
					};
					zoomlist.zoomitems.push(zoomitem);
				});
			}
		});

		zoommeetings = zoomlist.zoomitems;
	
		sortzoommeetings = zoommeetings.sort((a, b) => {
			return (
				new Date(a.zoomDatumIVrijemePocetka) -
				new Date(b.zoomDatumIVrijemePocetka)
			); // descending
		});
	}

	const combined = sortzoommeetings.concat(formatdatumi)
	
	const sortcombined = combined.sort((a, b) => {
		return (
			new Date(a.datumseminara) -
			new Date(b.datumseminara)
		); // descending
	});
	
	// return formatted blogposts
	return sortcombined;
}

// export for 11ty
module.exports = getDatumi;
