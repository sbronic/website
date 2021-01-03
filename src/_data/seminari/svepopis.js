// required packages
const fetch = require("node-fetch");
const slugify = require('slugify');

// get Objave
async function getSeminari() {
    
    // Objave array
    let sviseminari = [];

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
                        cijena
                        trajanjeDana
                        updatedAt
                        curriculum {
                            html
                        }
                        datumiSeminara (where: {dateAndTime_gt: "$today"}) {
                            dateAndTime
                            odDo
                        }
                        fotografija {
                            handle
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

    // format blogposts objects
    const formatseminari = sviseminari.map((item) => {
        return {
            id: item.id,
            title: item.nazivSeminara,
            titleslug: slugify(item.nazivSeminara, { lower: true, strict: true }),
            kategorija: item.kategorija.naziv,
            kategorijaslug: slugify(item.kategorija.naziv, { lower: true, strict: true }),
            kategorijakod: item.kategorija.kod,
            opishtml: item.opis.html,
            opistext: item.opis.text,
            promoVideo: item.promoVideo,
            outroVideo: item.outroVideo,
            excerpt: item.sazetakSeminara,
            sifra: item.sifraProizvoda,
            cijena: item.cijena.toLocaleString() + ' Kn + PDV',
            cijenaCart: item.cijena,
            cijenaPDV: (item.cijena * 1.25).toFixed(2),
            trajanje: item.trajanjeDana,
            curriculum: item.curriculum.html,
            datumiseminara: item.datumiSeminara,
            fotografija: item.fotografija.handle,            
            predavaci: item.autoriIPredavaci,
            updated: item.updatedAt
            
        };
    }).filter(Boolean);

    if (formatseminari === undefined || formatseminari.length == 0) {
        formatseminari.push("prazno");
    }

    // return formatted blogposts
    return formatseminari;
}

// export for 11ty
module.exports = getSeminari;