const crypto = require("node:crypto");
const bcrypt = require("bcrypt");

function secretCreator(){

    const secret = crypto.randomBytes(64).toString('hex');
    const hashedSecret = bcrypt.hashSync(secret, 10);

    return hashedSecret;
}

module.exports=secretCreator;