const express = require('express');
const app = express();
const routes = require('./routes/api');
const authRoutes = require('./routes/auth-routes');
const dotenv = require('dotenv');
dotenv.config();
const db = require("./models");

const cors = require('cors');



//Middlewares
app.use(express.json());
app.use(cors());
app.use('/api', routes);
app.use('/auth', authRoutes);
db.sequelize.sync()
    .then(() => {
        console.log("Synced db.");
    })
    .catch((err) => {
        console.log("Failed to sync db: " + err.message);
    });
app.use((err, req, res, next) => {
    res.status(422).send({ error: err.message });
})
app.listen(process.env.PORT || 5000, () => {
    console.log("now listening to requests");
    console.log(`${process.env.PORT || 5000}`);
});

