require('dotenv').config();
const express = require('express');
const sequelize = require('./config/database'); 
const bodyParser = require('body-parser');
const cors = require('cors');
const db = require('./db');
const authRoutes = require('./routes/auth'); 
const userRoutes = require('./routes/users'); 
const rideRoutes = require('./routes/rides'); 
const path = require('path');

const app = express(); 

app.use(cors());
app.use(bodyParser.json());
app.use('/api/auth', authRoutes); 
app.use('/api/users', userRoutes); 
app.use('/api/rides', rideRoutes); 
app.use('/api/uploads', express.static(path.join(__dirname, 'uploads')));

app.get('/', (req, res) => {
    res.send('Welcome to the Rideshare API!');
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something went wrong!');
});

//const PORT = process.env.PORT || 4000; // Port configuration
//app.listen(PORT, () => {
//    console.log(`Server running on port ${PORT}`);
//});

sequelize.sync({ force: false }).then(() => { 
    const PORT = process.env.PORT || 3000;
    console.log('Database synchronized');
    app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
}).catch((error) => {
    console.error('Unable to connect to the database:', error);
});


process.on('SIGINT', async () => {
    console.log('Shutting down gracefully...');
    await db.end(); 
    process.exit(0);
});

module.exports = app;