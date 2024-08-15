const economySchema = require('../models/economySchema')

exports.getData = async ( userId ) => {

    let data = await economySchema.findOne({ userId : userId})

    if (data === null ){
        let new_data = await economySchema.create({
            userId : userId
        })
        new_data.save();
        let data = await economySchema.findOne({ userId : userId})
        return data;
    } else {
        return data;
    }
}

exports.getLeaderboard = async () => {
    let data = await economySchema.find({})
    return data;    
}

exports.addCoins = async ( userId , coins) => {
    await economySchema.updateOne(
        { userId : userId },
        { $inc :  {coins : coins}})
}

exports.removeCoins = async ( userId , coins) => {
    await economySchema.updateOne(
        { userId : userId },
        { $inc :  {coins : -coins}}
        )
}

exports.addbank = async ( userId , amount) => {
    await economySchema.updateOne(
        { userId : userId },
        { $inc :  {bank : amount}}
        )
}

exports.removebank = async ( userId , amount) => {
    await economySchema.updateOne(
        { userId : userId },
        { $inc :  {bank : -amount}}
        )
}

exports.newDaily = async ( userId ) => {
    await economySchema.updateOne(
        { userId : userId},
        { $set :  {lastDaily : Date.now() }
    })
}

exports.newWork = async (userId ) => {
    await economySchema.updateOne(
        { userId : userId },
        { $set : { lastWorked : Date.now() }}
        )
}