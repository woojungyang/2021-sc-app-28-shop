const path = require('path');
const sharp = require('sharp');
const { absPath } = require('./modules/util');

const files = [
  '211109_0b9887d3-7090-4040-ac4c-7e0dbe841bfe.jpg',
  '211109_0f16252a-bf5b-4842-aaf5-667d6ea41b49.jpg',
  '211109_13975c95-c24d-445b-a915-e1300fbc149e.jpg',
  '211109_5f36d8f6-0c5d-4e1f-aab8-aef543446ebb.jpg',
  '211109_8773a1a0-0322-4d8b-8c28-9fc42620db52.jpg',
  '211109_f76c12d1-705a-4716-b855-256fa6fdb37e.jpg',
  '211110_0b9887d3-7090-4040-ac4c-7e0dbe841bfe.jpg',
  '211110_0f16252a-bf5b-4842-aaf5-667d6ea41b49.jpg',
  '211110_13975c95-c24d-445b-a915-e1300fbc149e.jpg',
  '211110_5f36d8f6-0c5d-4e1f-aab8-aef543446ebb.jpg',
  '211110_8773a1a0-0322-4d8b-8c28-9fc42620db52.jpg',
  '211110_9476076a-d142-42c8-a1a9-1811024a8044.jpg',
  '211110_f76c12d1-705a-4716-b855-256fa6fdb37e.jpg',
];
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
