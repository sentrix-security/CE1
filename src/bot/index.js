const { Token, Prefix } = require("../../config.json");
const { randomBytes, randomUUID } = require("crypto"); 
const { writeFileSync, unlinkSync } = require("fs");
const random = require("random");
const path = require("path");
const ce1 = require("../ce1");
const Discord = require("discord.js");
const fetch = require("node-fetch");
const client = new Discord.Client({
    intents: [
        Discord.Intents.FLAGS.GUILDS,
        Discord.Intents.FLAGS.GUILD_MESSAGES,
        Discord.Intents.FLAGS.DIRECT_MESSAGES
    ],
    partials: ["CHANNEL"]
});

function debug(context, ...any) {
    let t = new Date();
    console.log(`[${t.getHours()}:${t.getMinutes()}:${t.getSeconds()}.${t.getMilliseconds()}]${context ? ` [${context}]`: ""}`, ...any);
}

let LogChannel;

client.on("ready", () => {
    debug("BOT", "Application online.");
    client.user.setActivity({
        type: "WATCHING",
        name: "!obfuscate"
    });
    LogChannel = client.channels.cache.get("1010724870168002580");
});

client.on("messageCreate", async (message) => {
    if (message.author.bot || !message.content.startsWith(Prefix)) return;

    const args = message.content.slice(Prefix.length).trim().split(/ +/);
	const command = args.shift().toLowerCase();

    function SendEmbed(description) {
        const Embed = new Discord.MessageEmbed()
            .setTitle("JSec")
            .setDescription(description)
            .setColor("#32ff3a")
            .setFooter("Version 1.0.0")
            .setTimestamp()
        return Embed;
    }

    if (command === "obfuscate" || command === "protect") {
        const Whitelist = await process.collection.findOne({ id: message.author.id });
        if (!Whitelist) {
            return message.channel.send({ embeds: [SendEmbed("**You must have a whitelist** before using this command")] });
        }

        const TimeNow = Date.now();
        const File = message.attachments.first();
        let Script;

        if (File) {
            if (File.contentType !== "text/plain; charset=utf-8") return message.channel.send({ embeds: [SendEmbed("We currently don't support this file format, try changing it to a `txt`")] })
            if (File.size > 500000) return message.channel.send({ embeds: [SendEmbed("Your file exceeds our limit (**500kb**), sorry about this inconvience.")] })
    
            debug("BOT", `${message.author.tag} protected a script (size: ${File.size}kb).`);
            await LogChannel.send(`${message.author.tag} protected a script (size: ${File.size}kb).`);
    
            Script = await fetch(File.url)
            .then(res => res.text())
        }

        if (!Script) return message.channel.send({ embeds: [SendEmbed("You need to attach a lua/text file to your message so we have something to obfuscate")] })

        const RandomPath = path.join(__dirname, `/temp/${randomUUID()}.lua`);
        const Result = await ce1(Script, false, Whitelist.fingerprint)
        .catch(er => {
            let Embed = new Discord.MessageEmbed()
            .setDescription(`There was an error obfuscating this file. \`\`\`${er}\`\`\``);
            message.reply({ embeds: [SendEmbed(`JSec caught an error when obfuscating this file \`\`\`${er}\`\`\``)] });
        });

        if (Result) {
            writeFileSync(RandomPath, Result.Output);
            let Message = await message.reply({  embeds: [SendEmbed(`JSec has protected your file in \`${(Date.now() - TimeNow) / 1000}s\`, we'll delete this message after 1 minute for security purposes.`)], files: [RandomPath] });
            unlinkSync(RandomPath);

            setTimeout(async () => await Message.delete(), 60000)
        }
    }

    if (message.channel.type !== "DM" && message.member.permissions.has("ADMINISTRATOR")) {
        if (command === "ownerof") {
            const Bytestring = args[0];
            if (!Bytestring) return;
    
            let Fingerprint = `${Bytestring.slice(1, 5)}${Bytestring.slice(6, 10)}`;
            let Exists = await process.collection.findOne({ fingerprint: Fingerprint });
            if (!Exists) return message.reply({ embeds: [SendEmbed(`We found the fingerprint however we coudn't match it to any whitelisted user. Fingerprint: \`${Fingerprint}\``)] });
            
            message.reply({embeds: [SendEmbed(`The owner of that encrypted string is <@${Exists.id}>`)]});
        }

        if (command === "whitelist") {
            let Mention = message.mentions.users.first();
            if (!Mention) return message.reply("You must ping a user!");

            let Exists = await process.collection.findOne({ id: Mention.id });
            if (Exists) return message.reply("This user already is whitelisted!");

            let Key = randomBytes(10).toString("hex");
            let Fingerprint = random.int(10000000, 99999999).toString();
            await process.collection.insertOne({ api_key: Key, id: Mention.id, tag: Mention.tag, fingerprint: Fingerprint });

            await message.author.send(`Whitelisted <@${Mention.id}>.\nHis API key is \`${Key}\`\nHis fingerprint is \`${Fingerprint}\` (do not tell him)`);
            await message.reply(`Successfully whitelisted <@${Mention.id}>. DM'ed you his details`);
            await message.member.roles.add("1010619803272216656");
        }

        if (command === "blacklist") {
            let Mention = message.mentions.users.first();
            if (!Mention) return message.reply("You must ping a user!");

            let Exists = await process.collection.findOne({ id: Mention.id });
            if (!Exists) return message.reply("This user is not whitelisted!");

            let Result = await process.collection.deleteOne({ id: Mention.id });
            if (Result.deletedCount === 1) {
                await message.reply(`Successfully blacklisted <@${Mention.id}>.`);
            } else {
                await message.reply("Failed to blacklist user.");
            }
        }
    }
});

client.login(Token);