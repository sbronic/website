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
                        sifraProizvoda
                        nazivSeminara
                        cijena
                        promoVideo
                        sazetakSeminara
                        trajanjeDana
                        predavaci {
                            imeIPrezime
                        }
                        curriculum {
                            html
                        }
                        fotografija {
                            handle
                        }
                        kategorija {
                            kod
                            naziv
                        }
                        opis {
                            html
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
            sifra: item.sifraProizvoda,
            title: item.nazivSeminara,
            titleslug: slugify(item.nazivSeminara, { lower: true, strict: true }),
            cijena: item.cijena,
            promovideo: item.promoVideo,
            excerpt: item.sazetakSeminara,
            trajanje: item.trajanjeDana,
            predavaci: item.predavaci,
            curriculum: item.curriculum.html,
            fotografija: item.fotografija.handle,
            kategorija: item.kategorija.naziv,
            kategorijaslug: slugify(item.kategorija.naziv, { lower: true, strict: true }),
            kategorijakod: item.kategorija.kod,
            opis: item.opis.html
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