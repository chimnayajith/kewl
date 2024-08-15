const dotenv = require('dotenv');
dotenv.config();
module.exports = {
    app: {
        px: '.',
        token: process.env.BOT_TOKEN,
    },
    bot : {
        modlogid : '928871099800891453',
        welcomechannel : '899195708626849805'
    },
    secrets : {
        "clientId": process.env.CLIENT_ID,
	    "clientSecret": process.env.CLIENT_SECRET,
	    "port": 3000    
    }
};
