'use strict';
const vscode = require('vscode');
const fs = require('fs');
const path = require('path');
const { AudioContext } = require('node-web-audio-api');

let audioContext = new AudioContext();          // Keep context active for real-time playback
let isActive = true;


function activate(context) {

    vscode.workspace.onDidChangeTextDocument(event => {
        if (!isActive || event.contentChanges.length === 0) return;
        let keyPressed = event.contentChanges[0].text;
        playSound(getSoundFile(keyPressed));
    });
}

// Get the correct sound file based on key press
function getSoundFile(key) {
    const basePath = path.join(__dirname, 'sounds');

    // Use WAV for fast playback
    // ENTER key produces newline
    if (key === '\n' || key === '\r\n') {
        return path.join(basePath, 'enter1.wav');
    }

    // Default key sound
    return path.join(basePath, 'key.wav');
}

// Play the sound using node-web-audio-api
async function playSound(filePath) {
    try {
        if (!fs.existsSync(filePath)) {
            console.error(`❌ Sound file not found: ${filePath}`);
            return;
        }
        const buffer = fs.readFileSync(filePath);
        const audioBuffer = await audioContext.decodeAudioData(buffer.buffer);
        const source = audioContext.createBufferSource();
        source.buffer = audioBuffer;
        source.connect(audioContext.destination);
        source.start();
    } catch (error) {
        vscode.window.showErrorMessage(`❌ Sound Error: ${error.message}`);
    }
}

module.exports = { activate };