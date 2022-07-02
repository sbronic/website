// required packages
const fetch = require("node-fetch");
const slugify = require('slugify');

// get Objave
async function getSeminari() {

	// Objave array
	let sviseminari = [];
	const today = new Date().toISOString();

	try {
		// initiate fetch
		const graphcms = await fetch("https://api-eu-central-1.graphcms.com/v2/ckhhcs4a0ds0501xs7lx6803e/master", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Accept: "application/json",
			},
			body: JSON.stringify({
				variables: {
					today
				},
				query: `query Seminari($today: DateTime!) {
                    seminari(stage: PUBLISHED) {
                        id
                        nazivSeminara
                        kategorija {
                            naziv
                            kod
                        }
                        opis {
                            html
                            text
                        }
                        promoVideo
                        outroVideo
                        sazetakSeminara
                        sifraProizvoda
												shorthand
                        cijena
                        trajanjeDana
                        updatedAt
												prioritetKodIzlistavanja
                        curriculum {
                            html
                        }
                        datumiSeminara (orderBy: dateAndTime_ASC, where: {dateAndTime_gt: $today}) {
                            dateAndTime
                            popunjen
                            odDo
                            lokacija {
                                nazivLokacije
                                adresa
                                grad
																napomeneLokacije {
																	html
																}
                            }
														dvorana
                        }
                        fotografija {
                            handle
                            url
                        }
                        autoriIPredavaci {
                            fotografija {
                                handle
                            }
                            imeIPrezime
                            oAutoruPredavacu {
                                html
                            }
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
		sviseminari = sviseminari.concat(response.data.seminari);

	} catch (error) {
		throw new Error(error);
	}

	for (const seminar of sviseminari) {
		svelokacije = [];
		for (const datum of seminar.datumiSeminara) {
			svelokacije.push(datum.lokacija)
		}
		if (svelokacije) {
			uniquelocations = [...new Set(svelokacije.map(JSON.stringify))].map(JSON.parse);	
			}
		seminar.svelokacije = uniquelocations;
		if (seminar.trajanjeDana > 1) {
			for (const datum of seminar.datumiSeminara) {
				var drugidan = new Date(datum.dateAndTime);
				drugidan.setDate(drugidan.getDate() + parseInt(1));
				datum.drugiDan = drugidan.toISOString();
			}
		}
	}
	
	// konverzija u EUR
	function konverzija(num) {
		var m = Number((Math.abs(num) * 100).toPrecision(15)) / 7.53450;
		return ((Math.round(m) / 100) * Math.sign(num));
	}

	// format seminar objects
	const formatseminari = sviseminari.map((item) => {
		return {
			id: item.id,
			title: item.nazivSeminara,
			titleslug: slugify(item.nazivSeminara, {
				lower: true,
				strict: true
			}),
			kategorija: item.kategorija.naziv,
			kategorijaslug: slugify(item.kategorija.naziv, {
				lower: true,
				strict: true
			}),
			kategorijakod: item.kategorija.kod,
			opishtml: item.opis.html,
			opistext: item.opis.text,
			promoVideo: item.promoVideo,
			outroVideo: item.outroVideo,
			excerpt: item.sazetakSeminara,
			sifra: item.sifraProizvoda,
			shorthand: item.shorthand,
			cijena: item.cijena.toLocaleString('hr-HR') + ' Kn + PDV', // za prikazivanje cijene
			cijenaEUR: konverzija(item.cijena).toLocaleString('hr-HR') + ' EUR + PDV', // za prikazivanje cijene
			cijenaCart: item.cijena, // za snipcart odn. jotform
			cijenaCartEUR: (item.cijena / 7.53450).toFixed(2), // za snipcart odn. jotform
			cijenaPDV: (item.cijena * 1.25).toFixed(2), // za meta tagove
			cijenaPDVEUR: (item.cijena / 7.53450 * 1.25).toFixed(2), // za meta tagove
			popustCartOsoba: (item.cijena * 0.25).toFixed(2),
			popustCartNgo: (item.cijena * 0.50).toFixed(2),
			trajanje: item.trajanjeDana,
			curriculum: item.curriculum.html,
			datumiseminara: item.datumiSeminara,
			lokacije: item.svelokacije,
			fotografija: item.fotografija.handle,
			fotografijaurl: item.fotografija.url,
			predavaci: item.autoriIPredavaci,
			updated: item.updatedAt,
			prioritet: item.prioritetKodIzlistavanja
		};
	}).filter(Boolean);
	
	if (formatseminari === undefined || formatseminari.length == 0) {
		formatseminari.push("prazno");
	}
	// return formatted blogposts
	return formatseminari.sort((a,b) => {
		if (a.prioritet === b.prioritet){
			return a.title < b.title ? -1 : 1
		} else {
			return a.prioritet < b.prioritet ? -1 : 1
		}
	})
}

// export for 11ty
module.exports = getSeminari;