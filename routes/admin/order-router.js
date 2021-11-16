const path = require('path');
const express = require('express');
const router = express.Router();
const { isAdmin } = require('../../middlewares/auth-mw');
const { error } = require('../../modules/util');

router.get('/', (req, res, next) => {
  if (req.query.type === 'update') {
    res.render('admin/order/order-form', { css: 'admin-order' });
  } else {
    res.render('admin/order/order-list', { css: 'admin-order' });
  }
});

router.get('/:id', (req, res, next) => {
  res.render('admin/order/order-form', { css: 'admin-order' });
});

router.post('/', isAdmin(8), (req, res, next) => {
  res.send('/admin/order:POST');
});

router.put('/', isAdmin(8), (req, res, next) => {
  res.send('/admin/order:PUT');
});

router.delete('/', isAdmin(8), (req, res, next) => {
  res.send('/admin/order:DELETE');
});

module.exports = { name: '/order', router };
