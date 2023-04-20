const express = require('express');
const Controller = require('../controllers/Controller');

const router = express.Router();

router.get('/', Controller.index);
router.get('/create', Controller.house_upload_get);
router.post('/create', Controller.house_upload_post);
router.get('/:id', Controller.house_details);
router.delete('/:id', Controller.house_delete_post);
router.get('/:id', Controller.house_delete_get);


module.exports = router;