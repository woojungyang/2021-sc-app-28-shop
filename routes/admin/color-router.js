const path = require('path');
const express = require('express');
const router = express.Router();
const createError = require('http-errors');
const { Color } = require('../../models');
const { isAdmin } = require('../../middlewares/auth-mw');

router.get('/', async (req, res, next) => {
  try {
    const list = await Color.findAll({
      attributes: ['id', 'name', 'code'],
      order: [['id', 'desc']],
    });
    res.render('admin/color/color-list.ejs', { list });
  } catch (err) {
    next(createError(err));
  }
});

router.post('/', async (req, res, next) => {
  try {
    await Color.create(req.body);
    res.redirect('/admin/color');
  } catch (err) {
    next(createError(err));
  }
});

router.put('/', isAdmin(8), async (req, res, next) => {
  try {
    await Color.update(req.body, { where: { id: req.body.id } });
    res.redirect('/admin/color');
  } catch (err) {
    next(createError(err));
  }
});

router.delete('/', isAdmin(8), async (req, res, next) => {
  try {
    await Color.destroy({ where: { id: req.body.id } });
    res.redirect('/admin/color');
  } catch (err) {
    next(createError(err));
  }
});

module.exports = { router, name: '/color' };
