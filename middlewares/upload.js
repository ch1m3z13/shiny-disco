const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Set up storage configuration
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        let folder = '';
        switch (file.fieldname) {
            case 'profile_picture':
                folder = 'uploads/profile-pictures/';
                break;
            case 'drivers_license':
                folder = 'uploads/drivers-licenses/';
                break;
            case 'road_worthiness_cert':
                folder = 'uploads/road-worthiness-certs/';
                break;
            default:
                folder = 'uploads/others/';
        }
        fs.mkdirSync(folder, { recursive: true });
        
        cb(null, folder);
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname); 
    }
});

// Configure file filtering to accept only image files
const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        cb(new Error('Only image files are allowed!'), false);
    }
};

// Limit file size to 5MB
const upload = multer({ 
    storage,
    limits: { fileSize: 5 * 1024 * 1024 }, 
    fileFilter 
});

module.exports = upload;
