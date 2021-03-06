const path = require('path')
const express = require('express')
const dotenv = require('dotenv')
const colors = require('colors')
const morgan = require('morgan')
const jwt = require('jsonwebtoken')
const connectDB = require('./config/db')
const { verifyToken } = require('./utils/index')

// dotenv.config({ path: './config/config.env' })

connectDB()

const transactions = require('./routes/transactions')
const auth = require('./routes/auth')
const app = express()

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader(
        'Access-Control-Allow-Methods',
        'OPTIONS, GET, POST, PUT, PATCH, DELETE'
    );
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Access-Token');
    next();
});

if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'))
}
console.log(process.env)

app
    .use(express.json())
    .use('/api/v1/auth', auth)
    .use('/api/v1/transactions', /* verifyToken ,*/ transactions)

if (process.env.NODE_ENV === 'production') {
    app
        .use(express.static(path.resolve(__dirname, '..', 'client', 'build')))
        .get('*', (req, res) => res
            .sendFile(path
                .resolve(__dirname, '..', 'client', 'build', 'index.html')))

}


const PORT = process.env.PORT || 5000
app.listen(PORT,
    () => console.log(`Example app listening on port ${PORT}!`.yellow.bold)
)