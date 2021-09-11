const bcrypt=require('bcryptjs')
const jwt=require('jsonwebtoken')


const fetchuser=(req,res,next)=>{
    const token=req.header('auth-token')
    try {
        
        if(!token)
        {
            res.status(401).send({error:"please authenticate using a valid token"})
        }
        const JWT_SECRET='amalisagood$boy'
        const data=jwt.verify(token,JWT_SECRET)
        req.user=data.user
        
        next()
    
    } catch (error) {
        res.status(401).send({error:"please authenticate using a valid token"})


}
}

module.exports=fetchuser