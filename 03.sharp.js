const path = require('path');
const fs = require('fs-extra');
const sharp = require('sharp');
const { absPath } = require('./modules/util');

const files = fs.readdirSync(path.join(__dirname, './storages/211205'));
console.log(files);
async function start() {
  for (let v of files) {
    let loc = path.join(__dirname, 'storages', v.split('_')[0], 'thumb');
    v.thumb = await sharp(absPath(v))
      .resize(200)
      .jpeg({ mozjpeg: true })
      .toFile(path.join(loc, v));
  }
}

start();
