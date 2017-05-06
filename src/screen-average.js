var robot = require('robotjs'); // amazing. http://robotjs.io/docs/syntax

/**
 * Static calls for getting a screen's average color
 */
export default {
    /**
     * Get's the screen's average color
     */
    getScreenAverage: function () {
        var img = robot.screen.capture();
        var bitmap = img.image;
        let r = 0, g = 0, b = 0, n = 0;
        var x = img.image.length;
        var i = 0;
        while (i < x) {
            b += bitmap[i] || 0;
            g += bitmap[i + 1] || 0;
            r += bitmap[i + 2] || 0;
            n++;
            i = i + 4;
        }
        n = n == 0 ? 1 : n;
        r /= n;
        g /= n;
        b /= n;
        return {
            R: r,
            G: g,
            B: b
        }
    }
}
