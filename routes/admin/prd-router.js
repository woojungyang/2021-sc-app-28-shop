const path = require('path');
const express = require('express');
const router = express.Router();
const createError = require('http-errors');
const { error } = require('../../modules/util');

router.get('/', (req, res, next) => {
  if (req.query.type === 'create') {
    res.render('admin/prd/prd-form');
  } else next();
});

router.get('/', async (req, res, next) => {
  try {
    res.render('admin/prd/prd-list');
  } catch (err) {
    next(createError(err));
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    res.render('admin/prd/prd-form');
  } catch (err) {
    next(createError(err));
  }
});

router.post('/', async (req, res, next) => {
  try {
    res.json(req.body);
    // res.redirect('/admin/prd');
  } catch (err) {
    next(createError(err));
  }
});

router.put('/', async (req, res, next) => {
  try {
    res.redirect('/admin/prd');
  } catch (err) {
    next(createError(err));
  }
});

router.delete('/', async (req, res, next) => {
  try {
    res.redirect('/admin/prd');
  } catch (err) {
    next(createError(err));
  }
});

module.exports = { name: '/prd', router };
