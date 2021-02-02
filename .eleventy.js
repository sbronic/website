// Switch localhost/TalentLMS u activecourses.js i config.yml

const util = require('util'); // dump filter
const del = require('del');
const got = require("got");
const pluginRSS = require("@11ty/eleventy-plugin-rss");
const { wordCount } = require("eleventy-plugin-wordcount");

module.exports = function (config) {
    const dirToClean = '_site/*';
    del(dirToClean);

    /* Passthrough Copy */
    config.addPassthroughCopy("src/css");
    config.addPassthroughCopy("src/fonts");
    config.addPassthroughCopy("src/images");
    config.addPassthroughCopy("src/js");
    config.addPassthroughCopy("src/netlify.toml");
    config.addPassthroughCopy("src/_redirects");

    /* RSS */
    config.addPlugin(pluginRSS);
    // RSS file size filter
    config.addNunjucksAsyncFilter("size", async (url, callback) => {
        try {
            const { headers } = await got.head(url);
            const clength = headers.hasOwnProperty("content-length")
                ? headers["content-length"]
                : "Unknown";
            callback(null, clength);
        } catch (err) {
            console.error(err);
            callback(err);
        }
    });
    // RSS file MIME type
    config.addNunjucksAsyncFilter("type", async (url, callback) => {
        try {
            const { headers } = await got.head(url);
            const clength = headers.hasOwnProperty("content-type")
                ? headers["content-type"]
                : "Unknown";
            callback(null, clength);
        } catch (err) {
            console.error(err);
            callback(err);
        }
    });
    // RSS RFC822 time
    config.addFilter("rfc822", dateObj => {
        return new Date(dateObj).toUTCString();
    });

    /* Filters */
    config.addFilter('dump', obj => {
        return util.inspect(obj);
    });
    config.addFilter('debugger', (...args) => {
        console.log(...args)
        debugger;
    });
    // Datum objave
    config.addFilter("datumObjave", dateObj => {
        var dobj = new Date(dateObj);
        var day = dobj.getDate();
        var year = dobj.getFullYear();
        var month = dobj.toLocaleString('hr-HR', { month: 'long' });
        //var month = dobj.getMonth()+1;
        return day + ". " + month + " " + year + ".";
    });
    // Datum seminara
    config.addFilter("datumSeminara", dateObj => {
        var dobj = new Date(dateObj);
        var day = dobj.getDate();
        var year = dobj.getFullYear();
        var month = dobj.toLocaleString('hr-HR', { month: 'short' });
        //var month = dobj.getMonth()+1;
        return day + ". " + month + " " + year + ".";
    });
    // Dan
    config.addFilter("datumDan", dateObj => {
        var dobj = new Date(dateObj);
        var day = dobj.getDate();
        return day;
    });
    // Mjesec
    config.addFilter("datumMjesec", dateObj => {
        var dobj = new Date(dateObj);
        var month = dobj.toLocaleString('hr-HR', { month: 'short' });
        return month;
    });
    // Mjesec dugi oblik
    config.addFilter("datumMjesecDugi", dateObj => {
        var dobj = new Date(dateObj);
        var month = dobj.toLocaleString('hr-HR', { month: 'long' });
        return month;
    });
    // Godina
    config.addFilter("datumGodina", dateObj => {
        var dobj = new Date(dateObj);
        var year = dobj.getFullYear();
        return year;
    });
    config.addFilter("datumSat", dateObj => {
        var dobj = new Date(dateObj);
        dobj.setTime(dobj.getTime() - new Date().getTimezoneOffset() * 60 * 1000);
        var sat = dobj.getHours();
        var minutes = (dobj.getMinutes() < 10 ? '0' : '') + dobj.getMinutes();
        var satiminute = sat + ':' + minutes;
        return satiminute;
    });
    // Datum u budućnosti
    config.addFilter("inFuture", function (dates) {
        const now = Date.now();
        const futureDates = dates.filter(date => {
            // Filter out dates in the past or falsey values
            return date && (new Date(date)).getTime() > now;
            return futureDates;
        })
    });
    // JSON-LD escape special characters
    config.addFilter("jsonldesc", obj => {
        const json = JSON.stringify(obj);
        const jsonesc = JSON.stringify(json);
        const escstring = JSON.parse(jsonesc);
        return escstring;
    });
    // Limit umjesto slice
    config.addNunjucksFilter("limit", (arr, limit) => arr.slice(0, limit));

    /* Shortcodes */
    config.addShortcode("og_updated_time", () => new Date()
    );

    /* Plugins */
    config.addPlugin(wordCount);

   return {
        dir: {
            input: "src",
            output: "_site"
        }
    };
};
