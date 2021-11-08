const path = require('path');
const express = require('express');
const router = express.Router();
const createError = require('http-errors');
const queries = require('../../middlewares/query-mw');
const { telNumber, alert, getSeparateArray } = require('../../modules/util');
const { User } = require('../../models');

// 회원 등록 화면
router.get('/', (req, res, next) => {
  if (req.query.type === 'create') {
    const ejs = { telNumber };
    res.render('admin/user/user-form', ejs);
  } else next();
});

// 회원리스트
router.get('/', queries(), async (req, res, next) => {
  try {
    let { field, search, sort, status } = req.query;
    const { lists, pager, totalRecord } = await User.getLists(req.query);
    const ejs = { telNumber, pager, lists, totalRecord };
    res.render('admin/user/user-list', ejs);
  } catch (err) {
    next(createError(err));
  }
});

// 회원 수정 화면
router.get('/:id', async (req, res, next) => {
  try {
    const user = await User.findOne({ where: { id: req.params.id } });
    user.tel = getSeparateArray(user.tel, '-');
    const ejs = { telNumber, user };
    res.render('admin/user/user-update', ejs);
  } catch (err) {
    next(createError(err));
  }
});

// 회원 저장
router.post('/', async (req, res, next) => {
  try {
    const user = await User.create(req.body);
    res.send(alert('회원가입이 완료되었습니다.', '/admin/user'));
  } catch (err) {
    next(createError(err));
  }
});

// 회원 수정
router.put('/', async (req, res, next) => {
  try {
    const [rs] = await User.update(req.body, {
      where: { id: req.body.id },
      individualHooks: true,
    });
    if (rs) res.send(alert('회원수정이 완료되었습니다.', '/admin/user'));
    else res.send(alert('처리되지 않았습니다', '/admin/user'));
  } catch (err) {
    next(createError(err));
  }
});

// 회원 삭제
router.delete('/', async (req, res, next) => {
  try {
    const { id } = req.body;
    await User.destroy({ where: { id } });
    res.redirect('/admin/user');
  } catch (err) {
    next(createError(err));
  }
});

module.exports = { name: '/user', router };

/*  
  * req.query
    :각 쿼리 문자열 매개 변수에 대한 속성이포함된 개체이다.
    ex)https://query/search?searchWord=검색내용일때, searchWord 매개변수(parameter)의검색내용이라는 값(argument)를 가져온다.
    
  * req.params
    :ex)user/:name경로가 있을때 'name'속성 req.params.name으로 사용할 수있다.
    https://params/user/1234일 경우 1234받는다. 
    ! req.params는 더이상 사용하지않음.

  * req.body
    :JSON등의 데이터를 주로 담을때 사용
    (주로 POST로 유저의 정보 또는 파일 업로드를 보냈을때 사용)

    ex) app.js 부분
      app.use(bodyParser.json())
      app.use(bodyParser.urlencoded({ extends: true }))  
		      ↓
        	↓ // Express 4.16.0버전 부터 body-parser의 일부 기능이 익스프레스에 내장
        	↓ // 아래와 같이 사용 가능하다
      app.use(express.json())
      app.use(express.urlencoded({ extends: true}))

      req.body는 body-parser를 사용하기 전에는 default값으로 undefined 설정되기 때문에 body-parser를 사용하여 해결해야 오류를 뿜지않는다.

      form 에서는 name: value, email: value, password: value의 값을 body에 담아 POST request를 보냄
      form 에서 post method로 보낸 것을 req.body property(속성)으로 name, email, password를 받을 수 있다.






*/
