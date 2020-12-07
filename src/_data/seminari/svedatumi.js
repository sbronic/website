// required packages
const fetch = require("node-fetch");
const slugify = require('slugify');

// get Objave
async function getDatumi() {
    
    // Objave array
    let svidatumi = [];

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
                    datumiSeminara (where: {dateAndTime_gt: "$today"}) {
                        dateAndTime
                        dvorana
                        lokacija {
                            adresa
                            grad
                            nazivLokacije
                        }
                        seminar {
                            nazivSeminara
                            cijena
                            kategorija {
                                kod
                                naziv
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
        svidatumi = svidatumi.concat(response.data.datumiSeminara);

    } catch (error) {
        throw new Error(error);
    }

    // format blogposts objects
    const formatdatumi = svidatumi.map((item) => {
        return {
            datumseminara: item.dateAndTime,
            lokacijaadresa: item.lokacija.adresa,
            lokacijagrad: item.lokacija.grad,
            lokacijanaziv: item.lokacija.nazivLokacije,
            dvorana: item.dvorana,
            seminarnaziv: item.seminar.nazivSeminara,
            seminarnazivslug: slugify(item.seminar.nazivSeminara, { lower: true, strict: true }),
            seminarcijena: item.seminar.cijena.toLocaleString() + ',00 Kn',
            kategorijanaziv: item.seminar.kategorija.naziv,
            kategorijaslug: slugify(item.seminar.kategorija.naziv, { lower: true, strict: true }),
            kategorijakod: item.seminar.kategorija.kod
        };
    }).filter(Boolean);

    if (formatdatumi === undefined || formatdatumi.length == 0) {
        formatdatumi.push("prazno");
    }

    // return formatted blogposts
    return formatdatumi;
}

// export for 11ty
module.exports = getDatumi;