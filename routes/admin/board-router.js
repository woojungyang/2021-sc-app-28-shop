const path = require('path');
const express = require('express');
const createError = require('http-errors');
const router = express.Router();
const boardInit = require('../../middlewares/boardinit-mw');
const uploader = require('../../middlewares/multer-mw');
const afterUploader = require('../../middlewares/after-multer-mw');
const counter = require('../../middlewares/board-counter-mw');
const queries = require('../../middlewares/query-mw');
const { Board, BoardFile, BoardComment } = require('../../models');
const { moveFile } = require('../../modules/util');

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
    const { lists, pager, totalRecord } = await Board.getLists(req.query, BoardFile);
    res.render('admin/board/board-list', { lists, pager, totalRecord });
  } catch (err) {
    next(createError(err));
  }
});

// 상세수정
router.get('/:id', boardInit(), queries(), counter, async (req, res, next) => {
  const { type } = req.query;
  if (type === 'update') {
    const lists = await Board.findAll({
      where: { id: req.params.id },
      include: [{ model: BoardFile }],
    });
    // res.json(Board.getViewData(lists)[0]);
    res.render('admin/board/board-update', { list: Board.getViewData(lists)[0] });
  } else next();
});

// 상세보기
router.get('/:id', boardInit(), queries(), async (req, res, next) => {
  try {
    const { lists, pager } = await Board.getList(
      req.params.id,
      req.query,
      BoardFile,
      BoardComment
    );
    // res.json({ list: Board.getViewData(lists)[0], pager });
    res.render('admin/board/board-view', {
      list: Board.getViewData(lists)[0],
      pager,
    });


// 게시물 저장/수정
router.post(
  '/',
  uploader.fields([{ name: 'img' }, { name: 'pds' }]),
  afterUploader(['img', 'pds']),
  boardInit('body'),
  queries('body'),
  async (req, res, next) => {
    try {
      if (req.body.type === 'update') {
        await Board.update(req.body, { where: { id: req.body.id } });
        req.files.forEach((file) => (file.board_id = req.body.id));
        const files = await BoardFile.bulkCreate(req.files);
        // res.json({ file: req.files, req: req.body, locals: res.locals });
        res.redirect(res.locals.goList);
      } else {
        req.body.user_id = req.user.id;
        req.body.binit_id = res.locals.boardId;
        const board = await Board.create(req.body);
        req.files.forEach((file) => (file.board_id = board.id));
        const files = await BoardFile.bulkCreate(req.files);
        res.redirect('/admin/board?boardId=' + res.locals.boardId);
      }
    } catch (err) {
      next(createError(err));
    }
  }
);

router.delete('/', boardInit(), queries('body'), async (req, res, next) => {
  try {
    await Board.destroy({ where: { id: req.body.id } });
    const files = await BoardFile.findAll({
      attributes: ['saveName'],
      where: { board_id: req.body.id },
    });
    await BoardFile.destroy({ where: { board_id: req.body.id } });
    for (let { saveName } of files) {
      await moveFile(saveName);
    }
    res.redirect(res.locals.goList);
  } catch (err) {
    next(createError(err));
  }
});

module.exports = { name: '/board', router };