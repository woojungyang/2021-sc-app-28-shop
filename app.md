/******\******* global require ******\*******/ require('./modules/dotenv-init')(); const express =
require('express'); const app = express(); const path = require('path'); const helmet =
require('helmet'); //서버 보안용 // const passport = require('passport'); // const passportModule =
require('./passport'); const method = require('./middlewares/method-mw'); const logger =
require('./middlewares/morgan-mw'); const session = require('./middlewares/session-mw'); const
locals = require('./middlewares/locals-mw'); const { sequelize } = require('./models');

/******\*\*\******* sequelize init ******\*\*******/ require('./modules/sequelize-init')(sequelize);

/******\*\*\******* server init ******\*\*******/ require('./modules/server-init')(app,
process.env.PORT);

/******\*\*\******* helmet init ******\*\*******/ app.use(helmet({ contentSecurityPolicy: false }));

/******\*\*\******* static init ******\*\*******/ app.use('/', express.static(path.join(**dirname,
'public'))); app.use('/uploads', express.static(path.join(**dirname, 'storages')));

/******\*\******* view engine ******\*\*\*******/ app.set('view engine', 'ejs'); app.set('views',
'./views'); //ejs를 사용할꺼고 ejs 관련 파일들은 view폴더 안에 있다. app.locals.pretty = true;

/******\*\*\******* middleware ******\*\*\*******/ app.use(express.json()); //json의 형태로 서버 요
청에 대한 응답을 받겠다. app.use(express.urlencoded({ extended: false })); app.use(method());
app.use(session(app));

/******\*\*\*\******* passport ******\*\*\*\*******/ // passportModule(passport); //
app.use(passport.initialize()); // app.use(passport.session());

/********\********* locals ********\*********/ app.use(locals);

/******\*\*\******* logger init ******\*\*******/ app.use(logger);

/******\*\*\******* router init ******\*\*******/ const adminRouuter = require('./routes/admin');
const apiRouuter = require('./routes/api');

app.use('/admin', adminRouuter); app.use('/api', apiRouuter);

/******\*\*\*\******* error init ******\*\*******/ const \_404Router =
require('./routes/error/404-router'); const \_500Router = require('./routes/error/500-router');

app.use(\_404Router); app.use(\_500Router);
