const express = require('express');
const cors = require('cors');
const axios = require('axios');

const userRoutes = require('./src/routes/userRoutes');
const postRoutes = require('./src/routes/postRoutes');
 

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/', userRoutes);
app.use('/', postRoutes);

 
// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});

// Start server
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
}); 