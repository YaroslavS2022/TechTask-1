const fs = require('fs');
const sharp = require('sharp');

/**
 * Conversion of an image to an avatar with a circular mask.
 * @param {string} inputPath - Path to the input image file.
 * @param {string} outputPath - Path to save the output image file.
 * @returns {boolean} - Returns true if the conversion is successful.
 * @throws Will throw an error if the file deletion fails.
 */
async function convertToAvatar(inputPath, outputPath) {
    const size = 512;
    const radius = size / 2;

    // Creation of a circular mask  SVG
    const maskSvg = `
        <svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
            <circle cx="${radius}" cy="${radius}" r="${radius}" fill="white" />
        </svg>
    `;

    // Applying  the circular mask
    await sharp(inputPath)
        .resize(size, size)
        .composite([{ input: Buffer.from(maskSvg), blend: 'dest-in' }]) // Apply the mask
        .toFile(outputPath);

    console.log(`Avatar saved to ${outputPath}`);

    fs.unlink('./adjusted.png', (err) => {
        if (err) {
            console.error(`Error deleting file adjusted.png:`, err);
            throw er;
        }
    });
    return true;
}
module.exports = { convertToAvatar };