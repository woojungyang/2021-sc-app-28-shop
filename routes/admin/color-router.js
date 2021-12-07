const path = require('path');
const express = require('express');
const router = express.Router();
const createError = require('http-errors');
const { Color } = require('../../models');

router.get('/', async (req, res, next) => {
  try {
    const list = await Color.findAll({
      attributes: ['id', 'name', 'code'],
      order: [['id', 'desc']],
    });
    res.render('admin/color/color-list.ejs', { list });
    // res.status(200).json({ list });
  } catch (err) {
    next(createError(err));
    console.log(err);
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

router.put('/', async (req, res, next) => {
  try {
    await Color.update(req.body, { where: { id: req.body.id } });
    res.redirect('/admin/color');
  } catch (err) {
    next(createError(err));
  }
});

router.delete('/', async (req, res, next) => {
  try {
    res.send('...');
  } catch (err) {
    next(createError(err));
  }
});

module.exports = { router, name: '/color' };
