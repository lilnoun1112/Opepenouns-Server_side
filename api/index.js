//2.0

const express = require('express');
const { google } = require('googleapis');

const app = express();
app.use(express.json());

// Create a Google Sheets client
const auth = new google.auth.GoogleAuth({
  credentials: {
    client_email: process.env.GOOGLE_CLIENT_EMAIL,
    private_key: process.env.GOOGLE_PRIVATE_KEY,
  },
  scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});

const sheets = google.sheets({ version: 'v4', auth });

const recordClick = async (className) => {
  const spreadsheetId = '1WIPztRofZE9THBVuZrqI_dlcHp9yxayByzGBgGm9h6E'; // Replace with your Google Sheets file ID

  try {
    // Find the corresponding cell range for the class name (a1 to a140)
    const classNamesList = [
      'saw', 'chainsaw', 'ape', 'abstract', 'bag', 'bear', 'box', 'calculator', 'calendar', 'camcorder',
      'cannedham', 'chart-bars', 'chocolate', 'console-handheld', 'croc-hat', 'diamond-red', 'diamond-blue',
      'dino', 'fence', 'film-strip', 'film-35mm', 'goldfish', 'chipboard', 'icepop-B', 'mailbox', 'index-card',
      'microwave', 'mirror', 'nigiri', 'otter', 'paintbrush', 'paperclip', 'pill', 'pillow', 'pipe', 'pumpkin',
      'rabbit', 'rainbow', 'road', 'skateboard', 'skilift', 'sponge', 'stapler', 'steak', 'treasurechest', 'turing',
      'void', 'wall', 'wallet', 'wallsafe', 'wine', 'beer', 'bat', 'burger-dollarmenu', 'cake', 'cashregister',
      'cherry', 'chicken', 'crt-bsod', 'chefhat', 'clutch', 'coffeebean', 'cordlessphone', 'dictionary', 'cheese',
      'chips', 'crown', 'duck', 'factory-dark', 'frog', 'orangutan', 'drill', 'gavel', 'garlic', 'gnome', 'grouper',
      'hanger', 'gnars-inlineskate', 'hotdog', 'hardhat', 'kangaroo', 'ketchup', 'lipstick2', 'milk', 'mixer', 'moose',
      'mouse', 'mustard', 'onion', 'orca', 'panda', 'queencrown', 'shark', 'taxi', 'toaster', 'toiletpaper-full',
      'vendingmachine', 'watermelon', 'werewolf', 'whale', 'foodnouns-bread-loaf', 'lostnouns-cinderblock',
      'horse-deepfried', 'lock', 'sailboat', 'spaghetti', 'taco', 'ufo', 'weight', 'zebra', 'nounsbr-cafe',
      'nounsbr-campo-de-futebol', 'nounsbr-coco', 'nounsbr-havaiana', 'nounsbr-surf', 'snowmobile', 'trashcan',
      'sandwich', 'jellyfish', 'rangefinder', 'macaroni', 'pie', 'undead', 'wave', 'igloo', 'helicopter', 'island',
      'bonsai', 'noodles', 'saguaro', 'scorpion', 'shower', 'plane', 'xnouns-crt-bsod', 'edunouns-ruler-blue',
      'capybara', 'toothbrush-fresh', 'dog', 'pop', 'glasses-big'
    ];
    const cellIndex = classNamesList.indexOf(className);
    if (cellIndex === -1) {
      console.error('Invalid element:', className);
      throw new Error('Invalid element');
    }
    const cellRange = `rankings!A${cellIndex + 1}`;

    // Get the existing click count value from the cell
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: spreadsheetId,
      range: cellRange,
    });

    // Parse the existing value as an integer or set it to 0 if it's not present
    const existingCount = response.data.values && response.data.values.length > 0
      ? parseInt(response.data.values[0][0], 10)
      : 0;

    // Calculate the updated click count
    const updatedCount = existingCount + 1;

    // Write the updated click count to the cell
    await sheets.spreadsheets.values.update({
      spreadsheetId: spreadsheetId,
      range: cellRange,
      valueInputOption: 'RAW',
      resource: {
        values: [[updatedCount]],
      },
    });

    console.log('Click recorded successfully');
  } catch (error) {
    console.error('Error updating click count:', error);
    throw error;
  }
};

app.post('/record-click', async (req, res) => {
  const { element } = req.body;

  try {
    await recordClick(element);
    res.status(200).send('Click recorded successfully');
  } catch (error) {
    console.error('Error recording click:', error);
    res.status(500).send('Error recording click');
  }
});

module.exports = app;
