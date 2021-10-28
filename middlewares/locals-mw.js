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
local-mw file은 ejs에 보낼 내용을 연산해서 보내는역할의 middleware
  * res.locals.links = linkInit.admin...
    를 통해 link-init에 admin에 있던 네비 관련 내용을 전송
  * req.path
    -> 현재 나의 위치.
  *req.originalUrl
    -> (공백)/admin/board/init 출력

currentPath = 현재경로 originalUrl
currentPaths = 현재경로 배열
secondPath = /admin/board


/admin/user/init

['','admin','user','init']
*/
