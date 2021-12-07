/* const fs = require('fs-extra');
const path = require('path');
const data = fs.readdirSync(path.join(__dirname, './json/color.json'));
console.log(files);
 */
const fs = require('fs-extra');
const path = require('path');
var color = fs.readJsonSync(path.join(__dirname, './json/color.json'));

var code = Object.keys(color);
var name = Object.values(color);

console.log(code);
