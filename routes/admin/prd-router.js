const path = require('path');
const express = require('express');
const router = express.Router();
const { escape, unescape } = require('html-escaper');
const createError = require('http-errors');
const { error } = require('../../modules/util');
const _ = require('lodash');
const { Product, ProductFile, CateProduct, Cate } = require('../../models');
const uploader = require('../../middlewares/multer-mw');
const afterUploader = require('../../middlewares/after-multer-mw');
const sharpInit = require('../../middlewares/sharp-mw');
const { moveFile } = require('../../modules/util');
const queries = require('../../middlewares/query-mw');
const { isAdmin } = require('../../middlewares/auth-mw');

router.get('/', queries(), (req, res, next) => {
  if (req.query.type === 'create') {
    res.render('admin/prd/prd-form');
  } else next();
});

router.get('/', queries(), async (req, res, next) => {
  try {
    const { lists, pager, totalRecord } = await Product.getLists(
      req.query,
      ProductFile
    );
    // res.json({ lists, pager, totalRecord });
    res.render('admin/prd/prd-list', { lists, pager, totalRecord });
  } catch (err) {
    next(createError(err));
  }
});

router.get('/:id', queries(), async (req, res, next) => {
  try {
    const prd = await Product.findProduct(req.params.id, Cate, ProductFile);
    const cate = prd.Cates.map((v) => v.id);
    res.render('admin/prd/prd-update', { prd, cate, _ });
  } catch (err) {
    next(createError(err));
  }
});

router.post(
  '/',
  uploader.fields([
    { name: 'img_1' },
    { name: 'img_2' },
    { name: 'img_3' },
    { name: 'img_4' },
    { name: 'img_5' },
    { name: 'detail_1' },
    { name: 'detail_2' },
  ]),
  afterUploader([
    'img_1',
    'img_2',
    'img_3',
    'img_4',
    'img_5',
    'detail_1',
    'detail_2',
  ]),
  sharpInit(300),
  queries('body'),
  async (req, res, next) => {
    try {
      if (req.body.type === 'update') {
        req.body.content = escape(req.body.content);
        await Product.update(req.body, { where: { id: req.body.id } });
        req.files.forEach((file) => (file.prd_id = req.body.id));
        const files = await ProductFile.bulkCreate(req.files);
        await CateProduct.destroy({ where: { prd_id: req.body.id } });
        const catePrd = req.body.cate.split(',').map((cate) => ({
          cate_id: cate,
          prd_id: req.body.id,
        }));
        if (req.body.cate !== '') await CateProduct.bulkCreate(catePrd);
        // res.json({ file: req.files, req: req.body, locals: res.locals });
        res.redirect(res.locals.goList);
      } else {
        req.body.content = escape(req.body.content);
        const product = await Product.create(req.body);
        req.files.forEach((file) => (file.prd_id = product.id));
        if (req.files.length) await ProductFile.bulkCreate(req.files);
        const catePrd = req.body.cate.split(',').map((cate) => ({
          cate_id: cate,
          prd_id: product.id,
        }));
        if (req.body.cate !== '') await CateProduct.bulkCreate(catePrd);
        res.redirect('/admin/prd');
      }
    } catch (err) {
      next(createError(err));
    }
  }
);

router.put('/', async (req, res, next) => {
  try {
    res.redirect('/admin/prd');
  } catch (err) {
    next(createError(err));
  }
});

router.put('/status', queries('body'), async (req, res, next) => {
  try {
    const { status, id } = req.body;
    await Product.update({ status }, { where: { id } });
    res.redirect(res.locals.goList);
  } catch (err) {
    next(createError(err));
  }
});

router.delete('/', isAdmin(8), queries('body'), async (req, res, next) => {
  try {
    const { id } = req.body;
    await Product.destroy({ where: { id } });
    const files = await ProductFile.findAll({
      attributes: ['saveName'],
      where: { prd_id: id },
    });
    for (let { saveName } of files) await moveFile(saveName);
    await ProductFile.destroy({ where: { prd_id: id } });
    res.redirect(res.locals.goList);
  } catch (err) {
    next(createError(err));
  }
});

module.exports = { name: '/prd', router };
