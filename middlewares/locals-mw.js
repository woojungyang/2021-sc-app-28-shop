const linkInit = require('../modules/link-init');
module.exports = (req, res, next) => {
  res.locals.user = req.user || null;
  res.locals.links = linkInit.admin;
  res.locals.currentPath = req.originalUrl;
  const currentPaths = req.originalUrl.split('/');
  currentPaths.shift();
  res.locals.currentPaths = currentPaths;
  res.locals.secondPath = '/' + currentPaths[0] + (currentPaths[1] ? '/' + currentPaths[1] : '');
  next();
};

/* 
currentPath = 현재경로 originalUrl
currentPaths = 현재경로 배열
secondPath = /admin/board
*/
