const express = require('express');
const router = express.Router();
const eventController = require('../controllers/eventController')

const Role = require('../config/role');
//------------ Welcome Route ------------//


router.get('/events', eventController.showEventsHandle);
router.post('/createEvent', eventController.createEventHandle);


module.exports = router;