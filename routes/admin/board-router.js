const path = require('path');
const express = require('express');
const router = express.Router();
const { error } = require('../../modules/util');

router.get('/', (req, res, next) => {
  const type = req.query.type;
  const boardType = req.query.boardType || 'default';
  if (type === 'create') {
    res.render('admin/board/board-form', { boardType });
  } else {
    res.render('admin/board/board-list', { boardType });
  }
});

router.get('/:id', (req, res, next) => {
  console.log('dup');
  const type = req.query.type;
  const boardType = req.query.boardType || 'default';
  if (type === 'update') {
    res.render('admin/board/board-form', { boardType });
  } else {
    res.render('admin/board/board-view', { boardType });
  }
});

router.post('/', (req, res, next) => {
  res.send('/admin/board:POST');
});

router.put('/', (req, res, next) => {
  res.send('/admin/board:PUT');
});

router.delete('/', (req, res, next) => {
  res.send('/admin/board:DELETE');
});

module.exports = { name: '/board', router };

/* 
  router는 맨 위부터 순차적으로 '/'로 들어와서, 그 뒤에 추가적인 라우터주소가있다면 넘어가는 방식

  req.query.type = ?뒤에오는 타입,
  const boardType = req.boardType->gallery. default여부 없다면 default값 함께 전송
*/
