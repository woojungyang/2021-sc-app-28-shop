const path = require('path');
const express = require('express');
const router = express.Router();
const { error } = require('../../modules/util');
const boardInit = require('../../middlewares/boardinit-mw');
const uploader = require('../../middlewares/multer-mw');
const { Board, BoardFile } = require('../../models');

// 신규글 작성
router.get('/', boardInit, (req, res, next) => {
  console.log(res.locals);
  const { type } = req.query;
  if (type === 'create') {
    res.render('admin/board/board-form', { type, binit: req.binit });
  } else next();
});

// 리스트
router.get('/', boardInit, (req, res, next) => {
  const { type } = req.query;
  res.render('admin/board/board-list', { type });
});

router.get('/:id', (req, res, next) => {
  const type = req.query.type;
  const boardType = req.query.boardType || 'default';
  if (type === 'update') {
    res.render('admin/board/board-form', { css: 'admin-board', boardType });
  } else {
    res.render('admin/board/board-view', { css: 'admin-board', boardType });
  }
});

//게시물 저장
router.post(
  '/',
  boardInit,
  uploader.fields([{ name: 'img' }, { name: 'pds' }]),
  async (req, res, next) => {
    await Board.create(req.body);
    await BoardFile.create(req.body);
    res.json({
      body: req.body,
      file: req.files,
    });
    //res.send('/admin/board:POST');
  }
);

router.put('/', (req, res, next) => {
  res.send('/admin/board:PUT');
});

router.delete('/', (req, res, next) => {
  res.send('/admin/board:DELETE');
});

module.exports = { name: '/board', router };
