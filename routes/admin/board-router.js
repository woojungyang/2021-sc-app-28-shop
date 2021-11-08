const path = require('path');
const express = require('express');
const createError = require('http-errors');
const router = express.Router();
const boardInit = require('../../middlewares/boardinit-mw');
const uploader = require('../../middlewares/multer-mw');
const afterUploader = require('../../middlewares/after-multer-mw');
const queries = require('../../middlewares/query-mw');
const { Board, BoardFile, BoardInit } = require('../../models');

// 신규글 작성
router.get('/', boardInit(), queries(), (req, res, next) => {
  const { type } = req.query;
  if (type === 'create') {
    res.render('admin/board/board-form', { type, binit: req.binit });
  } else next();
});

// 리스트
router.get('/', boardInit(), queries(), async (req, res, next) => {
  try {
    const { lists, pager, totalRecord } = await Board.getLists(req.query, BoardFile, BoardInit);
    res.render('admin/board/board-list', { lists, pager, totalRecord });
  } catch (err) {
    next(createError(err));
  }
});

// 상세수정
router.get('/:id', boardInit(), queries(), (req, res, next) => {
  const { type } = req.query;
  if (type === 'update') {
  } else next();
});

// 상세보기
router.get('/:id', boardInit(), queries(), async (req, res, next) => {
  try {
    const { type, boardType } = req.query;
    const id = req.params.id;
    const lists = await Board.findAll({
      where: { id },
      include: [{ model: BoardFile }],
    });
    // res.json(Board.getViewData(lists));
    res.render('admin/board/board-view', { list: Board.getViewData(lists)[0] });
  } catch (err) {
    next(createError(err));
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
