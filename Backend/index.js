const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const cors = require('cors');

const connection = require('./config/db');
const userRouter = require('./route/userRoute');
const orderRouter = require('./route/orderRoute');
const productRouter = require('./route/productRoute');
const contactRouter = require('./route/contactRoute');



dotenv.config();

const app = express();

// Middleware
app.use(express.json());
app.use(morgan('dev'));
app.use(cors());

const PORT = process.env.PORT || 5000;

//Routes

app.use('/api/v1/user',userRouter)
app.use('/api/v1/orders',orderRouter)
app.use('/api/v1/products',productRouter)
app.use('/api/v1/contacts',contactRouter)

app.get('/', (req, res) => {
    res.send('Hello World!');
});

// Database Connection & Start Server
connection.query("SELECT 1")
    .then(()=> {
        console.log("Connected to database");
        app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
        });
    })
    .catch((err) => {
        console.error("Error connecting to database: " + err);
    });


