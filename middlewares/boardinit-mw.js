const { sortBy } = require('lodash');
const _ = require('lodash');
const { BoardInit } = require('../models');
module.exports = async (req, res, next) => {
  let { boardId } = req.query;
  const boardLists = await BoardInit.findAll({
    order: [['id', 'desc']],
    // where: { id: req.query.boardId || 3 },
  });
  const [myBoard] = boardLists.filter((v, i) => {
    if (i === 0 && !boardId) boardId = v.id;
    return v.id == boardId;
  });

  res.locals.boardLists = _.sortBy(boardLists, 'title');
  res.locals.boardId = boardId;
  res.locals.boardType = myBoard.boardType;
  res.locals.boardTitle = myBoard.title;
  res.locals.useImg = myBoard.useImg;
  res.locals.useFile = myBoard.useFile;
  res.locals.useComment = myBoard.useComment;
  next();
};

/* 
  res.locals.boardId = 현재 게시판 정보, 전체 제시판 정보
  res.locals.boardType = default인가 gallery인가
  res.locals.boardTitle = 생성된 게시판 제목(공지사항,사용후기...)
  res.locals.useImg = 게시판 이미지사용여부
  res.locals.useFile = 게시판 파일사용여부
  res.locals.useComment = 게사판 댓글사용여부

  변수가 많으니 딱 키가 되는 값을 알고있어야함.
  현재 이 게시판에서는 3개의 키값을 명시하고있을것.
  (boardid,type,게시물의id)
  * if (i === 0 && !boardId) boardId = v.id; //게시판 전체를 가져와서, 그중에 내용이 없다면 최근 게시글을 넣어줌
  * return v.id == boardId; //queryString이 들어오기때문에 문자열과 숫자를 비교해야되기 때문에 '=='사용
  *  _.sortBy(boardLists, 'title'); ->return 정렬된 새로운 배열값이 들어있음

*/
