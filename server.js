const express = require('express');
const app = express();
const connectDB = require('./config/db-connection');

connectDB();

app.get("/", (req, res) => res.send("Test API"));

// Init Middleware
app.use(express.json({ extended: false }));

// ---------------------------------------------------------------- Routes ----------------------------------------------------------------
app.use('/api/user', require('./routes/api/user'));
app.use('/api/auth', require('./routes/api/auth'));
app.use('/api/business', require('./routes/api/business'));
app.use('/api/party', require('./routes/api/party'));
app.use('/api/order', require('./routes/api/order'));
app.use('/api/order/bill', require('./routes/api/bill'));


const PORT = process.env.PORT || 8080;

app.listen(PORT, () => console.log(`App Started on PORT: ${PORT}`));