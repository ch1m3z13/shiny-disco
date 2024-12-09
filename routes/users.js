const express = require('express');
const { getUserProfile, updateUserProfile, updateProfilePicture, submitDriverDetails, submitHomeAndWorkDetails } = require('../controllers/userController');
const authenticate = require('../middlewares/authenticate'); 
const upload = require('../middlewares/upload');

const router = express.Router();

const driverDetailsUpload = upload.fields([
    { name: 'drivers_license', maxCount: 1 },
    { name: 'road_worthiness_cert', maxCount: 1 },
    { name: 'profile_picture', maxCount: 1 }
]);

router.get('/profile', authenticate, getUserProfile);

router.put('/profile', authenticate, updateUserProfile);

router.put('/submit-driver-details', authenticate, driverDetailsUpload, submitDriverDetails);

router.put('/profile-picture', authenticate, upload.single('profile_picture'), updateProfilePicture);

router.put('/submit-home-work-locations', authenticate, submitHomeAndWorkDetails);

module.exports = router;
