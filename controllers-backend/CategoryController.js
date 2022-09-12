const db = require("../models")
const { body } = require('express-validator')
const { validation, getPagingData, getPagination } = require("../utilities/function")
const Bcrypt = require("bcrypt");
const Op = db.Sequelize.Op

module.exports = {
  validate: (method) => {
    switch (method) {
      case 'form': {
        return [
          body('name', 'ต้องระบุข้อมูลให้ครบถ้วน').not().isEmpty().trim().escape(),
          body('sort', 'ต้องเป็นตัวเลขเท่านั้น').optional().isInt(),
          body('isActive', 'สถานะที่เลือกไม่ถูกต้อง').optional().isIn(['Y', 'N'])
        ]
      }
    }
  },

  create: async (req, res) => {
    const error = validation(req, ['name', 'sort', 'isActive']);
    if (error) {
      return res.status(422).json(error);
    }


    try {
      await db.Category.create(req.body)
      res.send({ status: "success", message: "เพิ่มข้อมูลเรียบร้อย" });
    } catch (err) {
      res.status(500).send({ status: "error", message: err.message || "ไม่สามารถเพิ่มข้อมูลได้ในตอนนี้!" });
    }

  },

  findAll: async (req, res) => {
    var condition = null;
    const { page, perPage, sort } = req.body;
    const { limit, offset } = getPagination(page, perPage);
    const order = [[sort.field ? sort.field : 'id', sort.desc ? 'DESC' : 'ASC']];

    try {
      let data = await db.Category.findAndCountAll({
        where: condition, order, limit, offset
      });
      res.send(getPagingData(data, page, limit));
    } catch (err) {
      res.status(500).send({ status: "error", message: err.message || "ไม่สามารถแสดงข้อมูลได้ในตอนนี้!" });
    }
  },

  findOne: async (req, res) => {
    const id = req.params.id;
    const error = validation(req);
    if (error) {
      return res.status(422).json(error);
    }

    try {
      let row = await db.Category.findByPk(req.params.id);
      res.send({ status: "success", row: row });
    } catch (err) {
      res.status(500).send({ status: "error", message: err.message || "ไม่สามารถแสดงข้อมูลที่เลือกได้!" });
    }
  },

  update: async (req, res) => {
    const id = req.params.id;
    const error = validation(req, ['name', 'sort', 'isActive']);
    if (error) {
      return res.status(422).json(error);
    }

    try {
      let row = await db.Category.findByPk(req.params.id);
      if (!row) {
        throw new Error('ไม่สามารถทำรายการได้ เนื่องจากไม่พบรายการที่ต้องการแก้ไข');
      }
      await db.Category.update(req.body, { where: { id: req.params.id } });
      res.send({ status: "success", message: "บันทึกข้อมูลเรียบร้อย" });
    } catch (err) {
      res.status(500).send({ status: "error", message: err.message || "ไม่สามารถบันทึกข้อมูลที่เลือกได้!" });
    }

  },

  delete: async (req, res) => {
    const id = req.params.id;
    const error = validation(req);
    if (error) {
      return res.status(422).json(error);
    }

    try {
      let row = await db.Category.findByPk(req.params.id);
      if (!row) {
        throw new Error('ไม่สามารถทำรายการได้ เนื่องจากไม่พบรายการที่ต้องการลบ');
      }
      await db.Category.destroy({ where: { id: req.params.id } });
      res.send({ status: "success", message: "ลบข้อมูลเรียบร้อย" });
    } catch (err) {
      res.status(500).send({ status: "error", message: err.message || "ไม่สามารถแสดงข้อมูลได้ในตอนนี้!" });
    }

  },

  status: async (req, res) => {
    const id = req.params.id;
    const error = validation(req, ['isActive']);
    if (error) {
      return res.status(422).json(error);
    }

    try {
      let row = await db.Category.findByPk(req.params.id);
      if (!row) {
        throw new Error('ไม่สามารถทำรายการได้ เนื่องจากไม่พบรายการที่ต้องการแก้ไข');
      }
      await db.Category.update(req.body, { where: { id: id } });
      res.send({ status: "success", message: "บันทึกข้อมูลเรียบร้อย" });
    } catch (err) {
      res.status(500).send({ status: "error", message: err.message || "ไม่สามารถบันทึกข้อมูลที่เลือกได้!" });
    }
  },


}
