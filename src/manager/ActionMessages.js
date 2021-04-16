'use strict';

/**
 *
 */
class ActionMessages {
    /**
     *
     * @param {UBot} unite
     */
    constructor(unite) {
        this.unite = unite;
        this.mongo = unite.mongoose

    }

    /**
     *
     * @param {Message} messages
     * @return {Promise<any>}
     */
    async saveMessage(messages){

    var model = this.unite.models

        //const settings  = new saveMessageSetting({authorID: messages.author.id});
        const settings  = {authorID: messages.author.id};

        /**
         * @type {Mongoose.Schema}
         */
        const datas = await new model.messageSchema({
            _id: this.mongo.Types.ObjectId(),
            channelID: messages.channelID,
            deleted: messages.deleted,
            id: messages.id,
            type: messages.type,
            content: messages.content,
            authorID: messages.author.id,
            pinned: messages.pinned,
            tts: messages.tts,
            nonce: messages.nonce,
            system: messages.system,
            embeds: messages.embeds,
            attachments: messages.attachments,
            createdTimestamp: messages.createdTimestamp,
            editedTimestamp: messages.editedTimestamp,
            webhookID: messages.webhookID,
            applicationID: messages.applicationID,
            activity: messages.activity,
            flags: messages.flags,
            reference: messages.reference,
            guildID: messages.guildID,
            cleanContent: messages.cleanContent,
            setting: settings
        })
        //datas..create({ name: 'Aaron' });


       return datas.save().then(msg => {
           ///devs.save(`Save messages: ${ this.unite.clc.red(msg)}`);
        }).catch((err) => {
           devs.error('Error occured while creating user:', err);
        });


    };

}

module.exports = ActionMessages;