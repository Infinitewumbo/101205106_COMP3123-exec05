const fs = require('fs');
const path = require('path');
const express = require('express');
const routerUser = express.Router();

const USER_FILE_PATH = path.join(__dirname, '..', 'user.json');

function readUserFile() {
    try {
        const rawData = fs.readFileSync(USER_FILE_PATH, 'utf-8');
        return JSON.parse(rawData);
    } catch (error) {
        console.error("Error reading user.json:", error.message);
        const fileError = new Error("Server failed to load user data.");
        fileError.status = 500;
        throw fileError; 
    }
}

routerUser.get('/profile', (req, res, next) => {
    try {
        const user = readUserFile();
        res.json(user);
    } catch (error) {
        next(error); 
    }
});

routerUser.post('/login', (req, res, next) => {
    const { username, password } = req.body || {};

    if (!username || !password) {
         return res.status(400).json({ status: false, message: "Missing username or password" });
    }

    try {
        const user = readUserFile(); 
        
        if (user.username !== username) {
            return res.status(401).json({ 
                "status": false, 
                "message": "User Name is invalid"
            });
        }

        if (user.password !== password) {
            return res.status(401).json({ 
                "status": false, 
                "message": "Password is invalid"
            });
        }

        return res.status(200).json({ 
            "status": true, 
            "message": "User Is valid"
        });

    } catch (error) {
        next(error); 
    }
});

routerUser.get('/logout/:username', (req, res) => {
    const { username } = req.params;
    res.send(`<b>${username} successfully logged out.</b>`);
});

module.exports = routerUser;
