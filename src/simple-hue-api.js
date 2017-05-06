import {
    Client
} from 'node-rest-client';
import colorConvert from 'color-convert';
var client = new Client();

export default class {
    constructor(props, callback) {
        this.ip = props.ip || '';
        this.hueConfig = props.hueConfig || {};
        this.state = props.state || {};
        this.getHueIP((ip) => {
            this.ip = ip;
            this.getCurrentState((state) => {
                this.state = state;
                console.log(`current state fetched`);
            });
        });
        callback();
    }

    /**
     * Get's the bridge's ip
     */
    getHueIP(callback) {
        client.get("https://www.meethue.com/api/nupnp", function (data, response) {
            var r = data[0].internalipaddress;
            console.log(`Bridge detected at ${r}`);
            callback(r);
        });
    }

    /**
     * Changes the color of the hue light
     * @param {string} ip - Bridge IP 
     * @param {object} hueConfig - the hue configuration 
     * @param {object} color - the RGB color to change the hue to
     * @param {object} fullStateObj - when provided, the hue will change to this instead of color 
     */
    changeColor(color, fullStateObj, callback) {
        var data = {};
        data.on = true;
        if (color) {
            var xyz = colorConvert.rgb.xyz(color.R, color.G, color.B);
            data.xy = additionalHueXYZConversion(xyz[0], xyz[1], xyz[2]);
        }
        var transitionTime = this.hueConfig.transitiontime;
        data.transitiontime = transitionTime / 100;
        client.put("http://${ip}/api/${username}/lights/${lightId}/state", {
            path: {
                "ip": this.ip,
                "username": this.hueConfig.username,
                "lightId": this.hueConfig.lightId
            },
            "data": typeof (fullStateObj) === "undefined" ? data : fullStateObj,
            headers: {
                "Content-Type": "application/json"
            }
        }, function (data, response) {
            if (callback) {
                callback(data);
            }
        });
    }

    /**
     * Get's the current state of the hue
     * @param {string} ip - the bridge ip
     * @param {object} hueConfig - the hue configuration
     */
    getCurrentState(callback) {
        var data = {};
        data.on = true;
        client.get("http://${ip}/api/${username}/lights/${lightId}", {
            path: {
                "ip": this.ip,
                "username": this.hueConfig.username,
                "lightId": this.hueConfig.lightId
            },
        }, function (data, response) {
            return callback(data.state);
        });
    }

}

function additionalHueXYZConversion(x, y, z) {
    return [x / (x + y + z), y / (x + y + z)];
}
