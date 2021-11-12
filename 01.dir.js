const fs = require('fs-extra');
const path = require('path');
const files = fs.readdirSync(path.join(__dirname, './storages/211109'));
console.log(files);
