// Switch localhost/TalentLMS u activecourses.js i config.yml

const util = require('util'); // dump filter
const del = require('del');

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

   return {
        dir: {
            input: "src",
            output: "_site"
        }
    };
};
