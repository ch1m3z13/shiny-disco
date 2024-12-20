const sequelize = require('../config/database');
const Ride = require('../models/Ride');
const { Op } = require('sequelize');
const { Sequelize } = require('sequelize');
const RideRequest = require('../models/RideRequest');
const sendNotificationToDriver = require('../services/notifications');


const createRide = async (req, res) => {
    const { driver_id, origin, destination, departure_time, seats_available } = req.body;

    if (!driver_id || !origin || !destination || !departure_time || seats_available == null) {
        return res.status(400).json({ message: 'All fields are required' });
    }

   
    if (!origin.latitude || !origin.longitude || !destination.latitude || !destination.longitude) {
        return res.status(400).json({ message: 'Invalid origin or destination coordinates' });
    }

    try {
        
        const originPoint = { type: 'Point', coordinates: [origin.longitude, origin.latitude] };
        const destinationPoint = { type: 'Point', coordinates: [destination.longitude, destination.latitude] };

        
        const routeLineString = {
            type: 'LineString',
            coordinates: [
                [origin.longitude, origin.latitude],
                [destination.longitude, destination.latitude]
            ]
        };

        
        const newRide = await Ride.create({
            driver_id,
            origin: originPoint,
            destination: destinationPoint,
            route: routeLineString,
            departure_time,
            seats_available,
            ride_status: 'open',
        });

        res.status(201).json({
            message: 'Ride created successfully',
            ride: newRide
        });
    } catch (error) {
        console.error('Error creating ride:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

const searchRides = async (req, res) => {
    const { origin, destination } = req.body;

    
    if (!origin || !origin.latitude || !origin.longitude || !destination || !destination.latitude || !destination.longitude) {
        return res.status(400).json({ message: 'Invalid origin or destination coordinates' });
    }

    try {
       
        const passengerOriginPoint = Sequelize.fn('ST_GeomFromText', `POINT(${origin.longitude} ${origin.latitude})`, 4326);
        const passengerDestinationPoint = Sequelize.fn('ST_GeomFromText', `POINT(${destination.longitude} ${destination.latitude})`, 4326);

        
        const proximityTolerance = 0.01;

       
        const matchingRides = await Ride.findAll({
            where: Sequelize.and(
                Sequelize.where(
                    Sequelize.fn('ST_DWithin', Sequelize.col('route'), passengerOriginPoint, proximityTolerance),
                    true
                ),
                Sequelize.where(
                    Sequelize.fn('ST_DWithin', Sequelize.col('route'), passengerDestinationPoint, proximityTolerance),
                    true
                ),
                { ride_status: 'open' }
            )
        });

        res.json(matchingRides);
    } catch (error) {
        console.error('Error finding matching rides:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

const matchRides = async (req, res) => {
    const { origin, destination } = req.body;

    if (!origin || !destination) {
        return res.status(400).json({ message: 'Both origin and destination are required to match rides.' });
    }

    try {
        
        const passengerRoute = `LINESTRING(${origin.longitude} ${origin.latitude}, ${destination.longitude} ${destination.latitude})`;

        const matchedRides = await db.query(
            `SELECT * FROM rides
             WHERE ST_Intersects(route, ST_GeomFromText($1, 4326))
               AND seats_available > 0
               AND ride_status = 'open'`,
            [passengerRoute]
        );

        res.json(matchedRides.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};


const requestRide = async (req, res) => {
    // Extract ride_id from the URL parameters
    const { id } = req.params;
    const passengerId = req.user.id; // Extract user ID from the authenticated request

    // Debug: Log the received parameters
    console.log('Received ride_id from params:', id);
    console.log('Passenger ID from token:', passengerId);

    if (!id) {
        return res.status(400).json({ message: 'Ride ID is required' });
    }

    try {
        // Find the ride with available seats
        const ride = await Ride.findOne({
            where: {
                ride_id: id,
                seats_available: { [Sequelize.Op.gt]: 0 } // Checks for available seats
            }
        });

        if (!ride) {
            return res.status(404).json({ message: 'Ride not found or no seats available' });
        }

        // Create the ride request
        const newRequest = await RideRequest.create({
            ride_id: id,
            passenger_id: passengerId
        });

        // Notify the driver
       // const driverId = ride.driver_id;
       // await sendNotificationToDriver(
       //     driverId,
       //     `New ride request from passenger ID: ${passengerId} for ride ID: ${id}`
       // );

        // Respond with success
        res.status(201).json({
            message: 'Ride request sent successfully',
            request: newRequest
        });
    } catch (error) {
        console.error('Error sending ride request:', error);
        res.status(500).json({ message: 'Server error' });
    }
};


const cancelRide = async (req, res) => {
    const { id } = req.params;
    const { cancellation_reason } = req.body;
    const driver_id = req.user.id;

    try {
        // Check if the ride exists and is created by the authenticated driver
        const ride = await db.query('SELECT * FROM rides WHERE id = $1', [id]);
        if (ride.rows.length === 0) return res.status(404).json({ message: 'Ride not found' });
        
        if (ride.rows[0].driver_id !== driver_id) return res.status(403).json({ message: 'Unauthorized action' });

        const canceledRide = await db.query(
            'UPDATE rides SET status = $1, cancellation_reason = $2 WHERE id = $3 RETURNING *',
            ['canceled', cancellation_reason, id]
        );

        res.json(canceledRide.rows[0]);
    } catch (err) {
        console.error('Error canceling ride:', err);
        res.status(500).json({ message: 'Server error' });
    }
};

const rateRide = async (req, res) => {
    const { ride_id } = req.params;
    const { rating, review } = req.body;
    const user_id = req.user.id;

    if (rating < 1 || rating > 5) {
        return res.status(400).json({ message: 'Rating should be between 1 and 5' });
    }

    try {
        const newRating = await db.query(
            'INSERT INTO ratings (ride_id, user_id, rating, review) VALUES ($1, $2, $3, $4) RETURNING *',
            [ride_id, user_id, rating, review]
        );

        res.status(201).json(newRating.rows[0]);
    } catch (err) {
        console.error('Error submitting rating:', err);
        res.status(500).json({ message: 'Server error' });
    }
};

const getRideRatings = async (req, res) => {
    const { ride_id } = req.params;

    try {
        const ratings = await db.query('SELECT * FROM ratings WHERE ride_id = $1', [ride_id]);
        res.json(ratings.rows);
    } catch (err) {
        console.error('Error retrieving ratings:', err);
        res.status(500).json({ message: 'Server error' });
    }
}

module.exports = { 
    createRide, 
    searchRides, 
    matchRides, 
    requestRide ,
    cancelRide,
    rateRide,
    getRideRatings,
};