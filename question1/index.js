const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

const numberRoutes = require('./src/routes/numberRoutes');

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
 

app.use('/numbers', numberRoutes);
 

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    status: 'error',
    message: 'Something went wrong!'
  });
});




// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
}); 