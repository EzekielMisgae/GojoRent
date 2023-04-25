const express = require("express");
const router = express.Router();

const { register, login, update, deleteUser, getUsers } = require("./auth");
const { adminAuth } = require("../middleware/auth");
const Controller = require('../controllers/Controller');

router.get('/', Controller.index);
router.get('/create', Controller.house_upload_get);
router.post('/create', Controller.house_upload_post);
router.get('/:id', Controller.house_details);
router.delete('/:id', Controller.house_delete_post);
router.get('/:id', Controller.house_delete_get);
// Login and signup
router.route("/register").post(register);
router.route("/login").post(login);
router.route("/update").put(adminAuth, update);
router.route("/deleteUser").delete(adminAuth, deleteUser);
router.route("/getUsers").get(getUsers);

module.exports = router;
