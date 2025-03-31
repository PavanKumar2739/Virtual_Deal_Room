const pool = require('./connectionPool');

const executeQuery=async(query,args=[])=>{
    let result=null;
    try{
        //  await pool.query(query,args,(error,result,field)=>{
        //     if(error) console.log(error);
        //     console.log(result);
        //     return result;
        // });

        // return result;
       
        
        return true;

    }catch(e){
        console.log(e)
    }
}

module.exports = {executeQuery}