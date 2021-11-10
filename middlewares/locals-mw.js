const linkInit = require('../modules/link-init');

module.exports = (req, res, next) => {
  if (req.user) {
    res.locals.user = {
      id: req.user.id,
      userid: req.user.userid,
      username: req.user.username,
      email: req.user.email,
      status: req.user.status,
    };
  } else res.locals.user = null;
  res.locals.init = linkInit.admin;
  res.locals.current = req.path;
  res.locals.currents = req.path.split('/');
  res.locals.currents.shift();
  res.locals.second = '/' + res.locals.currents[0];
  res.locals.second += res.locals.currents[1] ? '/' + res.locals.currents[1] : '';
  next();
};

/* 
path:{
  current:현재경로
  currents:경로 배열
  second:2Depth 경로 
}
local-mw file은 ejs에 보낼 내용을 연산해서 보내는역할의 middleware
* res.locals.links = linkInit.admin...
를 통해 link-init에 admin에 있던 네비 관련 내용을 전송
* req.path
-> 현재 나의 위치.
*req.originalUrl
-> (공백)/admin/board/init 출력
->/admin/board?type=default 까지 출력 (board-router에서 boardType값까지 넘어갔을때)
  우리가 필요한 값은 /admin/board 따로 ?type=default 따로 가져와야함.

currentPath = 현재경로 originalUrl
currentPaths = 현재경로 배열
secondPath = /admin/board


/admin/user/init

['','admin','user','init']

    2021-10-27 수정소스
    * res.locals.user = req.user || null;
    * res.locals.links = linkInit.admin;
    * res.locals.currentPath = req.originalUrl;
    * const currentPaths = req.originalUrl.split('/');
    * currentPaths.shift();
    * res.locals.currentPaths = currentPaths;
    * res.locals.secondPath = '/' + currentPaths[0] + (currentPaths[1] ? '/' + currentPaths[1] : '');

  
  *.res.locals.path = {}; 
  다양한 경로를 받기 위해 path라는 객체 선언
  lint 은 linkInit안에 있는 변수를 받아옴
  current= req.path query,params를 제외한 나머지를 가져옴,
  currents = current에서 가져온 경로를 /기준으로 잘라서 배열에 집어넣음.

  * res.locals.path.currents = req.path.split('/');
  *.res.locals.path.currents.shift();
  ->맨 첫번째 있는 공백이 들어있는 배열을 제거.
  shift()대신에 split(path.sep)를 사용하면 공백이 없는 배열을 만들어냄.




*/
