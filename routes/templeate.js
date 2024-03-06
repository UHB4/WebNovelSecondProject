const express = require('express');
const app = express();
const port = 3000;
const session = require('express-session')
const bodyParser = require('body-parser');
const oracledb = require("oracledb");
const router = express.Router();
const dbConfig = {
    user: 'UHB',
    password: '1111',
    connectString: 'localhost:1521/xe'
};





module.exports = router;