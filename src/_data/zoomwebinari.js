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
                    onLineEdukacije(where: {vrstaEdukacije: Zoom_meeting}, stage: PUBLISHED, orderBy: zoomDatumIVrijemePocetka_ASC) {
                        naziv
                        kategorija {
                            id
                            kod
                            naziv
                        }
                        trajanje
                        zoomDatumIVrijemePocetka
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

        const now = Date.now();
        const futureDates = item.zoomDatumIVrijemePocetka.filter(date => {
            // Filter out dates in the past or falsey values
            return date && (new Date(date)).getTime() > now;
        });

        return {
            title: item.naziv,
            titleslug: slugify(item.naziv, { lower: true, strict: true }),
            category: item.kategorija.naziv,
            categoryslug: slugify(item.kategorija.naziv, { lower: true, strict: true }),
            trajanje: item.trajanje,
            zoomDatumIVrijemePocetka: futureDates,
        };
    }).filter(Boolean);
    
    var sortzoommeetings = [];
    
    if (formatedukacije === undefined || formatedukacije.length == 0) {
        formatedukacije.push("prazno");
    }
    else {
        var zoomlist = {};
        var zoomitems = [];
        zoomlist.zoomitems = zoomitems;
        formatedukacije.forEach(zoom => {
            var zoomdates = zoom.zoomDatumIVrijemePocetka;
            if (zoomdates.length) {
                zoomdates.forEach(zoomdate => {
                    var zoomitem = {
                        "title": zoom.title,
                        "titleslug": zoom.titleslug,
                        "category": zoom.category,
                        "categoryslug": zoom.categoryslug,
                        "zoomDatumIVrijemePocetka": zoomdate,
                        "trajanje": zoom.trajanje
                    }
                    zoomlist.zoomitems.push(zoomitem);
                }
                )
            }
        });
    
        const zoommeetings = zoomlist.zoomitems;

        const sortzoommeetings = zoommeetings.sort((a, b) => {
            return new Date(a.zoomDatumIVrijemePocetka) - new Date(b.zoomDatumIVrijemePocetka); // descending
        })
    }
    
    // return formatted blogposts
    return sortzoommeetings;
}

// export for 11ty
module.exports = getOnlineEdukacije;
