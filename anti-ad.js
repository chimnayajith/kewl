const { resolve } = require("path/posix")

module.exports = (client) =>{
    const isInvite = ( guild , code ) => {
        guild.invites.fetch().then(( invites ) => {
         for (const invite of invites){
             console.log('INVITE :',invite[0])
             if (code === invite[0]) {
                 resolve(true)
                 return
             }
         }
         resolve(false)
})
    }

    client.on('messageCreate' ,async  (message) => {
        const {guild , member , content} = message


        const code = content.split('discord.gg/')[1]
        console.log(code)
        if (content.includes('discord.gg/')){
           const isOurInvite = await isInvite(guild, code)
           console.log(isOurInvite)

        }
    })
}