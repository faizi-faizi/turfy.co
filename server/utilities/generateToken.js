const jwt = require("jsonwebtoken");


const createToken = (id,role='user')=>{
    try {
        const token =jwt.sign({ id : id, role : role }, process.env.JWT_SECRET_KEY);
            console.log(token,"===token");
            return token;
          
    } catch (error) {
        
    }
}

module.exports = createToken
