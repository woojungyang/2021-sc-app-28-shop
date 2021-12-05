const express = require('express');
const router = express.Router();

const queries = require('../../middlewares/query-mw');
const { Product, ProductFile, CateProduct, Cate } = require('../../models');
const { findLastId } = require('../../modules/util');

// 리스트
router.get('/', queries(), async (req, res, next) => {
  try {
    const rs = await Cate.getProduct(req.query, Product, ProductFile);
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
