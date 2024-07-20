const sharp = require('sharp');

/**
 * Converts the image to the specified format.
 * @param {string} inputPath - Path to the input image file.
 * @param {string} outputPath - Path to save the converted image file.
 * @param {string} format - Desired output image format (e.g., 'png', 'jpeg', 'webp') etc.
 * @returns {boolean} - Returns true if the conversion is successful.
 * @throws Will throw an error if the specified format is unsupported or if the conversion fails.
 */
async function convertImage(inputPath, outputPath, format) {
    try {
        // List of valid image formats for conversions
        const validFormats = ['png', 'jpeg', 'jpg', 'webp', 'tiff'];
        if (!validFormats.includes(format)) {
            throw new Error(`Unsupported format: ${format}. Supported formats: ${validFormats.join(', ')}`);
        }

        // Conversion of the image to the desired format and saving it
        await sharp(inputPath)
            .toFormat(format) // Conversion to the output format
            .toFile(outputPath); // Saving the converted image

            console.log(`Image successfully converted to ${format} and saved to ${outputPath}`);
            return true;
    } catch (err) {
        console.error(`Error converting image: ${err.message}`);
        throw err;
    }
}
module.exports = { convertImage };