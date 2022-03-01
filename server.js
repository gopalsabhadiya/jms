const express = require('express');
const app = express();
const connectDB = require('./config/db-connection');
const cors = require('cors');
const cookieParser = require("cookie-parser");

connectDB();

app.use(cookieParser());
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "http://localhost:1234"); // update to match the domain you will make the request from
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Credentials","true");
    res.header("Access-Control-Allow-Methods", "POST, GET, PUT, OPTIONS, PATCH, DELETE");
    next();
});

app.get("/", (req, res) => res.send("Test API 123"));

// Init Middleware
app.use(express.json({ extended: false }));

// ---------------------------------------------------------------- Routes ----------------------------------------------------------------
app.use('/api/user', require('./routes/api/user'));
app.use('/api/auth', require('./routes/api/auth'));
app.use('/api/business', require('./routes/api/business'));
app.use('/api/party', require('./routes/api/party'));
app.use('/api/order', require('./routes/api/order'));
app.use('/api/bill', require('./routes/api/bill'));
app.use('/api/item', require('./routes/api/item'));
app.use('/api/receipt', require('./routes/api/receipt'));
app.use('/api/image', require('./routes/api/image'));
app.use('/api/daily_gold_rate', require('./routes/api/daily_gold_rate'));

app.use('/api/cleanup', require('./routes/api/cleanup'));
app.use('/api/resetpassword', require('./routes/api/resetPassword'));

app.use('/api/dboperation', require('./routes/api/dboperation'));

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => console.log(`App Started on PORT: ${PORT}`));