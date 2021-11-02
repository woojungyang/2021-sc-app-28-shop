const path = require('path');
const express = require('express');
const router = express.Router();
const { error, telNumber, alert, getStringTel, getArrayTel } = require('../../modules/util');
const { User, Sequelize } = require('../../models');
const { Op } = Sequelize;
const pager = require('../../middlewares/pager-mw');
const createError = require('http-errors');
const bcrypt = require('bcrypt');

//회원 등록화면
router.get('/', (req, res, next) => {
  if (req.query.type === 'create') {
    const ejs = {
      telNumber,
      type: req.query.type || '',
    };
    res.render('admin/user/user-form', ejs);
  } else next();
});

//회원리스트
router.get('/', pager(User), async (req, res, next) => {
  try {
    let { field = 'id', search = '', sort = 'desc' } = req.query;
    const users = await User.searchUser(req.query, req.pager);
    const ejs = { telNumber, pager: req.pager, users, field, sort, search };
    res.render('admin/user/user-list', ejs);
  } catch (err) {
    next(createError(err));
  }
});

//회원수정화면
router.get('/:id', async (req, res, next) => {
  // type 분기
  try {
    const user = await User.findOne({ where: { id: req.params.id } });
    user.tel = getArrayTel(user.tel);
    const ejs = { telNumber, type: 'update', user };
    res.render('admin/user/user-form', ejs);
  } catch (err) {
    next(createError(err));
  }
});

//회원 수정
router.put('/', (req, res, next) => {
  res.send('/admin/user:PUT');
});

//회원 저장
router.post('/', async (req, res, next) => {
  try {
    req.body.tel = getStringTel(req.body.tel1, req.body.tel2, req.body.tel3);
    const user = await User.create(req.body);
    res.send(alert('회원가입이 완료되었습니다.', '/admin/user'));
  } catch (err) {
    next(createError(err));
  }
});

//회원삭제
router.delete('/', (req, res, next) => {
  res.send('/admin/user:DELETE');
});

module.exports = { name: '/user', router };
