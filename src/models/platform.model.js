'use strict';
const {Schema, Types} = require('mongoose')

module.exports = {
    collections: "platform",
    schema: {
        _id: Types.ObjectId,
        active: {type: Boolean, default: true},
        
},

    // instance methods goes here
    methods: {

    },

// statics methods goes here
    statics: {

    }
};