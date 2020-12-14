// required packages
const fetch = require("node-fetch");
const slugify = require('slugify');

// get Objave
async function getObjave() {
    
    // Objave array
    let sveobjave = [];

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
                    objave (orderBy: datumObjave_DESC, stage: PUBLISHED) {
                        id
                        datumObjave
                        naslovObjave
                        autorIPredavac {
                            imeIPrezime
                        }
                        fotografija {
                            handle
                            url
                        }
                        sazetakObjave
                        kategorija {
                            naziv
                        }
                        objava {
                            html
                            text
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
        sveobjave = sveobjave.concat(response.data.objave);

    } catch (error) {
        throw new Error(error);
    }

    // format blogposts objects
    const formatobjave = sveobjave.map((item) => {
        return {
            id: item.id,
            date: item.datumObjave,
            author: item.autorIPredavac.imeIPrezime,
            title: item.naslovObjave,
            titleslug: slugify(item.naslovObjave, { lower: true, strict: true }),
            photo: item.fotografija.handle,
            photourl: item.fotografija.url,
            excerpt: item.sazetakObjave,
            category: item.kategorija.naziv,
            categoryslug: slugify(item.kategorija.naziv, { lower: true, strict: true }),
            bodyhtml: item.objava.html,
            bodytext: item.objava.text.replace(/\n /, "\n")
        };
    }).filter(Boolean);

    if (formatobjave === undefined || formatobjave.length == 0) {
        formatobjave.push("prazno");
    }

    // return formatted blogposts
    return formatobjave;
}

// export for 11ty
module.exports = getObjave;