const path = require('path');
const fs = require('fs-extra');
const sharp = require('sharp');
const { absPath } = require('./modules/util');

const files = fs.readdirSync(path.join(__dirname, './storages/211204'));
async function start() {
  for (let v of files) {
    let loc = path.join(__dirname, 'storages', v.split('_')[0], 'thumb');
    v.thumb = await sharp(absPath(v))
      .resize(200)
      .jpeg({ quality: 100 })
      .toFile(path.join(loc, v));
  }
}

start();
