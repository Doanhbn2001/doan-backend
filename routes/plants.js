const express = require('express');

const plantsControlleds = require('../controlleds/plants');

const router = express.Router();

router.get('/get-all-plants', plantsControlleds.getAllPlants);

router.post('/upload-image', plantsControlleds.uploadImage);

router.post('/get-detail', plantsControlleds.getDetail);

router.post('/get-all-types', plantsControlleds.getTypes); //

router.post('/add-to-type', plantsControlleds.addToType);

router.post('/get-type', plantsControlleds.getType);

module.exports = router;
