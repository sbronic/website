// required packages
const fetch = require("node-fetch");
const slugify = require('slugify');

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
                    onLineEdukacije(stage: PUBLISHED, where: {vrstaEdukacije: e_Zbirke}) {
                        naziv
                        cijena
												cijenaEUR
                        autoriIPredavaci {
                            imeIPrezime
                            fotografija {
                                handle
                            }
                            oAutoruPredavacu {
                                html
                            }
                        }
                        fotografija {
                            handle
                            }
                        id
                        kategorija {
                            id
                            kod
                            naziv
                        }
												prioritetKodIzlistavanja
                        opisEdukacije {
                            html
                        }
                        sazetak
                        curriculum {
                            html
                        }
                        sifraProizvoda
												shorthand
                        vrstaEdukacije
                        trajanje
                        popularan
                        promoVideo
                        outroVideo
                        zoomDatumIVrijemePocetka
                        updatedAt
                        preview
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
        sveedukacije = sveedukacije.concat(response.data.onLineEdukacije);

    } catch (error) {
        throw new Error(error);
    }

		// konverzija u EUR
		function konverzija(num) {
			var m = Number((Math.abs(num) * 100).toPrecision(15)) * 7.53450;
			return ((Math.round(m) / 100) * Math.sign(num));
		}
	
    // format zbirke objects
    const formatedukacije = sveedukacije.map((item) => {

        const now = Date.now();
        const futureDates = item.zoomDatumIVrijemePocetka.filter(date => {
            // Filter out dates in the past or falsey values
            return date && (new Date(date)).getTime() > now;
        });

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
        	titleslug: slugify(item.naziv, {
        		lower: true,
        		strict: true
        	}),
        	photo: item.fotografija.handle,
        	excerpt: item.sazetak,
        	curriculum: item.curriculum.html,
        	category: item.kategorija.naziv,
        	categoryslug: slugify(item.kategorija.naziv, {
        		lower: true,
        		strict: true
        	}),
        	categorycode: item.kategorija.kod,
        	bodyhtml: item.opisEdukacije.html,
        	sifra: item.sifraProizvoda,
        	shorthand: item.shorthand,
        	vrsta: item.vrstaEdukacije,
        	trajanje: item.trajanje,
        	popularan: item.popularan,
        	promoVideo: item.promoVideo,
        	outroVideo: item.outroVideo,
        	zoomDatumIVrijemePocetka: futureDates,
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