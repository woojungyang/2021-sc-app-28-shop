const cors = require('cors');

module.exports = (origin) => {
  const corsOptions = {
    origin,
    optionSuccessStatus: 200,
  };
  return cors(corsOptions);
};
