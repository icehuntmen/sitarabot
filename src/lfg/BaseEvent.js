const {Collection} = require('discord.js');
const {validateOptions} = require('../utils/validate')


module.exports = class BaseEvent {

        constructor(unite) {
            this.unite = unite
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

    async editPaginator(botMessage, isBack, i, pages) {
        isBack ? (i > 0 ? --i : pages.length - 1) : (i + 1 < pages.length ? ++i : 0);
        await botMessage.edit({ embed: pages[i] });
    }

    paginator(options) {
        const { botMessage, user, pages, collectorOptions, reactions, deleteReaction, deleteAllReactionsWhenCollectorEnd } = validateOptions(options, 'reactPaginator');
        if (!pages || pages.length === 0)
            throw 'Invalid input: pages is null or empty';

        let i = 0;
        botMessage.edit({ embed: pages[0] }).then(() => {
            this.question({
                botMessage,
                user,
                reactions,
                collectorOptions,
                deleteReaction,
                deleteAllReactionsWhenCollectorEnd,
                onReact: [
                    async (botMessage) => await this.editPaginator(botMessage, true, i, pages),
                    async (botMessage) => await this.editPaginator(botMessage, false, i, pages)
                ]
            });
        });
    }

    /**
     * @description This method can be used in multiples emoji choices.
     * @param  {CollectorOptions} options
     * @param  {Message} options.botMessage - Message from Bot to create reaction collector.
     * @param  {UserResolvable} options.user - UserResolvable who will react.
     * @param  {EmojiResolvable[]} [options.reactions] - Array with reactions.
     * @param  {DjsCollectorOptions?} [options.collectorOptions] - Default discord.js collector options
     * @param  {Function[]?} [options.onReact] - Corresponding functions when clicking on each reaction
     * @param  {boolean?} [options.deleteReaction] - The Bot will remove reaction after user react?
     * @param  {boolean?} [options.deleteAllReactionsWhenCollectorEnd] - The Bot will remove reaction after collector end?
     * @example
     * const botMessage = await message.channel.send('Simple yes/no question');
     * ReactionCollector.question({
     *     user: message,
     *     botMessage,
     *     onReact: [
     *         (botMessage, reaction) => message.channel.send("You've clicked in yes button!"),
     *         (botMessage, reaction) => message.channel.send("You've clicked in no button!")
     *     ]
     * });
     * @note onReact(botMessage?: Message) - onReact functions can use botMessage argument.
     * @returns DjsReactionCollector
     */
    question(options) {
        return this.__createReactionCollector(validateOptions(options, 'reactQuestion'));
    }

    /**
     * @description This method can be used in async methods, returning only boolean value, more easier to use inside if tratament or two choices.
     * @param  {AsyncCollectorOptions} options
     * @param  {Message} options.botMessage - Message from Bot to create reaction collector.
     * @param  {UserResolvable} options.user - UserResolvable who will react.
     * @param  {EmojiResolvable[]} [options.reactions] - Array with reactions.
     * @param  {DjsCollectorOptions} [options.collectorOptions] - Default discord.js collector options
     * @param  {boolean} [options.deleteReaction] - The Bot will remove reaction after user react?
     * @param  {boolean} [options.deleteAllReactionsWhenCollectorEnd] - The Bot will remove reaction after collector end?
     * @example
     * const botMessage = await message.channel.send('Simple yes/no question');
     * if (await ReactionCollector.asyncQuestion({ user: message, botMessage }))
     *     message.channel.send('You\'ve clicked in yes button!');
     * else
     *     message.channel.send('You\'ve clicked in no button!');
     * @returns {Promise<boolean>}
     */
    async asyncQuestion(options) {
        return this.__createAsyncReactionCollector(validateOptions(options, 'reactAsyncQuestion'));
    }


    /**
     * @param  {CollectorOptions} _options
     * @returns {DjsReactionCollector}
     */
    __createReactionCollector(_options) {
        try {
            const { botMessage, reactions, user, collectorOptions, onReact, deleteReaction, deleteAllReactionsWhenCollectorEnd } = _options;
            Promise.all(reactions.map(r => botMessage.react(r)));
            const filter = (r, u) => u.id === user.id && (reactions.includes(r.emoji.id) || reactions.includes(r.emoji.name)) && !user.bot;
            const collector = botMessage.createReactionCollector(filter, collectorOptions);
            collector.on('collect', async (reaction) => {
                const emoji = reaction.emoji.id || reaction.emoji.name;
                if (deleteReaction)
                    await reaction.users.remove(user.id);
                await onReact[reactions.indexOf(emoji)](botMessage, reaction);
            });
            collector.on('end', async () => { if (deleteAllReactionsWhenCollectorEnd) await botMessage.reactions.removeAll() });
            return collector;
        } catch (e) {
            throw e;
        }
    }

    /**
     * @private
     * @static
     * @param  {AsyncCollectorOptions} _options
     * @returns {Promise<boolean>}
     */
    async __createAsyncReactionCollector(_options) {
        return new Promise(async (resolve) => {
            const {botMessage, reactions, user, collectorOptions, deleteReaction, deleteAllReactionsWhenCollectorEnd} = _options;
            await Promise.all(reactions.map(r => botMessage.react(r)));
            const filter = (r, u) => u.id === user.id && (reactions.includes(r.emoji.id) || reactions.includes(r.emoji.name)) && !user.bot;
            const caughtReactions = await botMessage.awaitReactions(filter, collectorOptions);
            if (caughtReactions.size > 0) {
                const reactionCollected = caughtReactions.first();
                if (deleteReaction)
                    await reactionCollected.users.remove(user.id);
                if (deleteAllReactionsWhenCollectorEnd)
                    await reactionCollected.message.reactions.removeAll();
                return resolve(reactions.indexOf(reactionCollected.emoji ? (reactionCollected.emoji.name || reactionCollected.emoji.id) : (reactionCollected.name || reactionCollected.id)) === 0);
            }
            return resolve(false);
        });
    }


}