const path = require('path');
const express = require('express');
const createError = require('http-errors');
const numeral = require('numeral');
const router = express.Router();
const { relPath, dateFormat } = require('../../modules/util');
const boardInit = require('../../middlewares/boardinit-mw');
const uploader = require('../../middlewares/multer-mw');
const afterUploader = require('../../middlewares/after-multer-mw');
const pager = require('../../middlewares/pager-mw');
const { Board, BoardFile } = require('../../models');

// 신규글 작성
router.get('/', boardInit('query'), (req, res, next) => {
  const { type } = req.query;
  if (type === 'create') {
    res.render('admin/board/board-form', { type, binit: req.binit });
  } else next();
});

// 리스트
router.get('/', boardInit('query'), pager(Board), async (req, res, next) => {
  try {
    const { type, field = 'id', search = '', sort = 'desc' } = req.query;
    req.query.field = field;
    req.query.search = search;
    req.query.search = search;
    req.query.boardId = 1;
    console.log(req.query);
    const lists = await Board.searchList(req.query, req.pager, BoardFile);
    res.render('admin/board/board-list', {
      type,
      lists,
      numeral,
      pager: req.pager,
      field,
      sort,
      search,
    });
  } catch (err) {
    next(createError(err));
  }
});

// 상세보기
router.get('/:id', (req, res, next) => {
  const type = req.query.type;
  const boardType = req.query.boardType || 'default';
  if (type === 'update') {
    res.render('admin/board/board-form', { css: 'admin-board', boardType });
  } else {
    res.render('admin/board/board-view', { css: 'admin-board', boardType });
  }
});

// 게시물 저장
router.post(
  '/',
  uploader.fields([{ name: 'img' }, { name: 'pds' }]),
  afterUploader(['img', 'pds']),
  boardInit('body'),
  async (req, res, next) => {
    try {
      req.body.user_id = 1; // 회원작업 후 수정 예정
      req.body.binit_id = res.locals.boardId;
      const board = await Board.create(req.body);
      req.files.forEach((file) => (file.board_id = board.id));
      const files = await BoardFile.bulkCreate(req.files);
      res.redirect('/admin/board?boardId=' + res.locals.boardId);
    } catch (err) {
      next(createError(err));
    }
  }
);

router.put('/', (req, res, next) => {
  res.send('/admin/board:PUT');
});

router.delete('/', (req, res, next) => {
  res.send('/admin/board:DELETE');
});

module.exports = { name: '/board', router };
