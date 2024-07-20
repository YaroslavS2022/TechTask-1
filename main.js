const prompt = require('prompt-sync')();

const { adjustColors } = require('./utils/beautifier');
const { verifyImage } = require('./utils/validator');
const { convertToAvatar } = require('./utils/avatar_generator');
const { convertImage } = require('./utils/converter');

// Main function to handle the process
async function main() {
    const fileName = prompt('Enter the name of the file with the photo: ');
    console.log('Input file:', fileName);
    try {
        await verifyImage(fileName);
        await adjustColors(fileName, './adjusted.png');
        await convertToAvatar('./adjusted.png', './badge.png');
        return true;
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
}

async function conversionExample() {
    const inputImage = prompt('Enter the input file name: ');
    const outputImage = prompt('Enter the output file name: ');
    const desiredFormat = prompt('Enter the desired format of the file: ');
    try {
        await convertImage(inputImage, outputImage, desiredFormat);
        return true;
    } catch (error) {
        console.error('Error:', error);
        return false;
    }
}

// IIFE handling async/await (ensures exits on error)
(async () => {
    try {
        await main();
    } catch (er) {
        console.error(er);
        process.exit(2);
    }

    try {
        await conversionExample();
    } catch (er) {
        console.error(er);
        process.exit(3);
    }
})();

module.exports = { 
    main, 
    conversionExample 
};
