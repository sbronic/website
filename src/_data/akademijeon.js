// required packages
const fetch = require("node-fetch");
const slugify = require('slugify');

// get Objave
async function getAkademije() {

    // Objave array
    let sveakademije = [];
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
                variables: { today },
                query: `query akademije($today: Date!) {
                    akademije (where: {vrstaAkademije: online}, orderBy: nazivAkademije_ASC) {
                        nazivAkademije
                        cijena
                        autoriIPredavaci {
                            imeIPrezime
                            fotografija {
                                handle
                            }
                            oAutoruPredavacu {
                                html
                            }
                        }
                        curriculum {
                            html
                        }
                        elementi
                        fotografija {
                            handle
                        }
                        opisAkademije {
                            html
                        }
                        outroVideo
                        pdf {
                            url
                        }
                        promoVideo
                        outroVideo
                        sazetak
                        sifraProizvoda
                        trajanjeDana
                        vrstaAkademije
                        datumiAkademijas (where: {date_gt: $today}) {
                            date
                        }
                        updatedAt
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
        sveakademije = sveakademije.concat(response.data.akademije);

    } catch (error) {
        throw new Error(error);
    }

    // format blogposts objects
    const formatakademije = sveakademije.map((item) => {
        return {
            naziv: item.nazivAkademije,
            slug: slugify(item.nazivAkademije, { lower: true, strict: true }),
            autori: item.autoriIPredavaci,
            cijena: item.cijena.toLocaleString('hr-HR') + ' Kn + PDV',
            cijenaCart: item.cijena,
            cijenaPDV: (item.cijena * 1.25).toFixed(2),
            popustCartOsoba: (item.cijena * 0.25).toFixed(2),
            popustCartNgo: (item.cijena * 0.50).toFixed(2),
            curriculum: item.curriculum.html,
            elementi: item.elementi,
            fotografija: item.fotografija.handle,
            opis: item.opisAkademije.html,
            pdf: item.pdf.url,
            promoVideo: item.promoVideo,
            outroVideo: item.outroVideo,
            sazetak: item.sazetak,
            sifraProizvoda: item.sifraProizvoda,
            trajanje: item.trajanjeDana,
            vrsta: item.vrstaAkademije,
            datumi: item.datumiAkademijas,
            updated: item.updatedAt
        };
    }).filter(Boolean);

    if (formatakademije === undefined || formatakademije.length == 0) {
        formatakademije.push("prazno");
    }

    // return formatted blogposts
    return formatakademije;
}

// export for 11ty
module.exports = getAkademije;