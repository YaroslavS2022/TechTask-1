const fs = require('fs');
const path = require('path');
const tmp = require('tmp');
const fixturesDir = path.join(__dirname, '../');

const { verifyImage } = require('../utils/validator');
const { adjustColors } = require('../utils/beautifier');
const { convertToAvatar } = require('../utils/avatar_generator');

jest.mock('../utils/validator', () => {
  return {
    verifyImage: jest.fn(),
  };
});

jest.mock('../utils/beautifier', () => {
  return {
    adjustColors: jest.fn(),
  };
});

jest.mock('../utils/avatar_generator', () => {
  return {
    convertToAvatar: jest.fn(),
  };
});

// Mock of the converter utility function, incl a mock implementation of the conversion process (sharp module)
jest.mock('../utils/converter', () => {
  const sharp = require('sharp'); // Import sharp module
  return {
    convertImage: jest.fn(async (inputPath, outputPath, format) => {
      // Mock of the conversion process
      await sharp(inputPath)
        .toFormat(format)
        .toFile(outputPath);
      return true;
    }),
  };
});

// Mock implementation of the prompt function
const createPromptImplementation = () => {
  const promptImplementation = jest.fn();
  return promptImplementation;
};

// Mock of the prompt-sync module
jest.mock('prompt-sync', () => {
  return jest.fn(() => {
    return createPromptImplementation();
  });
});

let tmpDir; // Variable to store the temporary directory
let prompt; // Variable to store the prompt implementation

// Setup before each test
beforeEach(() => {
  tmpDir = tmp.dirSync();
  prompt = createPromptImplementation();
  prompt.mockClear();
  jest.resetAllMocks();
});

afterEach(() => {
  tmpDir.removeCallback();
});

// Main function to handle the image processing
const main = async () => {
  try {
    const fileName = await prompt('Enter the name of the file with the photo: ');
    if (!fs.existsSync(fileName)) {
      throw new Error('File not found');
    }
    await verifyImage(fileName);
    await adjustColors(fileName, './adjusted.png');
    await convertToAvatar('./adjusted.png', './badge.png');
    return true;
  } catch (er) {
    console.log(er);
    throw er;
  }
};

// Test suite for the main process
describe('Main Process', () => {
  it('should handle a valid PNG file', async () => {
    const inputFile = path.join(fixturesDir, 'image.png'); // Defining the input file path
    // Mock of the prompt to return the input file path
    prompt.mockImplementation((question) => {
      if (question === 'Enter the name of the file with the photo: ') {
        return inputFile;
      }
    });

    await main();

    // Asserting the utility functions
    expect(verifyImage).toHaveBeenCalledWith(inputFile);
    expect(adjustColors).toHaveBeenCalledWith(inputFile, './adjusted.png');
    expect(convertToAvatar).toHaveBeenCalledWith('./adjusted.png', './badge.png');
  });
  
  // Test case for handling a non-existent file
  it('should throw an error for a non-existent file', async () => {
    const nonExistentFile = 'nonexistentfile.png';
    prompt.mockImplementation((question) => {
      if (question === 'Enter the name of the file with the photo: ') {
        return nonExistentFile;
      }
    });
    await expect(main()).rejects.toThrowError('File not found');
  });
});

