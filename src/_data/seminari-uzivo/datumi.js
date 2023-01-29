// required packages
const fetch = require("node-fetch");

// get Objave
async function getDatumi() {
    
    // Objave array
    let svidatumi = [];
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
                query: `query DatumiOdrzavanja($today: DateTime!) {
                    datumiOdrzavanja (orderBy: dateAndTime_ASC, stage: PUBLISHED, where: {dateAndTime_gt: $today}) {
											seminarUzivo {
												oblikSeminara
												nazivSeminara
												slug
												kategorija {
													kod
													naziv
													slug
												}
												cijenaUEur
												}
												datum
												dateAndTime
												odDo
												lokacija {
													adresa
													grad
													nazivLokacije
												}
												dvorana
												popunjen
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
        svidatumi = svidatumi.concat(response.data.datumiOdrzavanja);

    } catch (error) {
        throw new Error(error);
    }

		// konverzija  EUR -> Kn
		function konverzija(num) {
			var m = Number((Math.abs(num) * 100).toPrecision(15)) * 7.53450;
			return ((Math.round(m) / 100) * Math.sign(num));
		}
	
    // format blogposts objects
    const formatdatumi = svidatumi.map((item) => {
        return {
            datumseminara: item.dateAndTime,
            popunjen: item.popunjen,
            lokacijaadresa: item.lokacija.adresa,
            lokacijagrad: item.lokacija.grad,
            lokacijanaziv: item.lokacija.nazivLokacije,
            dvorana: item.dvorana,
            seminarnaziv: item.seminarUzivo.nazivSeminara,
            seminarnazivslug: item.seminarUzivo.nazivSeminara.slug,
						seminarcijena: konverzija(item.seminarUzivo.cijenaUEur).toLocaleString('hr-HR') + ' Kn + PDV',
						seminarcijenaEUR: item.seminarUzivo.cijenaUEur.toLocaleString('hr-HR') + ' EUR + PDV', // za prikazivanje cijene
            kategorijanaziv: item.seminarUzivo.kategorija.naziv,
            kategorijaslug: item.seminarUzivo.kategorija.naziv.slug,
            kategorijakod: item.seminarUzivo.kategorija.kod,
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