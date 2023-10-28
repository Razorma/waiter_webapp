import jwt from "jsonwebtoken"

export default function jwtTokens(user){
    const id = user.user_id
    
    
    const maxAge = 60*60
    const accessToken = jwt.sign({id },process.env.ACCESS_TOKEN_SECRETE,{expiresIn:maxAge})
    
    return{
        accessToken
    }

}