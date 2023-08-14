const express = require('express');

const router = express.Router();

const authController = require('../controlleds/auth');
const is_Admin = require('../middleware/isAdmin');
const isAdmin = require('../middleware/isAdmin');

router.post('/signup', authController.signUp);

router.post('/signin', authController.signIn);

router.get('/logout', authController.logout);

router.post('/user-signin', authController.signInUser);

router.post('/add-type', isAdmin, authController.addType);

router.post('/delete-type', isAdmin, authController.deleteType);

router.post('/add-plant', authController.addPlant);

router.post('/delete-plant', authController.deletePlant);

router.post('/edit-plant', authController.editPlant);

router.post('/get-data', authController.getData);

router.post('/add-note', authController.addNote);

router.post('/delete-note', authController.deleteNote);

module.exports = router;
