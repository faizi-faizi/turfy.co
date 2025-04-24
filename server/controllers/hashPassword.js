const bcrypt = require('bcrypt');

const hashPassword = async ()=> {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(process.env.PASSKEY, salt);
    
}
hashPassword();

module.exports = hashPassword