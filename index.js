const Discord = require('discord.js');
const fs = require('fs');
const client = new Discord.Client();
let config = require('./config.json')
let prefix = config.prefix;
let users = {};

client.on(`ready`, () => {
    console.log("I'm working!");
    client.user.setActivity("за стадом", {type: "WATCHING"});
});

client.on('message', async message => {
    if(message.author.bot) return;
    if(message.channel.type == "dm") return;
    if(!message.content.startsWith(prefix)) return;
    let messageArray = message.content.split(" ");
    let cmd = messageArray[0];
    let args = messageArray.slice(1);
    if(cmd == `${prefix}ping`){
        message.delete();
        message.reply(`\`pong! ${client.ping}ms\``)
    }
    if(cmd == `${prefix}run`){
        message.delete();
        if(message.author.id == "347827337137750016"){
            try {
                const code = args.join(" ");
                let evaled = eval(code);
                if (typeof evaled !== "string")
                    evaled = require("util").inspect(evaled);
            } catch (err) {
                message.channel.send(`\`ERROR\` \`\`\`xl\n${clean(err)}\n\`\`\``);
            }
        }else{
            message.delete()
            message.channel.createWebhook("Access Denied!", "https://i.imgur.com/389kj7O.jpg")
            .then(async webhook =>{
                webhook.send(`${message.author}, \`эта команда доступна только создателю бота!\``)
                .then(async msg => {
                    msg.delete(5000)
                })
                webhook.delete()
            })
        }
    }
});

client.on('guildMemberUpdate', async member => {
    if(users[member.id]) return;
    setTimeout(() => {
        let id = member.id;
        if(member.guild.members.get(id).roles.size > 2){
            users[member.id] = true;
            console.log(member.guild.members.get(id).roles.first().id);
            member.guild.members.get(id).setRoles([`${member.guild.members.get(id).roles.last().id}`]);
            users[member.id] = false;
        }
    }, 1000);
});

function clean(text) {
    if (typeof(text) === "string")
        return text.replace(/`/g, "`" + String.fromCharCode(8203)).replace(/@/g, "@" + String.fromCharCode(8203));
    else
        return text;
}

client.login(config.token)