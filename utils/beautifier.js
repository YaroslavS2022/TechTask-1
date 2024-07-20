const sharp = require('sharp');
const Vibrant = require('node-vibrant');

/**
 * Enhance the image colors to give a "happy" feeling.
 * @param {string} inputPath - Path to the input image file.
 * @param {string} outputPath - Path to save the adjusted image file.
 * @returns {boolean} - Returns true if the conversion is successful.
 * @throws Will throw an error if the file deletion fails.
*/
async function adjustColors(inputPath, outputPath) {
    // Extract color palette using node-vibrant
    const palette = await Vibrant.from(inputPath).getPalette();

    // Determining average brightness
    let averageBrightness = 0;
    let colorCount = 0;

    for (const swatch in palette) {
        const color = palette[swatch];
        if (color) {
            const { r, g, b } = color.getRgb();
            const brightness = (r * 299 + g * 587 + b * 114) / 1000;
            averageBrightness += brightness;
            colorCount++;
        }
    }

    averageBrightness /= colorCount;
    const isDark = averageBrightness < 128;

    // Adjusting the image based on brightness
    await sharp(inputPath)
        .modulate({
            brightness: isDark ? 1.2 : 0.8, // Adjusting  brightness
            saturation: 1.1 // Slightly increase the saturation
        })
        .toFile(outputPath);

    console.log(`Color-enhanced image saved to ${outputPath}`);
    return true;
}

module.exports = { adjustColors };
