const axios = require('axios');

const Discord = require('discord.js');

const client = new Discord.Client();

const token = 'ODU0NTQ5ODkzMjIxODQyOTU0.YMljmw.gtAodNodVLBPUNgIUyrk6brPeiM';

let createdChannelbyreact;

async function verifyCode(code){

    const response = await axios.get(
        "https://skyclub-server.herokuapp.com/codes/" + code
    )

    if(response.data){

        return true;

    }else{

        return false;

    }
}

client.login(token)

client.on('ready', async () => {
    console.log('Ready for use')    
})

client.on('raw', async dados => {
    if(dados.t !== "MESSAGE_REACTION_ADD" && dados.t !== "MESSAGE_REACTION_REMOVE") return
    if(dados.d.message_id != "855952428075843606") return //id da mensagem fixa do bot

    let servidor = client.guilds.cache.get("855936692023197696") //id do servidor
    let membro = servidor.members.cache.get(dados.d.user_id)
    let roleID = "855952510828281856"; //id do cargo de prématricula
    let role = servidor.roles.cache.get(roleID);

    if(dados.t === "MESSAGE_REACTION_ADD"){
        console.log(dados.d.emoji)
        if(dados.d.emoji.name === '✅'){

            const createdChannel = await servidor.channels.create('oi', {
                type: 'text',
                permissionOverwrites: [
                    {
                      id: servidor.id,
                      deny: 'VIEW_CHANNEL'
                    },
                    {
                      id: dados.d.user_id,
                      allow: 'VIEW_CHANNEL'
                    }
                ],
              })

            createdChannel.send('Mensagem dizendo para inserir o código de pré matricula')
            createdChannelbyreact = createdChannel;
            //console.log(createdChannel)
        }


    }

})

client.on('message',async(msg) => {

    const message_text = msg.content
    const channel = await createdChannelbyreact.id

    if(msg.channel.id === channel){
        if(message_text){

            await verifyCode(message_text)
            console.log(await verifyCode())
            console.log(message_text)
            if(verifyCode(message_text) === true){

                msg.channel.send('hi')


            }
        }
    }
})
