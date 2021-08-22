//TODO: Fix members being found a second time
//TODO: Fix settimout

const dotenv = require('dotenv');
dotenv.config();
const token = process.env.TOKEN;

const { Client, Intents } = require('discord.js');

let messageToWatch = null;
let authorToWatch = null;
let alreadyResponded = false;
let membersNotResponded = [];

// Create a new client instance
const client = new Client({ 
    intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_MESSAGE_REACTIONS],
    partials: ['MESSAGE', 'CHANNEL', 'REACTION']
});

// When the client is ready, run this code (only once)
client.once('ready', () => {
	console.log('Server is Ready!');
});

client.on('messageCreate', message => {
    if(message.content === 'ping' && message.author.username === 'Havok') {
        message.channel.send('pong');
    }
    if(message.content.toLowerCase() === '!pickstuffie' && message.author.username === 'Havok') {
        Intro(message)
    }
});

client.on("messageReactionAdd", async (reaction, user) => {
    // When a reaction is received, check if the structure is partial
	if (reaction.partial) {
		// If the message this reaction belongs to was removed, the fetching might result in an API error which should be handled
		try {
			await reaction.fetch();
		} catch (error) {
			console.error('Something went wrong when fetching the message:', error);
			// Return as `reaction.message.author` may be undefined/null
			return;
		}
	}

    if(reaction.message.id === messageToWatch && user.id === authorToWatch) {
        reaction.message.channel.send(`🙂`);
        alreadyResponded = true;
    }

    if(reaction.message.id === '879051372216078357' && reaction._emoji.name === '🐻') {
        const role = await reaction.message.guild.roles.resolveId("878951249049948190");
        reaction.message.member.roles.add(role)
    }

})

client.on("messageReactionRemove", async (reaction, user) => {
    // When a reaction is received, check if the structure is partial
	if (reaction.partial) {
		// If the message this reaction belongs to was removed, the fetching might result in an API error which should be handled
		try {
			await reaction.fetch();
		} catch (error) {
			console.error('Something went wrong when fetching the message:', error);
			// Return as `reaction.message.author` may be undefined/null
			return;
		}
	}

    if(reaction.message.id === '879051372216078357' && reaction._emoji.name === '🐻') {
        const role = await reaction.message.guild.roles.resolveId("878951249049948190");
        reaction.message.member.roles.remove(role)
    }
})

// Login to Discord with your client's token
client.login(token);

const Intro = async (message) => {
    alreadyResponded = false;
    messageToWatch = null;
    authorToWatch = null;
    membersNotResponded = [];

    message.channel.send(`Picking a member to pick Havok's Stuffie`);
    RandomMember(message)
}

const RandomMember = async (message) => {
    const membersWithRole = message.guild.roles.resolve('878951249049948190').members;

    console.log(Object.keys(membersWithRole).length)
    //Not Working!

    const RandomMember = membersWithRole.random().user;
    MessageMember(message, RandomMember);
}

const MessageMember = async (message, RandomMember) => {
    const newMessage = await message.channel.send(`${RandomMember} You have been selected to pick Havoks Stuffie. Please react to this message with the tick below to acknowledge this message. Failing that, someone else will be picked in 4 minutes.`)
    newMessage.react('✅');
    messageToWatch = newMessage.id;
    authorToWatch = RandomMember.id;
    alreadyResponded = false;
    setTimeout(() => {
        if(alreadyResponded = false) {
            membersNotResponded.push(RandomMember.id);
            RandomMember(message);
        }
    }, 240000);
}