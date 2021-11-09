/* 
1. 로그인 -> serialize : browser의 cookie에 idx 남기기
2. 재접속 할때마다 -> deserialize -> req.user

3. strategy 로직
	가. 로그인 라우터의 미들웨어 passport.authenticate(['local', 'kakao', 'naver'])를 거친다.
	나. 각 Strategy로 가서 
	다. local은 done() 실행
	라. kakao/naver는 passport-kakao(naver)가 done을 내장하고 있으므로 미들웨어로만 넣어준다.
*/

const local = require('./local-strategy');
const { User } = require('../models');

const serialize = (user, done) => {
  done(null, user.id);
};

const deserialize = async (id, done) => {
  try {
    const user = await User.findOne({ where: { id } });
    if (user) done(null, user);
    else done(null, false, '사용자 정보가 없습니다.');
  } catch (err) {
    done(err);
  }
};

module.exports = (passport) => {
  passport.serializeUser(serialize);
  passport.deserializeUser(deserialize);
  local(passport);
};
