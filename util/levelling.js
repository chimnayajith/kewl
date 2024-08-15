const { getPriority } = require("os");
const xpSchema = require("../models/xpSchema")

exports.addXP = async (userId , guildId , xp) => {
    const result = xpSchema.findOneAndUpdate(
        {
            guildId : guildId,
            userId : userId
        },
        {
            guildId : guildId,
            userId : userId,
            $inc : {
                xp : xp,
                totalXp : xp
            }
        },
        {
            upsert:true,
            new:true
        }
    )
    return result;
}

exports.levelUp = async(userId , guildId , xp , level) =>{
    const result = xpSchema.findOneAndUpdate(
        {
            guildId : guildId,
            userId : userId
        },
        {
            $set: {xp :xp , level:level}
        }
    )
    return result;
}

exports.neededXP = async (level) => {
    var needed = 0;
    for ( level ;level > 0 ; level--) {     
        needed += level*100
    }
    return needed;
}

exports.getRank = async (guildId , userId) => {
    const list = await xpSchema.find({guildId : guildId})
    const ordered_list = list.sort((a , b) => b.totalXp - a.totalXp)
    const rank = ordered_list.findIndex(user => user.userId === userId) + 1

    const data = await xpSchema.findOne({guildId:guildId , userId : userId})

    return [rank , data];
}

exports.ranklist = async ( guildId ) => {
    const list = await xpSchema.find({guildId : guildId})
    const ordered_list = list.sort((a , b) => b.totalXp - a.totalXp).slice(0,10)

    return ordered_list;
}