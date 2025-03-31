const mongose = require('mongoose');

const connection = ()=>{
    const uri = "mongodb+srv://Pavankumar2739:Pk2576525@cluster0.t4yw5xr.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
    mongose.connect(uri)
    .then(()=> console.log("connected"))
    .catch((err)=> console.log(err));

}

module.exports = {connection}