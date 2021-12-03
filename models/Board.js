const numeral = require('numeral');
const _ = require('lodash');
const { dateFormat, relPath } = require('../modules/util');
const createPager = require('../modules/pager-init');

module.exports = (sequelize, { DataTypes, Op }) => {
  const Board = sequelize.define(
    'Board',
    {
      id: {
        type: DataTypes.INTEGER(10).UNSIGNED,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      title: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      writer: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      content: {
        type: DataTypes.TEXT,
      },
      readCounter: {
        type: DataTypes.INTEGER(10).UNSIGNED,
        defaulValue: 0,
      },
    },
    {
      charset: 'utf8',
      collate: 'utf8_general_ci',
      tableName: 'board',
      paranoid: true,
    }
  );

  Board.associate = (models) => {
    Board.belongsTo(models.User, {
      foreignKey: {
        name: 'user_id',
        allowNull: false,
      },
      sourceKey: 'id',
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    });
    Board.belongsTo(models.BoardInit, {
      foreignKey: {
        name: 'binit_id',
        allowNull: false,
      },
      sourceKey: 'id',
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    });
    Board.hasMany(models.BoardFile, {
      foreignKey: {
        name: 'board_id',
        allowNull: false,
      },
      sourceKey: 'id',
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    });
    Board.hasMany(models.BoardComment, {
      foreignKey: {
        name: 'board_id',
        allowNull: false,
      },
      sourceKey: 'id',
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    });
    Board.hasMany(models.BoardCounter, {
      foreignKey: {
        name: 'board_id',
        allowNull: false,
      },
      sourceKey: 'id',
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    });
  };

  Board.getCount = async function (query) {
    return await this.count({
      where: {
        [Op.and]: [sequelize.getWhere(query), { binit_id: query.boardId }],
      },
    });
  };

  Board.getViewData = function (rs, type) {
    const data = rs
      .map((v) => v.toJSON())
      .map((v) => {
        v.updatedAt = dateFormat(v.updatedAt, type === 'view' ? 'H' : 'D');
        v.readCounter = numeral(v.readCounter).format();
        v.imgs = [];
        v.files = [];
        if (v.BoardFiles.length) {
          for (let file of v.BoardFiles) {
            let obj = {
              thumbSrc: file.fileType === 'I' ? relPath(file.saveName) : null,
              name: file.oriName,
              id: file.id,
              type: file.fileType,
            };
            if (obj.type === 'F') v.files.push(obj);
            else v.imgs.push(obj);
          }
        }
        if (!v.imgs.length) {
          v.imgs[0] = {
            thumbSrc: 'https://via.placeholder.com/300?text=No+Image',
          };
        }
        delete v.createdAt;
        delete v.deletedAt;
        delete v.BoardFiles;
        return v;
      });
    return data;
  };

  Board.getList = async function (id, query, BoardFile = null, BoardComment = null) {
    let pager = null;
    const include = [];
    if (BoardFile) include.push({ model: BoardFile });
    if (BoardComment) {
      let { page2 = 1 } = query;
      let listCnt = 10;
      let pagerCnt = 5;
      let totalRecord = null;
      totalRecord = await BoardComment.count({ where: { board_id: id } });
      pager = createPager(page2 || 1, totalRecord, listCnt, pagerCnt);
      include.push({
        model: BoardComment,
        order: [['id', 'desc']],
        offset: pager.startIdx,
        limit: listCnt,
      });
    }
    const lists = await this.findAll({
      where: { id },
      include,
    });
    return { lists, pager };
  };

  Board.getLists = async function (query, BoardFile) {
    let { field, sort, boardId, page, boardType } = query;
    let listCnt = boardType === 'gallery' ? 12 : 5;
    let pagerCnt = 5;
    const totalRecord = await this.getCount(query);
    const pager = createPager(page, totalRecord, listCnt, pagerCnt);

    const rs = await this.findAll({
      order: [[field, sort]],
      offset: pager.startIdx,
      limit: pager.listCnt,
      where: {
        [Op.and]: [sequelize.getWhere(query), { binit_id: boardId }],
      },
      include: [{ model: BoardFile, attributes: ['saveName', 'fileType'] }],
    });
    const lists = this.getViewData(rs);

    return { lists, pager, totalRecord: numeral(pager.totalRecord).format() };
  };

  return Board;
};
