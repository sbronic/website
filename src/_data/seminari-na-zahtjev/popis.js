// required packages
const fetch = require("node-fetch");

// get Objave
async function getOnDemand() {
    
    // Objave array
    let sveedukacije = [];

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
                    seminariNaZahtjev(orderBy: prioritetKodIzlistavanja_ASC, stage: PUBLISHED) {
                        oblikSeminara
												naziv
												slug
												sifraProizvoda
												shorthand
												kategorija {
													kod
													naziv
													slug
												}
												prioritetKodIzlistavanja
												autoriIPredavaci {
													imeIPrezime
													fotografija {
															handle
													}
													oAutoruPredavacu {
															html
													}
												}
												cijenaUEur
												cijena
												fotografija {
													handle
													url
												}
												trajanje
												popularan
												sazetak
												opisEdukacije {
													html
												}
												curriculum {
													html
												}
												preview
												promoVideo
												outroVideo
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
        sveedukacije = sveedukacije.concat(response.data.seminariNaZahtjev);

    } catch (error) {
        throw new Error(error);
    }

		// konverzija  EUR -> Kn
		function konverzija(num) {
			var m = Number((Math.abs(num) * 100).toPrecision(15)) * 7.53450;
			return ((Math.round(m) / 100) * Math.sign(num));
		}

    // format online edukacije objects
    const formatedukacije = sveedukacije.map((item) => {

        return {
					id: item.id,
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
					autori: item.autoriIPredavaci,
					title: item.naziv,
					titleslug: item.slug,
					photo: item.fotografija.handle,
					excerpt: item.sazetak,
					curriculum: item.curriculum.html,
					category: item.kategorija.naziv,
					categoryslug: item.kategorija.slug,
					categorycode: item.kategorija.kod,
					bodyhtml: item.opisEdukacije.html,
					sifra: item.sifraProizvoda,
					shorthand: item.shorthand,
					vrsta: item.vrstaEdukacije,
					trajanje: item.trajanje,
					popularan: item.popularan,
					promoVideo: item.promoVideo,
					outroVideo: item.outroVideo,
					updated: item.updatedAt,
					preview: item.preview,
					printanje: item.daLiNudimoPrintanje,
					prioritet: item.prioritetKodIzlistavanja
        };
    }).filter(Boolean);

    if (formatedukacije === undefined || formatedukacije.length == 0) {
        formatedukacije.push("prazno");
    }
    // return formatted blogposts
    return formatedukacije.sort((a, b) => (a.prioritet - b.prioritet || a.titleslug.localeCompare(b.titleslug)  ))
}

// export for 11ty
module.exports = getOnDemand;