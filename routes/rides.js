// routes/rides.js
const express = require('express');
const router = express.Router();
const authenticate = require('../middlewares/authenticate');
const { createRide, searchRides, matchRides, requestRide, cancelRide, rateRide, getRideRatings } = require('../controllers/rideController');

// Create a new ride
router.post('/create', authenticate, createRide);

//Search rides
router.post('/search', authenticate, searchRides);

// Match passengers with rides
router.post('/match', authenticate, matchRides);

// Join a ride
router.post('/request/:id', authenticate, requestRide);

// Cancel a ride
router.delete('/:ride_id', authenticate, cancelRide);

// Submit a rating
router.post('/rate/:ride_id', authenticate, rateRide);

// Get ratings for a ride
router.get('/rate/:ride_id', authenticate, getRideRatings);

module.exports = router;
