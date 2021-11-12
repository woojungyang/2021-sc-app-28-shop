const fs = require('fs-extra');
const path = require('path');

module.exports = (file = '../json/tree.json') => {
  return async (req, res, next) => {
    try {
      const [tree] = await fs.readJson(path.join(__dirname, file));
      req.tree = tree;
      next();
    } catch (err) {
      next(err);
    }
  };
};

/* 
file을 읽어드리기 위해서 fs-extra를 사용할 수밖에 없음

*/
