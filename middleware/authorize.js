import jwt from "jsonwebtoken"

export default function authenticateToken(req,res,next){
    const authHeaders =  req.cookies['user-token'];
    
    

    const token = authHeaders 

    if(token===null){
        res.redirect("/login")
    }
    jwt.verify(token,process.env.ACCESS_TOKEN_SECRETE ,(error,user)=>{
        if(error){
            res.redirect("/login")
        }else{
            req.user=user
            next()
        }
    })

}