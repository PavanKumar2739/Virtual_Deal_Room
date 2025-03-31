const jwt = require('jsonwebtoken');
const {jwtDecode} = require('jwt-decode');

const validateToken=(req,res,next)=>{
   if(["/login","/register"].includes(req.path)){
     return next();
   }
   const authHeater = req.headers.authorization;
   const userName = req.headers.user;
   if(authHeater!='null'){
     const token = authHeater.split(' ')[1];
     if(!token) return res.sendStatus(403);
     const decodeToken = jwtDecode(token);
     console.log(new Date(decodeToken.exp * 1000)); 
     if(decodeToken.exp < Date.now()/1000){
        return res.sendStatus(403);
     }

     jwt.verify(token, process.env.JWT_SECRET, (err, user)=>{
        if(err){
            return res.sendStatus(403);
        }
        //req.user = user.user;
        return next();
     });
   }
   else{
   return res.sendStatus(403);
   }
}

module.exports ={validateToken};