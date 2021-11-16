module.exports = (fields) => {
  return (req, res, next) => {
    const files = [];
    for (let field of fields) {
      if (req.files && req.files[field]) {
        req.files[field].forEach((v) => {
          v.oriName = v.originalname;
          v.saveName = v.filename;
          v.mimeType = v.mimetype;
          v.fieldNum = v.fieldname.split('_')[1];
          v.fileType = v.fieldname.split('_')[0] === 'img' ? 'I' : 'F';
          files.push(v);
        });
      }
    }
    req.files = files;
    next();
  };
};
