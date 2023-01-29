// required packages
const fetch = require("node-fetch");

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
					seminariUzivo(stage: PUBLISHED) {
						oblikSeminara
						nazivSeminara
						slug
						kategorija {
							kod
							naziv
							slug
						}
						sifraProizvoda
						shorthand
						naslovnaFotografija {
							handle
						}
						autoriIPredavaci {
							imeIPrezime
							fotografija {
								handle
								url
							}
							oAutoruPredavacu {
								html
							}
						}
						upselling
						prioritetKodIzlistavanja
						cijenaUEur
						trajanjeDana
						popularan
						sazetakSeminara
						opis {
							html
						}
						curriculum {
							html
						}
						promoVideo
						outroVideo
						datumiOdrzavanja (orderBy: dateAndTime_ASC, where: {dateAndTime_gt: $today}){
							dateAndTime
							datum
							dvorana
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
						}
					}
				}`
			})
		});

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
		sviseminari = sviseminari.concat(response.data.seminariUzivo);

	} catch (error) {
		throw new Error(error);
	}
	
	for (const seminar of sviseminari) {
		svelokacije = [];
		for (const datum of seminar.datumiOdrzavanja) {
			svelokacije.push(datum.lokacija)
		}
		if (svelokacije) {
			uniquelocations = [...new Set(svelokacije.map(JSON.stringify))].map(JSON.parse);	
			}
		seminar.svelokacije = uniquelocations;
		if (seminar.trajanjeDana > 1) {
			for (const datum of seminar.datumiOdrzavanja) {
				var drugidan = new Date(datum.dateAndTime);
				drugidan.setDate(drugidan.getDate() + parseInt(1));
				datum.drugiDan = drugidan.toISOString();
			}
		}
	}
	
	// konverzija  EUR -> Kn
	function konverzija(num) {
		var m = Number((Math.abs(num) * 100).toPrecision(15)) * 7.53450;
		return ((Math.round(m) / 100) * Math.sign(num));
	}

	// format seminar objects
	const formatseminari = sviseminari.map((item) => {
		return {
			id: item.id,
			oblik:item.oblikSeminara,
			title: item.nazivSeminara,
			titleslug: item.slug,
			kategorija: item.kategorija.naziv,
			kategorijaslug: item.kategorija.slug,
			kategorijakod: item.kategorija.kod,
			opishtml: item.opis.html,
			opistext: item.opis.text,
			promoVideo: item.promoVideo,
			outroVideo: item.outroVideo,
			excerpt: item.sazetakSeminara,
			sifra: item.sifraProizvoda,
			shorthand: item.shorthand,
			//cijena: item.cijena.toLocaleString('hr-HR') + ' Kn + PDV', // za prikazivanje cijene
			cijena: konverzija(item.cijenaUEur).toLocaleString('hr-HR') + ' Kn + PDV', // za prikazivanje cijene
			//cijenaEUR: konverzija(item.cijena).toLocaleString('hr-HR') + ' EUR + PDV', // za prikazivanje cijene
			cijenaEUR: item.cijenaUEur.toLocaleString('hr-HR') + ' EUR + PDV', // za prikazivanje cijene
			//cijenaCart: item.cijena, // za snipcart odn. jotform
			cijenaCart: konverzija(item.cijenaUEur).toFixed(2), // za snipcart odn. jotform
			//cijenaCartEUR: (item.cijena / 7.53450).toFixed(2), // za snipcart odn. jotform
			cijenaCartEUR: item.cijenaUEur, // za snipcart odn. jotform
			//cijenaPDV: (item.cijena * 1.25).toFixed(2), // za meta tagove
			cijenaPDV: (konverzija(item.cijenaUEur) * 1.25).toFixed(2), // za meta tagove
			//cijenaPDVEUR: (item.cijena / 7.53450 * 1.25).toFixed(2), // za meta tagove
			cijenaPDVEUR: (item.cijenaUEur * 1.25).toFixed(2), // za meta tagove	
			trajanje: item.trajanjeDana,
			curriculum: item.curriculum.html,
			datumiseminara: item.datumiOdrzavanja,
			lokacije: item.svelokacije,
			fotografija: item.naslovnaFotografija.handle,
			fotografijaurl: item.naslovnaFotografija.url,
			predavaci: item.autoriIPredavaci,
			updated: item.updatedAt,
			prioritet: item.prioritetKodIzlistavanja,
			popularan: item.popularan
		};
	}).filter(Boolean);
	
	if (formatseminari === undefined || formatseminari.length == 0) {
		formatseminari.push("prazno");
	}
	// return formatted blogposts
	return formatseminari.sort((a, b) => (a.prioritet - b.prioritet || a.titleslug.localeCompare(b.titleslug)  ))
}

// export for 11ty
module.exports = getSeminari;