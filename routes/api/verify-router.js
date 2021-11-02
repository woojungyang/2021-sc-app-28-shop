const path = require('path');
const express = require('express');
const router = express.Router();
const { User } = require('../../models');

router.get('/', async (req, res, next) => {
  // userid, email 중복 검증
  try {
    let { key, value } = req.query;
    console.log(req.query);
    let where = key === 'userid' ? { userid: value } : { email: value };
    const rs = await User.findAll({ where });
    // vaildation안에 api안에서 axios를 통신을 통해 전송해주는 query 내용
    res.status(200).json(!rs.length);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

module.exports = { name: '/verify', router };
