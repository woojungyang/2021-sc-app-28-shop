const path = require('path');
const express = require('express');
const convert = require('color-convert');
const router = express.Router();
const createError = require('http-errors');
const { Section } = require('../../models');
const { isAdmin } = require('../../middlewares/auth-mw');

router.get('/', async (req, res, next) => {
  try {
    const list = await Section.findAll({
      attributes: ['id', 'name', 'color'],
      order: [['id', 'desc']],
    });
    const lists = list.map((v) => {
      v.txtColor = convert.hex.hsl(v.color)[2] > 50 ? '#000000' : '#ffffff';
      return v;
    });
    res.render('admin/section/section-list.ejs', { lists });
  } catch (err) {
    next(createError(err));
  }
});

router.post('/', async (req, res, next) => {
  try {
    await Section.create(req.body);
    res.redirect('/admin/section');
  } catch (err) {
    next(createError(err));
  }
});

router.put('/', isAdmin(8), async (req, res, next) => {
  try {
    await Section.update(req.body, { where: { id: req.body.id } });
    res.redirect('/admin/section');
  } catch (err) {
    next(createError(err));
  }
});

router.delete('/', isAdmin(8), async (req, res, next) => {
  try {
    await Section.destroy({ where: { id: req.body.id } });
    res.redirect('/admin/section');
  } catch (err) {
    next(createError(err));
  }
});

module.exports = { router, name: '/section' };
