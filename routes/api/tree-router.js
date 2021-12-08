const path = require('path');
const fs = require('fs-extra');
const express = require('express');
const { Cate, CateProduct } = require('../../models');
const tree = require('../../middlewares/tree-mw');
const { Op } = require('sequelize');
const { findAllId, findObj } = require('../../modules/util');
const router = express.Router();
const { isAdmin } = require('../../middlewares/auth-mw');

router.get('/', async (req, res, next) => {
  try {
    const tree = await fs.readJSON(path.join(__dirname, '../../json/tree.json'));
    res.status(200).json(tree);
  } catch (err) {
    res.status(500).json(err);
  }
});

// JSON 바꾸기
router.put('/', isAdmin(7), async (req, res, next) => {
  try {
    const tree = await fs.writeJSON(
      path.join(__dirname, '../../json/tree.json'), // tree.json
      req.body.node
    );
    res.status(200).json({ success: true });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

// JSON 바꾸기
router.put('/:id', isAdmin(7), async (req, res, next) => {
  try {
    const id = req.params.id;
    const { parents, text } = req.body.data;
    parents.pop();
    await Cate.update(
      { name: text, parents: parents.join(',') },
      { where: { id: id } }
    );
    res.status(200).json({ success: true });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

// DB 카테고리 등록
router.post('/', isAdmin(7), async (req, res, next) => {
  try {
    let { id, name, parents } = req.body;
    await Cate.create({ id, name, parents });
    res.status(200).json({ success: true });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

router.delete('/', isAdmin(8), tree(), async (req, res, next) => {
  try {
    const treeArray = findAllId(findObj(req.tree, req.body.id), []);
    await Cate.destroy({ where: { id: { [Op.or]: treeArray } } });
    await CateProduct.destroy({ where: { cate_id: { [Op.or]: treeArray } } });
    res.status(200).json({ success: true });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

module.exports = { name: '/tree', router };
