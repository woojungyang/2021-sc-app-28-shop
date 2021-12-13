const path = require('path');
const express = require('express');
const router = express.Router();
const { error } = require('../../modules/util');
const { pool } = require('../../modules/mysql-init');
const sendNaverMail = require('../../modules/sendmail-init');

router.get('/', async (req, res, next) => {
  try {
    // mail 전송
    const result = await sendNaverMail(req.query.email);
    console.log(result);
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = { router, name: '/sendmail' };
