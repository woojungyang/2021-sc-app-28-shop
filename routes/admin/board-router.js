const path = require('path');
const express = require('express');
const router = express.Router();
const { error } = require('../../modules/util');

router.get('/', (req, res, next) => {
  const type = req.query.type
  const boardType = req.query.boardType || 'default'
  if (type === 'create') {
    res.render('admin/board/board-form', { css: 'admin-board', boardType })
  } else {
    res.render('admin/board/board-list', { css: 'admin-board', boardType })
  }
});

router.get('/:id', (req, res, next) => {
  console.log("dup");
  const type = req.query.type;
  const boardType = req.query.boardType || 'default';
  if (type === 'update') {
    res.render('admin/board/board-form', { css: 'admin-board', boardType })
  } else {
    res.render('admin/board/board-view', { css: 'admin-board', boardType });
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
*/
