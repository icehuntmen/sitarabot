'use strict';
const {Schema, Types} = require('mongoose')


module.exports = {
    collections: "events",
    schema: {
        _id: Types.ObjectId,
        id: {type: String, unique: true, index: true, sparse: true},
        title: {type: String},
        description: {type: String},
        requirement: {type: String},
        numberppl: {type: Number, min: 2},
        time: {type: Date}

    },

    // instance methods goes here
    methods: {


    },

// statics methods goes here
    statics: {


    }
}
