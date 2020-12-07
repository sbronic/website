// Switch localhost/TalentLMS u activecourses.js i config.yml

const util = require('util'); // dump filter
const del = require('del');
const { wordCount } = require("eleventy-plugin-wordcount");

module.exports = function (config) {
    const dirToClean = '_site/*';
    del(dirToClean);

    /* Passthrough Copy */
    config.addPassthroughCopy("src/css");
    config.addPassthroughCopy("src/fonts");
    config.addPassthroughCopy("src/images");
    config.addPassthroughCopy("src/js");

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
