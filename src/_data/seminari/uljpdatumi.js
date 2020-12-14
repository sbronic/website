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
                    datumiSeminara (orderBy: dateAndTime_ASC, stage: PUBLISHED, where: {dateAndTime_gt: "$today", seminar: {kategorija: {kod: "uljp"}}}) {
                        dateAndTime
                        dvorana
                        lokacija {
                            adresa
                            grad
                            nazivLokacije
                        }
                        odDo
                        seminar {
                            nazivSeminara
                            cijena
                            kategorija {
                                kod
                                naziv
                            }
                            fotografija {
                                handle
                            }
                            sazetakSeminara
                            autoriIPredavaci {
                                imeIPrezime
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
            seminarcijena: item.seminar.cijena.toLocaleString() + ',00 Kn + PDV',
            kategorijanaziv: item.seminar.kategorija.naziv,
            kategorijaslug: slugify(item.seminar.kategorija.naziv, { lower: true, strict: true }),
            kategorijakod: item.seminar.kategorija.kod,
            photo: item.seminar.fotografija.handle,
            excerpt: item.seminar.sazetakSeminara,
            predavaci: item.seminar.autoriIPredavaci,
            vrijeme: item.odDo
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