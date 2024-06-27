const fs = require('fs');
const path = require('path');

// Combine flag JSON files into JavaScript objects
const userFlags = require('../flags/user.json');
const applicationFlags = require('../flags/application.json');

// Read the source JavaScript file
console.log('Reading discord-flags-src.js...');
fs.readFile(path.join(__dirname, 'discord-flags-src.js'), 'utf8', function (err, data) {
    if (err) {
        console.log('An error occurred while reading discord-flags-src.js');
        throw err;
    };

    // Remove single-line comments (// ...)
    let removedComments = data.replace(/\/\/.*$/gm, '').trim();

    // Remove multi-line comments (/* ... */)
    //removedComments = removedComments.replace(/\/\*[\s\S]*?\*\//g, '').trim();

    // Add flag data
    console.log('Adding flag data...');
    let jsCode = removedComments
        .replace('userFlags', `userFlags: ${JSON.stringify(userFlags)}`)
        .replace('applicationFlags', `applicationFlags: ${JSON.stringify(applicationFlags)}`);

    // Write the processed JavaScript code to a new file
    fs.writeFileSync(path.join(__dirname, '..', 'dist', 'discord-flags.js'), jsCode);
    console.log('discord-flags.js has been written.');
});