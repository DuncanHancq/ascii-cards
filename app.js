'use strict';

//JSON parser library
const fs = require('fs').promises,
    { registerFont, createCanvas } = require("canvas");
const WIDTH = 3000,
    HEIGHT = 3000;

// prototype to convert 1 to 01
Number.prototype.padLeft = function (base, chr) {
    const len = (String(base || 10).length - String(this).length) + 1;
    return len > 0 ? new Array(len).join(chr || '0') + this : this;
}

function currentDate() {
    // Date format MMddyyyyHHmmss
    const date = new Date,
        convertedDate = [
            date.getFullYear(),
            (date.getMonth() + 1).padLeft(),
            date.getDate().padLeft(),
            date.getHours().padLeft(),
            date.getMinutes().padLeft(),
            date.getSeconds().padLeft()
        ].join("")

    return convertedDate;

}

function getData() {
    return fs.readFile("ascii.json", "utf8");
}

function makeDir(path) {
    try {
        fs.mkdir(`output/${path}`, { recursive: true });
    } catch (error) {
        console.error("Error during directory creation :", error);
    }
}

// Load custom font
registerFont('font/Dos/DOSVGA437.ttf', { family: 'Dos' })
registerFont('font/Roboto/Roboto-Medium.ttf', { family: 'RobotoMedium' })
registerFont('font/Roboto/Roboto-Light.ttf', { family: 'RobotoLight' })

function drawImages(ascii, dirPath) {
    console.log("Generate files...")
    for (const i in ascii) {
        let canvas = createCanvas(WIDTH, HEIGHT);
        let ctx = canvas.getContext('2d');

        //Background
        ctx.fillStyle = '#222222';
        ctx.fillRect(0, 0, WIDTH, HEIGHT);

        // Global text style
        ctx.fillStyle = '#F2F2F2';

        // Name of collection
        ctx.font = '136px RobotoMedium';
        ctx.fillText('ASCII Collectible Cards', 98, 192);

        // Name of presented stuff
        ctx.font = '86px RobotoLight';
        ctx.fillText(`${ascii[i].Description}`, 98, 321);

        // Presented thing
        ctx.textAlign = 'center';
        ctx.font = '428px Dos';
        ctx.fillText(`${ascii[i].Character}`, WIDTH / 2, HEIGHT / 2 + 190);

        // Hexadecimal code
        ctx.textAlign = 'left';
        ctx.font = '86px RobotoLight';
        ctx.fillText(`Hexadecimal code: ${ascii[i].Hex}`, 98, HEIGHT - 128);

        // Binary code
        ctx.textAlign = 'right';
        ctx.font = "86px RobotoLight";
        ctx.fillText(`Binary code: ${ascii[i].Binary}`, WIDTH - 98, HEIGHT - 128);

        let buffer = canvas.toBuffer("image/png");
        fs.writeFile(`output/${dirPath}/${i}.png`, buffer);
    }
    console.log("files created :", `./output/${dirPath}/`)
}


getData()
    .then(data => {
        return JSON.parse(data);
    })
    .then(data => {
        const date = currentDate();
        makeDir(date);
        drawImages(data.ascii, date);
    })
