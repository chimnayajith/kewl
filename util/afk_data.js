const afkSettings = require("../models/afkSettings");

exports.hasAfk = async ( userId) => {
    const data = await afkSettings.findOne({
        userId : userId
    })
    if(data) {
        return data.afk
    } else {
        return false
    }
}

exports.getAfk = async ( userId) => {
    const data = await afkSettings.findOne({
        userId : userId
    })
    return data;
}
exports.setAfk = async ( userId , message ) => {
    const data = await afkSettings.findOneAndUpdate(
        {
            userId : userId
        },
        {
            userId : userId,
            $set : {
                afk : true,
                message : !message ?  'AFK' : message,
                timestamp : Date.now()
            }
        },
        {
            upsert:true,
            new:true
        }

    )
    return data;
}

exports.removeAfk =  async (  userId ) => {
    await afkSettings.findOneAndUpdate(
        {

            userId : userId
        },
        {
            $set : {
                afk : false,
                message : '',
                timestamp : Date.now() 
            }
        },
        {
            upsert:true
        }
    )
}

