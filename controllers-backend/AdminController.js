const db = require("../models")
const { validation, getPagingData, getPagination } = require("../utilities/function")
const { setUpCookie } = require('../middleware/admin')
const Bcrypt = require("bcrypt");
const Op = db.Sequelize.Op

module.exports = {
  create: async (req, res) => {
    const error = validation(req);
    if (error) {
      return res.status(422).json(error);
    }


    try {
      await db.Admin.create({
        username: req.body.username,
        password: await Bcrypt.hashSync(req.body.password, 10),
        isActive: 'Y'
      })
      res.send({ status: "success", message: "เพิ่มข้อมูลเรียบร้อย" });
    } catch (err) {
      res.status(500).send({ status: "error", message: err.message || "ไม่สามารถเพิ่มข้อมูลได้ในตอนนี้!" });
    }

  },

  findAll: async (req, res) => {
    const username = req.query.username;
    var condition = username ? { username: { [Op.like]: `%${username}%` } } : null;
    const { page, perPage, sort } = req.body;
    const { limit, offset } = getPagination(page, perPage);
    const order = [[sort.field ? sort.field : 'id', sort.desc ? 'DESC' : 'ASC']];

    try {
      let data = await db.Admin.findAndCountAll({
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
      let row = await db.Admin.findByPk(req.params.id);
      res.send({ status: "success", row: row });
    } catch (err) {
      res.status(500).send({ status: "error", message: err.message || "ไม่สามารถแสดงข้อมูลที่เลือกได้!" });
    }
  },

  update: async (req, res) => {
    const id = req.params.id;
    const error = validation(req);
    if (error) {
      return res.status(422).json(error);
    }

    try {
      let row = await db.Admin.findByPk(req.params.id);
      if (!row) {
        throw new Error('ไม่สามารถทำรายการได้ เนื่องจากไม่พบรายการที่ต้องการแก้ไข');
      }
      delete req.body.username;
      if (req.body.password) {
        req.body.password = await Bcrypt.hashSync(req.body.password, 10);
      } else {
        delete req.body.password;
      }
      await db.Admin.update(req.body, { where: { id: req.params.id } });
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
      let row = await db.Admin.findByPk(req.params.id);
      if (!row) {
        throw new Error('ไม่สามารถทำรายการได้ เนื่องจากไม่พบรายการที่ต้องการลบ');
      }
      await db.Admin.destroy({ where: { id: req.params.id } });
      res.send({ status: "success", message: "ลบข้อมูลเรียบร้อย" });
    } catch (err) {
      res.status(500).send({ status: "error", message: err.message || "ไม่สามารถแสดงข้อมูลได้ในตอนนี้!" });
    }

  },

  me: async (req, res) => {
    const user = await db.Admin.findOne({ where: { id: req.user.id } });
    res.send({ status: "success", user: user });
  },


  login: async (req, res) => {
    const error = validation(req);
    if (error) {
      return res.status(422).json(error);
    }

    try {
      let row = await db.Admin.scope("withPassword").findOne({ where: { username: req.body.username } });
      if (row) {
        var user = row.toJSON();
        const passwordIsValid = Bcrypt.compareSync(req.body.password, user.password);
        if (!passwordIsValid) {
          throw new Error("รหัสผ่านไม่ถูกต้อง.");
        }
        row.loginAt = Date();
        row.token = await Bcrypt.hashSync(row.username + row.loginAt, 10);
        await row.save();

        //Assign Token
        let payload = (await db.Admin.scope("withPublic").findByPk(row.id)).toJSON();
        let result = setUpCookie(res, null, payload)
        if (result.error) {
          throw new Error(result.message)
        }

        const foundItem = await db.Login.findOne({ where: { mode: 'admin', user_id: payload.id } });
        if (!foundItem) {
          db.Login.create({ mode: 'admin', user_id: payload.id, token: payload.token })
        } else {
          db.Login.update({ token: payload.token }, { where: { mode: 'admin', user_id: payload.id } });
        }

        res.send({ status: "success", user: payload, token: payload.token, message: "เข้าระบบเรียบร้อย" });
      } else {
        throw new Error("ไม่พบข้อมูลผู้ใช้นี้ในระบบ");
      }
    } catch (err) {
      res.status(500).send({ status: "error", message: err.message || "ไม่สามารถเข้าระบบได้" })
    }
  },

  logout: (req, res) => {
    try {
      let result = setUpCookie(res)
      if (result.error) {
        res.status(500).send({ status: "error", message: result.message || "ไม่สามารถออกจากระบบได้" })
      } else {
        res.send({ status: "success", message: "ออกจากระบบเรียบร้อย" });
      }
    } catch (err) {
      res.status(500).send({ status: "error", message: err.message || "ไม่สามารถออกจากระบบได้" })
    }
  },



  status: async (req, res) => {
    const id = req.params.id;
    const error = validation(req, ['isActive']);
    if (error) {
      return res.status(422).json(error);
    }

    try {
      let row = await db.Admin.findByPk(req.params.id);
      if (!row) {
        throw new Error('ไม่สามารถทำรายการได้ เนื่องจากไม่พบรายการที่ต้องการแก้ไข');
      }
      await db.Admin.update(req.body, { where: { id: id } });
      res.send({ status: "success", message: "บันทึกข้อมูลเรียบร้อย" });
    } catch (err) {
      res.status(500).send({ status: "error", message: err.message || "ไม่สามารถบันทึกข้อมูลที่เลือกได้!" });
    }
  },


}
