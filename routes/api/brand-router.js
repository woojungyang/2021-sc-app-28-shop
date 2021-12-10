const path = require('path');
const fs = require('fs-extra');
const express = require('express');
const { Op } = require('sequelize');
const router = express.Router();
const { BoardInit, Board, BoardFile } = require('../../models');
const boardInit = require('../../middlewares/boardinit-mw');

router.get('/', async (req, res, next) => {
  try {
    const [list] = await BoardInit.findAll({
      where: { id: req.query.id },
      include: [
        {
          model: Board,
          attributes: ['id', 'content'],
          include: [
            {
              model: BoardFile,
              attributes: ['saveName'],
            },
          ],
        },
      ],
    });
    res.status(200).json(list.Boards);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

module.exports = { name: '/brand', router };
