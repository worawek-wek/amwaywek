//import path from 'path'
const Bcrypt = require('bcrypt');
const db = require('../models');
const { setUpCookie, getIdentifier } = require('../middleware/auth');
const { validation, sendSMS } = require('../utilities/function');

module.exports = {
  //--------------------------------------------------------------------------------------------------------
  //--------------------------------------------------------------------------------------------------------
  me: async (req, res) => {
    const user = await db.User.scope("withPublic").findByPk(req.user.id);
    if (user.token == req.user.token) {
      res.send({ status: "success", user: user, token: req.user.token });
    } else {
      let result = setUpCookie(res)
      if (result.error) {
        res.status(500).send({ status: "error", message: result.message || "ไม่สามารถออกจากระบบได้" })
      } else {
        res.send({ status: "error", message: "ออกจากระบบ เนื่องจากมีล็อคอินซ้อน" });
      }
    }
  },
  //--------------------------------------------------------------------------------------------------------
  //--------------------------------------------------------------------------------------------------------
 
login: async (req, res) => {
    const error = validation(req);
    if (error) {
      return res.status(422).json(error);
    }

    try {
      let row = await db.User.scope("withPassword").findOne({ where: { username: req.body.username } });
      if (row) {
        var user = row.toJSON();
        if (row.isActive == 'N') {
          throw new Error("ไอดีนี้โดนระงับการใช้งาน.");
        }
        const passwordIsValid = Bcrypt.compareSync(req.body.password, user.password);
        if (!passwordIsValid) {
          throw new Error("รหัสผ่านไม่ถูกต้อง.");
        }
        row.loginAt = Date();
        row.token = await Bcrypt.hashSync(row.username + row.loginAt, 10);
        await row.save();

        //Assign Token
        let payload = (await db.User.scope("withPublic").findByPk(row.id)).toJSON();
        let result = setUpCookie(res, null, payload)
        if (result.error) {
          throw new Error(result.message)
        }

        const foundItem = await db.Login.findOne({ where: { mode: 'user', user_id: payload.id } });
        if (!foundItem) {
          db.Login.create({ mode: 'user', user_id: payload.id, token: payload.token })
        } else {
          db.Login.update({ token: payload.token }, { where: { mode: 'user', user_id: payload.id } });
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
 
};
