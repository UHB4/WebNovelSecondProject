const express = require('express');
const oracledb = require('oracledb');
const dbConfig = require('../dbConfig');
const bodyParser = require("body-parser");



const router = express.Router();


router.get('/',(req,res)=>{

    res.render('notice',{
        nickname: null
    })
});

module.exports = router;