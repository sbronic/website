// required packages
const fetch = require("node-fetch");

// get Objave
async function getOnlineEdukacije() {
    
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
                    seminariNaZahtjevZbirke(orderBy: naziv_ASC, stage: PUBLISHED) {
												naziv
												sifraProizvoda
												shorthand
												kategorija {
													kod
													naziv
													slug
												}
												autorIPredavac {
													imeIPrezime
													fotografija {
															handle
													}
													oAutoruPredavacu {
															html
													}
												}
												cijenaEUR
												cijena
												fotografija {
													handle
													url
												}
												prioritetKodIzlistavanja
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
												daLiNudimoPrintanje
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
        sveedukacije = sveedukacije.concat(response.data.seminariNaZahtjevZbirke);

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
					cijena: konverzija(item.cijenaEUR).toLocaleString('hr-HR') + ' Kn + PDV', // za prikazivanje cijene
					//cijenaEUR: konverzija(item.cijena).toLocaleString('hr-HR') + ' EUR + PDV', // za prikazivanje cijene
					cijenaEUR: item.cijenaEUR.toLocaleString('hr-HR') + ' EUR + PDV', // za prikazivanje cijene
					//cijenaCart: item.cijena, // za snipcart odn. jotform
					cijenaCart: konverzija(item.cijenaEUR).toFixed(2), // za snipcart odn. jotform
					//cijenaCartEUR: (item.cijena / 7.53450).toFixed(2), // za snipcart odn. jotform
					cijenaCartEUR: item.cijenaEUR, // za snipcart odn. jotform
					//cijenaPDV: (item.cijena * 1.25).toFixed(2), // za meta tagove
					cijenaPDV: (konverzija(item.cijenaEUR) * 1.25).toFixed(2), // za meta tagove
					//cijenaPDVEUR: (item.cijena / 7.53450 * 1.25).toFixed(2), // za meta tagove
					cijenaPDVEUR: (item.cijenaEUR * 1.25).toFixed(2), // za meta tagove	
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
module.exports = getOnlineEdukacije;