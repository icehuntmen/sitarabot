'use strict';
const {Collection} = require('discord.js')

class EventManager {
    constructor(unite) {
        Object.defineProperty(this, 'unite',{value: unite})
        Object.defineProperty(this, 'eventReactionCache',{value: new Collection()})
        Object.defineProperty(this, 'eventMessagesCache',{value: new Collection()})
        Object.defineProperty(this, 'eventCollection',{value: new Collection()})

        this.reactPromise = undefined;

    }


    get message(){
        return this.eventMessage
    }
    get buttons(){
        return this.eventButtons
    }
    get channel(){
        return this.eventChannel
    }
    get dataCollection(){
        return this.eventData
    }
    get reactPro(){
        return this.reactPromise
    }
    get collector(){
        return this.eventCollector;
    }

    add_reacts(startIndex, collector, message) {
        for (let i = startIndex; i < this.buttons.length; ++i) {
            if (collector.ended)
                break;
            message.react(this.buttons[i]);
        }
    }

    interface_get_reactions() {
        const entryArray = [...this.eventReactionCache.entries()];
        let transformArray = [ ];

        for (let buttonIndex in this.buttons) {
            const index = entryArray.findIndex(([v]) => v == this.buttons[buttonIndex]);
            if (index != -1)
                transformArray.push([
                    entryArray[index][0],
                    [...(entryArray[index][1].values())]
                ]);
            else
                transformArray.push([this.buttons[buttonIndex], []]);
        }

        return new Map(transformArray);
    }

    async eventReset(message) {


        console.dir(message,{showHidden: false, depth: 0, colors: true})
       /* let pro = await this.reactPro;
        message.collection.clear();
        for (const button of message.buttons) {
            const resolved = message.message.reactions.resolve(button);
            console.dir(message.message.id,{showHidden: false, depth: 0, colors: true})
            if (resolved) {
                const users = await resolved.users.fetch();

                users.array()
                    .filter(u => u != message.guild.me.user)
                    .forEach(async u => await resolved.users.remove(u));
            }
        }*/
    }

    async interface_transfer(new_message) {
        if (! this.message.channel.permissionsFor(this.message.guild.me).has('ADD_REACTIONS'))
            throw Error("Missing ADD_REACTIONS privilege");

        await this.reactPromise;

        let filter = (react, user) => user != formMessage.guild.me.user
        let options = {}
        const newFormCollector = new_message.createReactionCollector(filter, options);

        this.collectorEVE.stop();
        this.eventReactionCache.clear();

        const message = new_message;
        this.collectorEVE = newFormCollector;



        this.collectorEVE.on('collect', async (react, user) => {
            if (formButtons.some(v => v == react.emoji.name)) {
                if (this.eventReactionCache.has(react.emoji.name))
                    this.eventReactionCache.get(react.emoji.name).add(user);
                else
                    this.eventReactionCache.set(react.emoji.name, new Set([ user ]));

                if (this.dataEVE.has(react.emoji.name))
                    this.dataEVE.get(react.emoji.name)(user, this.dataInterface);
            }
            else {
                await react.users.remove(user);
            }
        });

        this.collectorEVE.on('remove', async (react, user) => {
            if (this.buttons.some(v => v == react.emoji.name))
                if (this.eventReactionCache.has(react.emoji.name))
                    this.eventReactionCache.get(react.emoji.name).delete(user);
        });

        this.reactPromise = this.add_reacts(0);
    }


    async buildMessages(messages, eventButtons, eventData) {

        const msg = await messages;


        const filter = (react, user) => user != msg.guild.me.user
        const options = {}
        const eventCollector = msg.createReactionCollector(filter, options);
        this.collectorEVE = eventCollector
        this.dataEVE = eventData

        eventCollector.on('collect', async (react, user) => {
            if (eventButtons.some(v => v == react.emoji.name)) {
                if (this.eventReactionCache.has(react.emoji.name))
                    { this.eventReactionCache.get(react.emoji.name).add(user);
                        console.dir(this.eventReactionCache,{showHidden: false, depth: 1, colors: true})
                    }
                else
                    { this.eventReactionCache.set(react.emoji.name, new Set([user]));
                        console.dir(this.eventReactionCache,{showHidden: false, depth: 1, colors: true})
                    }

                if (eventData.has(react.emoji.name)){

                    eventData.get(react.emoji.name)(user, this.dataInterface);
                    console.dir(eventData,{showHidden: false, depth: 1, colors: true})
                }


            }
            else {
                // Remove unspecified reactions
                await react.users.remove(user);
            }
        });

        eventCollector.on('remove', async (react, user) => {
            if (eventButtons.some(v => v == react.emoji.name))
                if (this.eventReactionCache.has(react.emoji.name))
                    this.eventReactionCache.get(react.emoji.name).delete(user);
        });

        this.reactPromise = this.add_reacts(0, eventCollector, msg);

        this.dataInterface = {
            message: this.message,
            channel: this.channel,
            buttons: this.buttons,
            collection: this.dataCollection,
            reset: async () => {
                await this.reactPromise;
                this.eventReactionCache.clear();
                for (const button of eventButtons) {
                    const resolved = msg.reactions.resolve(button);

                    if (resolved) {
                        const users = await resolved.users.fetch();

                        users.array()
                            .filter(u => u != msg.guild.me.user)
                            .forEach(async u => await resolved.users.remove(u));
                    }
                }
            },
            transfer: null,
            getReactions: this.interface_get_reactions,
            waitReactions: () => this.reactPromise

        }

        this.dataInterface.transfer = this.interface_transfer

        return this.dataInterface;
    }

    start(message,content,buttons,data){
        Object.defineProperty(this, 'eventMessage',{value: message})
        Object.defineProperty(this, 'eventChannel',{value: message.channel})
        Object.defineProperty(this, 'eventButtons',{value: buttons.slice()})
        Object.defineProperty(this, 'eventData',{value: data instanceof Collection
                ? new Collection(data)
                : new Collection(Object.entries(data || {}))
        })



        const {content: msg_content, extra_content: msg_extra_content} = content instanceof String || typeof content === "string"
            ? {content, extra_content: undefined}
            : content;

        const messages =  this.eventChannel.send(msg_content, msg_extra_content)

        return this.buildMessages(messages, buttons, data);
    }
}

module.exports = EventManager