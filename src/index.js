import avg from "./screen-average";
import Hue from "./simple-hue-api";
import fs from "fs";

var config = JSON.parse(fs.readFileSync('config/app.json', 'utf8'));
var hue = new Hue({
    hueConfig: config.hue
}, () => {
    console.log(`constructor complete`);
    var lightId = config.hue.lightId;
    console.log('\x1b[36m%s\x1b[0m', `Changing Light ${lightId} every ${config.hue.transitiontime} ms`);
    console.log('\x1b[34m%s\x1b[0m', "Enjoy 😎");

    function project() {
        var c = avg.getScreenAverage();
        hue.changeColor(c);
    }

    setInterval(project, config.colorAverage.delay);

process.on('SIGINT', () => {
    console.log("\nGoing back to inital state...");
    hue.changeColor(null, hue.state, function (data) {
        process.exit(0);
    }); // will need to handle color too
});    
});

