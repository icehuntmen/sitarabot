'use strict';
const {Schema, Types} = require('mongoose')

const schemaMessages = new Schema({
    _id: Types.ObjectId,
    authorID: {type: String},
    name: {type: String, default:"TEST"}
})
module.exports = schemaMessages

module.exports = {
    collections: "messages",
    schema: {

        _id: Schema.Types.ObjectId,
        channelID: {type: String, ref:"Channels"},
        deleted: {type: Boolean, default: false},
        id: {type: String},
        type: {type: String},
        content: {type: String},
        authorID: {type: String,ref:"Users"},
        pinned: {type: Boolean},
        tts: {type: Boolean},
        nonce: {type: String},
        system: {type: Boolean},
        embeds: [],
        attachments: [],
        createdTimestamp: {type: Date},
        editedTimestamp: {type: String, default: null},
        webhookID: {type: String, default: null},
        applicationID: {type: String, default: null},
        activity: {type: String, default: null},
        flags: {type: Number, default: null},
        reference: {type: String, default: null},
        guildID: {type: String, ref: "Guild"},
        cleanContent: {type: String},
        setting: {type: schemaMessages}
    },

    // instance methods goes here
    methods: {
        findSimilarType : function findSimilarType (cb) {
            return this.model('messages').findOne({content: this.content}, cb).where({content:'1234'});
        },
        findAuthor : function findAuthor (cb) {
            return this.model('messages').find({content: this.content}, cb).where({content:'1234'});
        }

    },

// statics methods goes here
    statics: {

        search: function search (name, cb) {return this.where('name', new RegExp(name, 'i')).exec(cb)}
    }
}
