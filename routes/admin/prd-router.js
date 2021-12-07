const path = require('path');
const express = require('express');
const router = express.Router();
const { escape, unescape } = require('html-escaper');
const createError = require('http-errors');
const convert = require('color-convert');
const { error } = require('../../modules/util');
const _ = require('lodash');
const {
  Product,
  ProductFile,
  CateProduct,
  Cate,
  Color,
  Section,
  ColorProduct,
  SectionProduct,
} = require('../../models');
const uploader = require('../../middlewares/multer-mw');
const afterUploader = require('../../middlewares/after-multer-mw');
const sharpInit = require('../../middlewares/sharp-mw');
const { moveFile } = require('../../modules/util');
const queries = require('../../middlewares/query-mw');
const { isAdmin } = require('../../middlewares/auth-mw');

router.get('/', queries(), async (req, res, next) => {
  if (req.query.type === 'create') {
    const color = await Color.findAll({ order: [['name', 'asc']] });
    const colors = color.map((v) => {
      v.style = `background-color: ${v.code};`;
      return v;
    });
    const section = await Section.findAll({ order: [['name', 'asc']] });
    const sections = section.map((v) => {
      v.txtColor = convert.hex.hsl(v.color)[2] > 50 ? '#000000' : '#ffffff';
      v.style = `background-color: ${v.color}; color: ${v.txtColor};`;
      return v;
    });
    // res.json({ colors, sections });
    res.render('admin/prd/prd-form', { colors, sections });
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
    const prd = await Product.findProduct(req.params.id, {
      Cate,
      ProductFile,
      Color,
      Section,
    });
    const cate = prd.Cates.map((v) => v.id);
    const color = await Color.findAll({ order: [['name', 'asc']] });
    const section = await Section.findAll({ order: [['name', 'asc']] });
    const colors = color
      .map((v) => v.toJSON())
      .map((v) => {
        v.checked = _.find(prd.Colors, ['id', v.id]) ? true : false;
        v.style = `background-color: ${v.code};`;
        return v;
      });
    const sections = section
      .map((v) => v.toJSON())
      .map((v) => {
        v.checked = _.find(prd.Sections, ['id', v.id]) ? true : false;
        v.txtColor = convert.hex.hsl(v.color)[2] > 50 ? '#000000' : '#ffffff';
        v.style = `background-color: ${v.color}; color: ${v.txtColor};`;
        return v;
      });
    res.render('admin/prd/prd-update', { prd, cate, _, colors, sections });
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
      let id = '';
      req.body.content = escape(req.body.content);
      if (req.body.type === 'update') {
        // 수정에서 처리
        id = req.body.id;
        await Product.update(req.body, { where: { id } });
        await CateProduct.destroy({ where: { prd_id: id } });
        await ColorProduct.destroy({ where: { prd_id: id } });
        await SectionProduct.destroy({ where: { prd_id: id } });
      } else {
        // 등록에서 처리
        const product = await Product.create(req.body);
        id = product.id;
      }

      // 공통 처리
      req.files.forEach((file) => (file.prd_id = id));
      if (req.files.length) await ProductFile.bulkCreate(req.files);

      const catePrd = req.body.cate.split(',').map((cate) => ({
        cate_id: cate,
        prd_id: id,
      }));
      if (req.body.cate !== '') await CateProduct.bulkCreate(catePrd);

      const sectionPrd = req.body.section.map((_id) => ({
        section_id: _id,
        prd_id: id,
      }));
      if (req.body.section.length) await SectionProduct.bulkCreate(sectionPrd);

      const colorPrd = req.body.color.map((_id) => ({
        color_id: _id,
        prd_id: id,
      }));
      if (req.body.color.length) await ColorProduct.bulkCreate(colorPrd);

      res.redirect(req.body.type === 'update' ? res.locals.goList : '/admin/prd');
    } catch (err) {
      next(createError(err));
    }
  }
);

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
    await CateProduct.destroy({ where: { prd_id: id } });
    await SectionProduct.destroy({ where: { prd_id: id } });
    await ColorProduct.destroy({ where: { prd_id: id } });
    res.redirect(res.locals.goList);
  } catch (err) {
    next(createError(err));
  }
});

module.exports = { name: '/prd', router };
