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
                    onLineEdukacije(orderBy: naziv_ASC, stage: PUBLISHED, where: {kategorija: {kod: "znr"}}) {
                        naziv
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
                        fotografija {
                            handle
                            }
                        id
                        kategorija {
                            id
                            kod
                            naziv
                        }
                        opisEdukacije {
                            html
                        }
                        sazetak
                        curriculum {
                            html
                        }
                        sifraProizvoda
                        vrstaEdukacije
                        trajanje
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

    // format blogposts objects
    const formatedukacije = sveedukacije.map((item) => {
        return {
            id: item.id,
            cijena: item.cijena.toLocaleString() + ' Kn + PDV',
            autori: item.autoriIPredavaci,
            title: item.naziv,
            titleslug: slugify(item.naziv, { lower: true, strict: true }),
            photo: item.fotografija.handle,
            excerpt: item.sazetak,
            curriculum: item.curriculum.html,
            category: item.kategorija.naziv,
            categoryslug: slugify(item.kategorija.naziv, { lower: true, strict: true }),
            categorycode: item.kategorija.kod,
            bodyhtml: item.opisEdukacije.html,
            sifra: item.sifraProizvoda,
            vrsta: item.vrstaEdukacije,
            trajanje: item.trajanje,
            printanje: item.daLiNudimoPrintanje
        };
    }).filter(Boolean);

    if (formatedukacije === undefined || formatedukacije.length == 0) {
        formatedukacije.push("prazno");
    }

    // return formatted blogposts
    return formatedukacije;
}

// export for 11ty
module.exports = getOnlineEdukacije;