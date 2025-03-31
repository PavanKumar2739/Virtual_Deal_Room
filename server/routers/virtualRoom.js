const express = require('express');
const rounter = express();

rounter.post('/vdRoom',(req,res)=>{
    console.log("virtual room");
    res.status(200).send({success:'successs'})
});

module.exports = rounter;