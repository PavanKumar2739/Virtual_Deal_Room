const mongose = require('mongoose');

const connection = ()=>{
    const uri = process.env.DB_URI;
    
    mongose.connect(uri)
    .then(()=> console.log("connected"))
    .catch((err)=> console.log(err));

}

module.exports = {connection}