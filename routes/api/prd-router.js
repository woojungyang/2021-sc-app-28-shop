const express = require('express');
const router = express.Router();

const queries = require('../../middlewares/query-mw');
const { Product, ProductFile, Cate, Color, Section } = require('../../models');

// 리스트
router.get('/', queries(), async (req, res, next) => {
  try {
    const rs = await Product.findProducts(req.query, {
      Cate,
      Color,
      Section,
      ProductFile,
    });
    res.status(200).json(rs);
  } catch (err) {
    res.status(500).json(err);
  }
});

// 상세페이지
router.get('/:id', queries(), async (req, res, next) => {
  try {
    const prd = await Product.findProduct(req.params.id, Cate, ProductFile);
    const cate = prd.Cates.map((v) => v.id);
    res.render('admin/prd/prd-update', { prd, cate, _ });
  } catch (err) {
    next(createError(err));
  }
});

module.exports = { name: '/prd', router };
