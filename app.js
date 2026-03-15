const express = require('express');
const app = express();

const tasks = require('./routes/tasks');
const notFound = require('./middlewares/not-found');
const connectDB = require('./db/connection');
const errorhandler = require('./middlewares/error-handler');
// Security packages
const helmet = require('helmet');
const cors = require('cors');
const xss = require('xss-clean');
const rateLimit = require('express-rate-limit');

require('dotenv').config();

// === SECURITY MIDDLEWARE STACK ===
app.set('trust proxy', 1);

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP, please try again after 15 minutes'
});

// Apply rate limiter to all requests
app.use(limiter);

// Set Secure Headers & Custom CSP for 3D Spline Assets and external CDNs
app.use(
    helmet.contentSecurityPolicy({
        directives: {
            defaultSrc: ["'self'"],
            connectSrc: ["'self'", "https://my.spline.design", "https://prod.spline.design", "https://cdnjs.cloudflare.com"],
            frameSrc: ["'self'", "https://my.spline.design"],
            scriptSrc: ["'self'", "https://unpkg.com", "https://cdnjs.cloudflare.com", "'unsafe-inline'"],
            styleSrc: ["'self'", "https://cdnjs.cloudflare.com", "https://fonts.googleapis.com", "'unsafe-inline'"],
            fontSrc: ["'self'", "https://fonts.gstatic.com", "https://cdnjs.cloudflare.com"],
            imgSrc: ["'self'", "data:", "blob:", "https://prod.spline.design"]
        },
    })
);

app.disable('x-powered-by');

app.use(cors());
app.use(xss());

// Parse JSON 
app.use(express.json({ limit: '50kb' }));

app.use(express.static('./public'));
app.use('/api/v1/tasks', tasks);
app.use(notFound);
app.use(errorhandler);


const port = process.env.PORT || 3000;

const start = async () => {
    try {
        await connectDB(process.env.MONGO_URI);
        app.listen(port, () => {
            console.log(`Server is listening on the port ${port}...`);
        });


    } catch (err) {
        console.log(err);
    }


};

start();


