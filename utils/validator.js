const path = require('path');
const sharp = require('sharp');

/**
 * Verification that the image is of size 512x512.
 * @param {string} imagePath - Path to  file.
 * @returns {boolean} - Returns true if the conversion is successful.
 * @throws Will throw an error if the file deletion fails.
 */
async function verifyImage(imagePath) {
    try {
        const extname = path.extname(imagePath).toLowerCase();
        if (extname !== '.png') {
            throw new Error('File must be a PNG image.');
        }
        
        const { width, height } = await sharp(imagePath).metadata();
        
        if (width !== 512 || height !== 512) {
            throw new Error('Image size must be 512x512.');
        }
        console.log("Image is valid and of size 512x512.");
    } catch (er) {
        console.log("File not found or corrupted. Details below:\n--------------------------------------------------------------------\n");
        throw er;
    }
}
module.exports = { verifyImage };
