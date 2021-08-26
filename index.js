const discord = require("discord.js");
const botConfig = require("./botconfig.json");

const fs = require("fs");

const client = new discord.Client();
client.commands = new discord.Collection();
client.login(botConfig.token);

fs.readdir("./commands/" , (err, files) => {

    if(err) console.log(err);

    var jsFiles = files.filter(f => f.split(".").pop() === "js");

    if(jsFiles.length <=0) {
        console.log("Kon geen files vinden");
        return;
    }

    jsFiles.forEach((f,i) => {

        var fileGet = require(`./commands/${f}`);
        console.log(`De file ${f} is geladen:)`);

        client.commands.set(fileGet.help.name, fileGet);

    })

});

client.on("ready", async () => {
 
    console.log(`${client.user.username} is online.`);
    client.user.setActivity("Add: ! Fedde#0999", {type: "PLAYING"});
 
});

client.on("message", async message =>{

   if(message.author.bot) return;

   if (message.channel.type == "dm") return;

   var prefix = botConfig.prefix;

   var messageArray = message.content.split(" ");

   var command = messageArray[0];


   var commands = client.commands.get(command.slice(prefix.length));

   if(commands) commands.run(client, message, arguments);

   if(command === `${prefix}porno`){
       return message.channel.send("https://nl.pornhub.com/gay/video/search?search=gay+porn");
   }

   if (command === `${prefix}help`) {
       
      var botEmbed = new discord.MessageEmbed()
          .setTitle("Help Dashboard Voor Leden")
          .setDescription("Hier staan alle command van onze server.")
          .setColor("#6357d4")
          .addFields(
           {name: "**!ip**", value: "Dit zal ooit nog wel komen"},
           {name: "**!serverinfo**", value: "Voor alle server informatie."},
           {name: "**!ticket**", value: "Deze optie staat op het moment uit. Binnekort wordt dit custom."},
          )
          .setThumbnail("https://media.discordapp.net/attachments/879008873711824929/879696033658048522/previeww.jpg?width=675&height=675")
          .setFooter("Bot gemaakt door: ! Fedde#0999")
          .setTimestamp();
    
      return message.channel.send(botEmbed);
   }

   if (command === `${prefix}helpmod`) {
       
    var botEmbed = new discord.MessageEmbed()
        .setTitle("Help Dashboard Voor Mods")
        .setDescription("Hier staan alle mod commands.")
        .setColor("#6357d4")
        .addFields(
            {name: "**!ban (member) (reason)**", value: "Hiermee verban je een lid van de server."},
            {name: "**!kick (member) (reason)**", value: "Hiermee kick je een lid van de server."},
            {name: "**!serverinfo**", value: "Voor alle server informatie."},
            {name: "**!clear (aantal messages)**", value: "Om berichten mee te verwijderen."},
        )
        .setThumbnail("https://media.discordapp.net/attachments/879008873711824929/879696033658048522/previeww.jpg?width=675&height=675")
        .setFooter("Bot gemaakt door: ! Fedde#0999")
        .setTimestamp();
  
    return message.channel.send(botEmbed);
 }

   if (command === `${prefix}serverinfo`) {
       
    var botEmbed = new discord.MessageEmbed()
        .setTitle("Server Informatie")
        .setDescription("Alle Informatie Over De Server.")
        .setColor("#6357d4")
        .addFields(
            {name: "Deze bot is gemaakt door:", value: "! Fedde#0999"},
            {name: "Je bent de server gejoined op:", value: message.member.joinedAt },
            {name: "Totaal aantal members:", value:message.guild.memberCount},
            
        
        );
  
    return message.channel.send(botEmbed);
 }


   if (command === `${prefix}kick`) {
   
      var args = message.content.slice(prefix.length).split(/ +/);

      if(!message.member.hasPermission("KICK_MEMBERS")) return message.reply("Sorry jij kan dit niet gebruiken.");

      if(!message.guild.me.hasPermission("KICK_MEMBERS"))return message.reply("Je hebt hier geen rechten voor.");

      if(!args[1]) return message.reply("Geen gebruiker opgegeven.");

      if(!args[2]) return message.reply("Geen redenen opgegeven.");

      var kickUser = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[1]));

      var reason = args.slice(2).join(" ");

      if (!kickUser) return message.reply("Gebruiker niet gevonden.");

      var embedPrompt = new discord.MessageEmbed()
          .setColor("GREEN")
          .setTitle("Gelieve binnen 30 seconden te reageren.")
          .setDescription(`Wil je ${kickUser} kicken?`);

      var embed = new discord.MessageEmbed()
          .setColor("#ff0000")
          .setFooter(message.member.displayName)
          .setTimestamp()
          .setDescription(`**Gekickt:** ${kickUser} (${kickUser.id})
          **Gekickt door:** ${message.author}
          **Redenen: ** ${reason}`);

        message.channel.send(embedPrompt).then(async msg =>{

            var emoji = await promptMessage(msg, message.author, 30, ["✅", "❌"]);

            if(emoji === "✅"){

                msg.delete();

                kickUser.kick(reason).catch(err =>{
                    if(err) return message.reply("Er is iets fout gegaan.")
                });

                message.channel.send(embled);

            }else if(emoji === "❌"){

               msg.delete();

               message.reply("Kick geannuleerd").then(m => m.delete(5000));


            }

        })

   }


   if (command === `${prefix}ban`) {
 
    const args = message.content.slice(prefix.length).split(/ +/);

    if (!args[1]) return message.reply("Geen gebruiker opgegeven.");

    if (!args[2]) return message.reply("Gelieve een redenen op te geven.");

    if (!message.member.hasPermission("BAN_MEMBERS")) return message.reply("sorry jij kan dit niet");

    if (!message.guild.me.hasPermission("BAN_MEMBERS")) return message.reply("Geen perms");

    var banUser = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[1]));

    var reason = args.slice(2).join(" ");

    if (!banUser) return message.reply("Kan de gebruiker niet vinden.");

    var embed = new discord.MessageEmbed()
        .setColor("#ff0000")
        .setThumbnail(banUser.user.displayAvatarURL)
        .setFooter(message.member.displayName, message.author.displayAvatarURL)
        .setTimestamp()
        .setDescription(`** Geband:** ${banUser} (${banUser.id})
        **Geband door:** ${message.author}
        **Redenen: ** ${reason}`);

    var embedPrompt = new discord.MessageEmbed()
        .setColor("GREEN")
        .setAuthor("Gelieve te reageren binnen 30 sec.")
        .setDescription(`Wil je ${banUser} bannen?`);


    message.channel.send(embedPrompt).then(async msg => {

        var emoji = await promptMessage(msg, message.author, 30, ["✅", "❌"]);


          if(emoji === "✅"){

              msg.delete();

              banUser.ban(reason).catch(err =>{
                  if(err) return message.reply("Er is iets fout gegaan.")
              });

              message.channel.send(embled);

          }else if(emoji === "❌"){

             msg.delete();

             message.reply("Ban geannuleerd").then(m => m.delete(5000));


          }

      })

 }


});


async function promptMessage(message, author, time, reactions) {

    time *= 1000;

    for(const reaction of reactions) {
        await message.react(reaction);
    }
    
    var filter = (reaction, user) => reactions.includes(reaction.emoji.name) && user.id === author.id;

    return message.awaitReactions(filter, { max:1, time: time }).then(collected => collected.first() && collected.first().emoji.name);

}

bot.login(process.env.token);