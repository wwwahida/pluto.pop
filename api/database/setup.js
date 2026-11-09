require('dotenv').config()
const fs = require('fs') 
const db = require('./connect')

const sql = fs.readFileSync('./api/database/gameData.sql').toString()

db.query(sql)
    .then(data => {
        db.end()
        console.log('Database Setup Complete')
    })
    .catch((error) => console.log(error));