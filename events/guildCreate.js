const guildConfig = require('../models/guildSettings');

module.exports = async (client,guild)=> {

    let data = await guildConfig.findOne({guildId:guild.id})
    if(!data){
        let newdata =await guildConfig.create({
            guildId : guild.id,
            prefix : '.',
            modLogEnable:false
        })
        newdata.save()
    }

console.log(`Bot added to ${guild.name}`)
};
