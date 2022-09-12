const db = require("../models")
const { body } = require('express-validator')
const { validation, getPagingData, getPagination } = require("../utilities/function")
const fs = require('fs');
const Op = db.Sequelize.Op
var date_ob = new Date();
var date = ("0" + date_ob.getDate()).slice(-2);
var month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
var year = date_ob.getFullYear();
var hours = date_ob.getHours();
var minutes = date_ob.getMinutes();
var seconds = date_ob.getSeconds();
module.exports = {
  validate: (method) => {
    switch (method) {
      case 'form': {
        return [
          body('isActive', 'สถานะที่เลือกไม่ถูกต้อง').optional().isIn(['Y', 'N'])
        ]
      }
    }
  },

  create: async (req, res) => {
    try {
      if (req.files){
        let avatar = req.files.avatar;
        var name = avatar.name.split('.')[1];
        var newname = year+month+date+hours+minutes+seconds+'.'+name;
        avatar.mv('./avatars/' + newname);
        
        var data = {
          "image": 'avatars/' + newname,
          "isActive": 'Y'
        }
        const row = await db.Banner.create(data);
        res.send({ status: "success", message: "เพิ่มข้อมูลเรียบร้อย" });
      }else{
        res.status(501).send({ status: "error", message: "ไม่สามารถเพิ่มข้อมูลได้ในตอนนี้!" });
      }
     
    } catch (err) {
      res.status(500).send({ status: "error", message: err.message || "ไม่สามารถเพิ่มข้อมูลได้ในตอนนี้!" });
    }

  },

  findAll: async (req, res) => {
    // var condition = null;
    const { page, perPage, sort } = req.body;
    const { limit, offset } = getPagination(page, perPage);
    // const order = [[sort.field ? sort.field : 'id', sort.desc ? 'DESC' : 'ASC']];

    try {
      let data = await db.Banner.findAndCountAll({
        // where: condition, order, limit, offset
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
      let row = await db.Banner.findByPk(req.params.id);
      res.send({ status: "success", row: row });
    } catch (err) {
      res.status(500).send({ status: "error", message: err.message || "ไม่สามารถแสดงข้อมูลที่เลือกได้!" });
    }
  },

  update: async (req, res) => {
    const id = req.params.id;
    const error = validation(req, ['isActive']);
    if (error) {
      return res.status(422).json(error);
    }

    try {

      let row = await db.Banner.findByPk(req.params.id);
      if (!row) {
        throw new Error('ไม่สามารถทำรายการได้ เนื่องจากไม่พบรายการที่ต้องการแก้ไข');
      }
      if (!req.files) {
        throw new Error('ไม่สามารถทำรายการได้ เนื่องจากไม่พบไฟล์ในการอัพโหลด');
      }
      let image = req.files.image;
      image.mv('./image/' + image.name);

      await db.Banner.update({ image: image.name, isActive: req.body.isActive }, { where: { id: req.params.id } });
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
      let row = await db.Banner.findByPk(req.params.id);
      if (!row) {
        throw new Error('ไม่สามารถทำรายการได้ เนื่องจากไม่พบรายการที่ต้องการลบ');
      }
      var filePath = './image/' + row.image;
      fs.unlinkSync(filePath);
      await db.Banner.destroy({ where: { id: req.params.id } });
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
      let row = await db.Banner.findByPk(req.params.id);
      if (!row) {
        throw new Error('ไม่สามารถทำรายการได้ เนื่องจากไม่พบรายการที่ต้องการแก้ไข');
      }
      await db.Banner.update(req.body, { where: { id: id } });
      res.send({ status: "success", message: "บันทึกข้อมูลเรียบร้อย" });
    } catch (err) {
      res.status(500).send({ status: "error", message: err.message || "ไม่สามารถบันทึกข้อมูลที่เลือกได้!" });
    }
  },


}
