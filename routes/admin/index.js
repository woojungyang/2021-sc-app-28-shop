const path = require('path');
const fs = require('fs-extra');
const express = require('express');
const router = express.Router();

fs.readdirSync(__dirname)
  .filter((file) => file !== 'index.js')
  .forEach((file) => {
    const { name, router: childRouter } = require(path.join(__dirname, file));
    router.use(name, childRouter);
  });
router.get('/', (req, res, next) => {
  res.redirect('admin/main');
});
module.exports = router;

/* 
      * fs.readdirSync(__dirname)...
      배열로 삽입됨, => router/admin폴더안에 있는 파일명을 배열로 각각 불러드림(route/admin안에 index이기 때문에)
      그 후 index.js가 아닌 파일만 골라서 각파일명을 가져와서 
      router안에 name과 router를 불러와서 사용한다는 의미.


      *.router.get('/', (req, res, next) => {...
      admin/까지만 쳐도 자동으로 admin/index로 연결
  */
