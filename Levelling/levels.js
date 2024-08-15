const db  = require('../util/levelling')
const guild =  require('../util/guild_data')


client.on('messageCreate' ,async  message => {

    if (message.author.bot || message.channel.type ===  "1") return;
    const Xp = Math.floor(Math.random() * 10 + 15);
    const result = await db.addXP(message.author.id , message.guild.id , Xp)

    //Checking if needed XP has been reached
    let { xp , level } = result
    const neededXp = await db.neededXP(level)
    if (xp >= neededXp){
        ++level
        xp -= neededXp
        db.levelUp(message.author.id , message.guild.id , xp , level)


        //Level-Up Message to provided/default channel
        const data = await guild.getData(message.guild.id)
        if(data.levelup_channel){
            message.guild.channels.fetch(data.levelup_channel).then(channel => channel.send(data.levelUp_message.replace( '{user}' , `<@${message.author.id}>`).replace( '{level}' , level)))
        } else {
            message.channel.send(data.levelUp_message.replace( '{user}' , `<@${message.author.id}>`).replace( '{level}' , level))
        }
    }
})

