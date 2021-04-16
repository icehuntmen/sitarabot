'use strict';
const {Schema, Types} = require('mongoose')

module.exports = {
    collections: "channels",
    schema: {
        _id: Types.ObjectId,
        active: {type: Boolean, default: true},
        guildID: {type: String},
        roles: {},
        mainRoleID: {type: String, default: null},
        userRole: {type: String},
        id: {type: String, unique: true, index: true, sparse: true},
        type: {type: String},
        deleted: {type: Boolean, default: false},
        name: {type: String},
        rawPosition:{type: Number},
        parentID: {type: String},
        permissionOverwrites: {},
        topic:{type: String},
        nsfw: {type: Boolean, default: false},
        rateLimitPerUser:{type: Number},
        lastPinTimestamp: {type: Date, default: null},
},

    // instance methods goes here
    methods: {

    },

// statics methods goes here
    statics: {
        activeChannel : function activeChannel (idChannel, cb) {
            return this.model('channels').updateOne(({id:idChannel},{ active: true} ), cb);
        },
        deactiveChannel : function deactiveChannel (idChannel, cb) {
            return this.model('channels').updateOne(({id:idChannel},{ active: false} ), cb);
        },
        saveMainRole : function saveMainRole (mainRole, channelID, cb) {
            return this.model('channels').updateOne(({id: channelID},{ mainRoleID: mainRole} ), cb);
        }
    }
};