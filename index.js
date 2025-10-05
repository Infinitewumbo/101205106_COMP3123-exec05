const express = require('express');
const path = require('path');
const app = express();
const userRouter = require('./routes/users');

// Middleware to parse incoming JSON bodies (required for the /login POST route)
app.use(express.json());

// Route for serving the home.html file (Task 1)
app.get('/home', (req, res, next) => {
    res.sendFile(path.join(__dirname, 'home.html'), (err) => {
        if (err) {
            next(err); 
        }
    });
});

// Mount the user router for /profile, /login, /logout (Task 2, 3, 4)
app.use('/api/v1/user', userRouter); 

// Global Error Handling Middleware (Task 5)
// Must be the last app.use() before app.listen
app.use((err, req, res, next) => {
    console.error(err.stack); 

    if (res.headersSent) {
        return next(err);
    }
    
    // Set status to 500 if not already set by error object
    res.status(err.status || 500); 

    // Send the required "Server Error" message
    res.send('Server Error');
});

// Dynamic Port Binding (Task 7)
const PORT = process.env.port || 8081;

app.listen(PORT, () => {
    console.log('Web Server is listening at port ' + PORT);
});
