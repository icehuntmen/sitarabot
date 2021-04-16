'use strict';

const {Schema, Types} = require('mongoose')
const nameCollection = "guilds"
const SettingsGuild = new Schema({
    _id: Types.ObjectId,
    prefix: {type: String},
});
/**
 *
 * @type {Schema.<schema,collections,methods,statics>}
 */
module.exports = {
    collections: nameCollection,
    schema: {
        _id: Types.ObjectId,
        active: {type: Boolean, default: true},
        id: {type: String, unique: true, index: true, sparse: true},
        name: {type: String},
        ownerID: {type: String,ref: 'Users'},
        ownerUsername: {type: String},
        prefix: {type: String},
        privateChannelID:{type: String, default: null},
        welcomeChannel: {type: String},
        welcomeMsg: {type: String},
        modRole: {type: String},
        settings: {type: SettingsGuild, default: {}},
        banGuild: {type: Boolean, default: false},
        comments: [{body:"string", by: Types.ObjectId}],
        deleted: {type: Boolean, default: false},
        available: {type: Boolean, default: true},
        shardID: {type: Number, default: 0},
        iconGuild: {type: String},
        splash: {type: String, default: null},
        region: {type: String},
        memberCount: {type: Number},
        large: {type: Boolean, default: true},
        features: {type: {}},
        applicationID: {type: String, default: null},
        afkTimeout: {type: Number},
        afkChannelID: {type: String, default: null},
        systemChannelID: {type: String},
        embedEnabled: {type: String},
        premiumTier: {type: Number},
        premiumSubscriptionCount: {type: Number},
        verificationLevel: {type: String},
        explicitContentFilter: {type: String},
        mfaLevel: {type: Number},
        joinedTimestamp: {type: Date},
        timezoneGuild: {type: String, default: timezone.tz.guess()},
        createdTimestamp: {type: Date, default: Date.now()},
        lastUpdateTimestamp: {type: Date, default: Date.now()},
        defaultMessageNotifications: {type: String},
        systemChannelFlags: {},
        vanityURLCode: {type: String},
        description: {type: String},
        banner: {type: String},
        rulesChannelID: {type: String},
        publicUpdatesChannelID: {type: String}

},

    // instance methods goes here
    methods: {

    },

// statics methods goes here
    statics: {
        setPrivateChannelID : function setPrivateChannelID (id, privateID, cb) {
            return this.model(nameCollection).updateOne(({ id: id },{privateChannelID: privateID} ), cb);
        },
        getPrivateChannelID : function getPrivateChannelID (id, cb) {
            return this.model(nameCollection).findOne({id: id}, 'privateChannelID' , cb);
        },
        getPrefix : function getPrefix(id, cb) {
            return this.model(nameCollection).findOne({id: id}, 'prefix' , cb);
        },
        isGuilsID : function isGuilsID(id, cb) {
             return  this.model(nameCollection).exists({id: id}, cb)
        }
    }
};
