const express = require('express');

const router = express.Router();

const authController = require('../controlleds/auth');

router.post('/signin', authController.signIn);

router.post('/add-type', authController.addType);

router.post('/delete-type', authController.deleteType);

router.post('/add-plant', authController.addPlant);

router.post('/delete-plant', authController.deletePlant);

router.post('/edit-plant', authController.editPlant);

module.exports = router;
