// required packages
const fetch = require("node-fetch");
const slugify = require('slugify');

// get Objave
async function getFaqs() {

    // Objave array
    let svifaqs = [];

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
                    faqs {
                        vrstaFaq
                        faq {
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
        svifaqs = svifaqs.concat(response.data.faqs);

    } catch (error) {
        throw new Error(error);
    }

    // format blogposts objects
    const formatfaqs = svifaqs.map((item) => {
        return {
            vrsta: item.vrstaFaq,
            html: item.faq.html
        };
    }).filter(Boolean);

    // return formatted blogposts
    return formatfaqs;
}

// export for 11ty
module.exports = getFaqs;