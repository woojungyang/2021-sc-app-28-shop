const path = require('path');
const express = require('express');
const createError = require('http-errors');
const router = express.Router();
const queries = require('../../middlewares/query-mw');
const { error, absPath } = require('../../modules/util');
const { BoardComment } = require('../../models');

router.post('/', queries('body'), async (req, res, next) => {
  try {
    await BoardComment.create({ ...req.body });
    res.redirect('/admin/board/' + req.body.board_id + '?' + res.locals.goQuery);
  } catch (err) {
    next(createError(err));
  }
});

router.delete('/', queries('body'), async (req, res, next) => {
  try {
    await BoardComment.destroy({ where: { id: req.body.id } });
    res.redirect('/admin/board/' + req.body.board_id + '?' + res.locals.goQuery);
  } catch (err) {
    next(createError(err));
  }
});

module.exports = { router, name: '/comment' };
