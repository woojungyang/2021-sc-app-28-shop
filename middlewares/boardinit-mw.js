const _ = require('lodash');
const { BoardInit } = require('../models');

module.exports = (field) => {
  return async (req, res, next) => {
    let { boardId } = req[field];
    const boardLists = await BoardInit.findAll({
      // 전체 게시물을 정보를 가져오기
      order: [['id', 'asc']],
    });
    const [myBoard] = boardLists.filter((v, i) => {
      if (i === 0 && !boardId) boardId = v.id; // 내용이 없어도 처음입력한 게시판 게시글이 보이도록
      return v.id == boardId;
    });

    res.locals.boardLists = _.sortBy(boardLists, 'title'); //내가 만든 게시판명 이름을 기준으로 정렬
    res.locals.boardId = boardId;
    res.locals.boardType = myBoard.boardType;
    res.locals.boardTitle = myBoard.title;
    res.locals.useImg = myBoard.useImg;
    res.locals.useFile = myBoard.useFile;
    res.locals.useComment = myBoard.useComment;
    next();
  };
};

/* 

  < <전체적인 흐름 >>
    BoardInit.findAll을 통해서 게시판관리>게시판관리>를 통해 생성된 게시판 정보를 모두 불러옴 (id로 정렬하고 오름차순으로)
    위에 불러온 게시판정보를 boardList에저장
    myBoard라는 이름구조분해할당으로 현재 내가 사용하고 있는 id랑 일치하는 게시판을 필터링해서 저장

  res.locals.boardId = 현재 게시판 정보, 전체 제시판 정보
  res.locals.boardType = default인가 gallery인가
  res.locals.boardTitle = 생성된 게시판 제목(공지사항,사용후기...)
  res.locals.useImg = 게시판 이미지사용여부
  res.locals.useFile = 게시판 파일사용여부
  res.locals.useComment = 게사판 댓글사용여부

  변수가 많으니 딱 키가 되는 값을 알고있어야함.
  현재 이 게시판에서는 3개의 키값을 명시하고있을것.
  (boardid,type,게시물의id)
  * if (i === 0 && !boardId) boardId = v.id; //게시판 전체를 가져와서, 게시글이 없다면 최근 게시글을 넣어줌
  * return v.id == boardId; //queryString이 들어오기때문에 문자열과 숫자를 비교해야되기 때문에 '=='사용
  *  _.sortBy(boardLists, 'title'); ->return 정렬된 새로운 배열값이 들어있음

*/
