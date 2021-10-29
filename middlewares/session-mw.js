const session = require('express-session');
const MySQLStore = require('express-mysql-session')(session);
const { pool } = require('../modules/mysql-init');

const storeOptions = {
  expiration: 86400000,
};

const expressSession = session({
  secret: process.env.COOKIE_SALT,
  resave: false,
  saveUninitialized: true,
  store: new MySQLStore(storeOptions, pool),
  cookie: {
    secure: false,
    httpOnly: true,
  },
});

module.exports = (app) => {
  app.set('trust proxy', 1);
  return expressSession;
};

/* 
	cookie는 사용자의 정보가 웹서버를 통해 사용자의 컴퓨터에 직접저장되는 정보의 단위.
		ex)아이디와 비밀번호를 저장하시겠습니까? ->당신의 아이디와 비밀번호를 쿠키로 저장하겠다는의미.
	cookie를 사용하기 위해서는 cookie-parser를 설치해야함.
	현재 사용자의 컴퓨터가 가지고 있는 쿠키를 확인하는 방법: req.cookies.[cookie.name]
			secure: HTTPS가 아닌 통신에서는 쿠키를 전송하지 않음
			httpOnly: XSS 해커 공격으로부터 방어 (해커의 cookie 탈취)
	쿠키를 컴퓨터에 저장하는 방법 :res.cooke('cookie name', 'cookie value', 'option')
	Session은 세션은 쿠키보다 더 안전하고 많은 데이터를 저장하는 저장 방식
	세션은 데이터를 서버에 저장하기 때문에 쿠키보다 안전하다고 볼 수 있음.
	session을 사용하기 위해서는 express-session을 설치해야함

 		express-session?
 		:세션을 관리하기 위한 미들웨어.(사용자의 정보 저장을 위한 module)
 			1. secret: 쿠키를 임의로 변조하는 것을 방지하기 위한 값, 이값을 통해서 세션을 암호화 하여 저장.
			2. resave: 세션을 언제나 저장할지(변경되지않아도) 정하는 값. 이값은 false로 저장하는 것을 권장.
			3. sveUninitialized: 세션이 저장되기 전에 uninitialized 상태로 미리 만들어서 저장.
			4. store : 세션이 데이터를 저장하는 곳
								sotre의 default값은 Memory Store입니다. 메모리는 서버나 클라이언트를 껐다 키면 사라지는 휘발성

			접근할대에는 req.session으로 세션에 접근.

cookie와 session의 차이는
	쿠키의 경우 데이터를 사용자의 컴퓨터에 저장하기 때문에 비밀번호 같은 민감한 부분이라도 예외없이 그대로 드러남




 */
