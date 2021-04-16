'use strict';
const {Collection, MessageEmbed} = require('discord.js')
const EventManager = require('../BaseEvent')
const FormManager = require('../../utils/form')
class Events {
    constructor(unite) {
        Object.defineProperty(this, 'unite', {value: unite})
        Object.defineProperty(this, 'schema', {value: unite.models.eventSchema})
        Object.defineProperty(this, 'mongoose', {value: unite.mongoose})

        this.result = [];

    }
    findRecursively(obj, toFind){
        for (const key in obj) {
            if (typeof obj[key] === 'object') {
                this.findRecursively(obj[key], toFind);
            }
        }

        if (obj && obj[toFind]) {
            if (typeof obj[toFind] === 'function')
                this.result.push(obj[toFind]);
            else if (obj[toFind].length > 0)
                this.result.push(...obj[toFind]);
            else
                this.result.push(obj[toFind]);
            return true;
        }
    }


    async run(message,args) {
        if (! message) throw Error("Missing message for !event");

        if (! message.channel.permissionsFor(message.guild.me).has('ADD_REACTIONS'))
            throw Error("Missing ADD_REACTIONS privilege");

        const scrollingList = {
            pages: [ {content: "Напишите название ", embed: null , players: null, playerMax: 4 },
                {content: "Список объектов JavaScript для вывода",embed: null} ],
            pageIndex: 2
        };


        const botMessage = await message.reply('вы хотите создать событие?')

        this.exampleEmbed = {
            color: 0x0099ff,
            title: '',
            url: 'https://discord.js.org',
            author: {
                name: 'Some name',
                icon_url: 'https://i.imgur.com/wSTFkRM.png',
                url: 'https://discord.js.org',
            },
            description: '',
            thumbnail: {
                url: 'https://i.imgur.com/wSTFkRM.png',
            },

            timestamp: new Date(),
            footer: {
                text: 'Ща начнется',
                icon_url: 'https://i.imgur.com/wSTFkRM.png',
            },
        };


      const dataMessage = {

          content: 'Укажите название',

          '◀️': async (user, collect) => {


          },

      }



      await this.menu({
            botMessage,
            user: message,

            pages: {
                '✅': {
                    content: 'Напишите название события',
                    reactions: ['◀️','▶️'], // Reactions to acess next sub-page
                    onMessage:  (botMessage, message) => {
                        this.exampleEmbed.title = botMessage.content
                        this.exampleEmbed.author.name = botMessage.author.tag
                    },
                    embed: null,
                    pages:{ // Exemple sub-pages
                        '✅': {
                            content: 'Опишите событие',
                            reactions: ['▶️'],
                            onMessage:  (botMessage, message) => {
                                console.dir(message,{showHidden: false, depth: 0, colors: true})
                                console.dir(botMessage,{showHidden: false, depth: 0, colors: true})
                                this.exampleEmbed.description = botMessage.content
                            },
                            embed: null,
                        },
                        '▶️': {
                            content: 'Конечная',
                            embed: this.exampleEmbed
                        }
                    }
                },
                '❌': {
                    content: 'What\'s happened?',
                    embed: {
                        description: 'You\'ve clicked in ❌ emoji.'
                    }
                }
            }
        });



        /*
          await this.start(
                this.message.channel,
                scrollingList.pages[0], // Optionally { content: ... }
                [ '◀️','▶️' ],
                {
                    '◀️': async (user, form) => {
                        if (scrollingList.pageIndex + 1 < scrollingList.pages.length)

                           await form.message.send(scrollingList.pages[++scrollingList.pageIndex])

                        // removes all reactions not from the user
                        await form.reset();
                    },
                    '▶️': async (user, form) => {
                        if (scrollingList.pageIndex > 0)
                        this.form = form
                            await form.message.edit(scrollingList.pages[--scrollingList.pageIndex]);

                        // removes all reactions not from the user
                        await form.reset();
                    }
                }
            );
           devs.showObject(msg,5)


            let filter = (m, user) => (m.content && user != msg.message.guild.me.user)
            let formMessagecollector = this.message.channel.createMessageCollector(
                filter,
                { time: 30000 }
            );

           formMessagecollector.on('end', collected => console.log(`Collected ${collected.size} items`));
           formMessagecollector.on('collect', async message => {


                console.log('TEST')
                console.dir(message,{showHidden:false,depth: 0, color: true})
                console.dir(message.id,{showHidden:false,depth: 0, color: true})
                console.dir(msg.message.id,{showHidden:false,depth: 0, color: true})

               const merged = {
                   _id: this.mongoose.Types.ObjectId(),
                   id: msg.message.id,
                   title: message.content,
                   time: Date.now()
               }

               const newEvents = await new this.schema(merged,{ autoIndex: false });
               devs.debug(`Guild data to save: ${typeof newGuild} `);


               newEvents.save().then(action => {
                       devs.debug(`Default settings saved for guild "${merged.title}" (${merged.id})`)

                   }
               );





                msg.channel.messages.fetch(message.id).then(async msg => {
                    if (msg) msg.delete();
                });
           })
    */
    }

    async menu(options){
        const { botMessage, user, pages, collectorOptions } = validateOptions(options, 'reactMenu');
        if (!pages || pages.length === 0)
            throw 'Invalid input: pages is null or empty';
        const keys = Object.keys(pages);
        this.result = [];
        this.findRecursively(pages, 'reactions');
        const allReactions = this.result;
        allReactions.push(...keys);
        console.dir(allReactions,{showHidden: false, depth: 3, colors: true})
        let currentPage = null;
        this.result = [];
        this.findRecursively(pages, 'onMessage');
        const needCollectMessages = this.result.length > 0;

        await Promise.all(Object.keys(pages).map(r => botMessage.react(r)));
        const filter = (r, u) => u.id === user.id && (allReactions.includes(r.emoji.id) || allReactions.includes(r.emoji.name)) && !user.bot;
        const collector = botMessage.createReactionCollector(filter, collectorOptions);
        collector.on('collect', async (reaction) => {
            const emoji = reaction.emoji.id || reaction.emoji.name;
            currentPage = currentPage && currentPage.pages ? currentPage.pages[emoji] : pages[emoji];
            //console.dir(currentPage,{showHidden: false, depth: 2, colors: true})
            if (currentPage && typeof currentPage.onReact === 'function')
                await currentPage.onReact(botMessage, reaction);
            if (currentPage && currentPage.reactions) {
                await botMessage.reactions.removeAll();
                await Promise.all(currentPage.reactions.map((r) => botMessage.react(r)));
            }
            else {
                await reaction.users.remove(user.id);
            }

            let { content, embed } = currentPage || botMessage;
            await botMessage.edit(content, { embed });
        });
        collector.on('end', async () => await botMessage.reactions.removeAll());

        if (needCollectMessages) {
            console.dir('Включилось сообщение',{showHidden: false, depth: 0, colors: true})
            const messagesCollector = botMessage.channel.createMessageCollector((message) => message.author.id === user.id, collectorOptions);
            messagesCollector.on('collect', async (message) => {
                if (message.deletable)
                    await message.delete();

                if (currentPage && typeof currentPage.onMessage === 'function'){
                    await currentPage.onMessage(message, botMessage);
                }

            });
        }
        return collector;

    }

}

module.exports = Events