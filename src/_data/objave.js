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
                    objave {
                        id
                        createdAt
                        naslovObjave
                        autorObjava {
                            imeIPrezime
                        }
                        fotografija {
                            handle
                        }
                        sazetakObjave
                        kategorija {
                            naziv
                        }
                        objava {
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
        sveobjave = sveobjave.concat(response.data.objave);

    } catch (error) {
        throw new Error(error);
    }

    // format blogposts objects
    const objaveFormatted = sveobjave.map((item) => {
        return {
            id: item.id,
            date: item.createdAt,
            author: item.autorObjava.imeIPrezime,
            title: item.naslovObjave,
            titleslug: slugify(item.naslovObjave, { lower: true}),
            photo: item.fotografija.handle,
            excerpt: item.sazetakObjave,
            category: item.kategorija.naziv,
            categoryslug: slugify(item.kategorija.naziv, { lower: true }),
            body: item.objava.html
        };
    });

    console.log(objaveFormatted);

    // return formatted blogposts
    return objaveFormatted;
}

// export for 11ty
module.exports = getObjave;