const { EmbedBuilder } = require('discord.js');
const util = require('util');

module.exports = {
  name: 'eval',
  aliases: ['e'],

     async execute(client, message, args) {

        if(message.author.id !== `891581154765979668` && message.author.id !== `746568635115634759`) return;

        let code = args.join(' ');
        const embed = new EmbedBuilder().setColor("#2f3136"); 


        if (!code) {
            return message.reply('invalid');
        }

        try {
            let evaled = await eval(code)

            if (evaled.constructor.name === `Promise`) {
                output = `📤 Output (Promise)`;
            } else {
                output = `📤 Output`;
            }
            if (evaled.length > 800) {
                evaled = evaled.substring(0, 800) + `...`;
            }
                embed.addFields(
                    {
                        name : `📥 Input`, 
                        value :`\`\`\`\n${code}\n\`\`\``
                    },
                    {
                        name :output, 
                        value : `\`\`\`js\n${evaled}\n\`\`\``
                    },
                    {
                        name : `Status`, 
                        value :`Success`
                    }
                    )
                
                return message.channel.send({embeds:[embed]});
        } catch (e) {
            console.log(e.stack);
                embed.addFields(
                    {
                        name : `📥 Input`, 
                        value :`\`\`\`\n${code}\n\`\`\``
                    },
                    {
                        name :`📤 Output`,
                        value :`\`\`\`js\n${e}\n\`\`\``
                    },
                    {
                        name :`Status`,
                        value :`Failed`
                    });
            return message.channel.send({embeds : [embed]});
        }
    }
};
