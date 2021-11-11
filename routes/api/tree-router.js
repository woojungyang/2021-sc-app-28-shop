const path = require('path');
const fs = require('fs-extra');
const express = require('express');
const { Cate } = require('../../models');
const tree = require('../../middlewares/tree-mw');
const { Op } = require('sequelize');
const { findChildId, findObj } = require('../../modules/util');
const router = express.Router();

router.get('/', async (req, res, next) => {
  try {
    const tree = await fs.readJSON(path.join(__dirname, '../../json/tree.json'));
    res.status(200).json(tree);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.put('/', async (req, res, next) => {
  try {
    const tree = await fs.writeJSON(path.join(__dirname, '../../json/tree.json'), req.body.node);
    res.status(200).json({ success: true });
  } catch (err) {
    res.status(500).json(err);
  }
});

router.post('/', async (req, res, next) => {
  try {
    await Cate.create({ id: req.body.id });
    res.status(200).json({ success: true });
  } catch (err) {
    res.status(500).json(err);
  }
});

router.delete('/', tree(), async (req, res, next) => {
  try {
    const treeArray = findChildId(findObj(req.tree, req.body.id), []);
    await Cate.destroy({ where: { id: { [Op.or]: treeArray } } });
    res.status(200).json({ success: true });
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = { name: '/tree', router };
