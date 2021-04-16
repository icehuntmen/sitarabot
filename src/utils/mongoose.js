
module.exports = unite =>  {
    const dbOptions = {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        autoIndex: true,
        useCreateIndex: true,
        connectTimeoutMS: 10000,
        family: 4
    };
    unite.startmongo = () => {


        unite.mongoose.connect('mongodb://localhost:27017/manager', dbOptions);
        unite.mongoose.set('useFindAndModify', false);
        unite.mongoose.Promise = global.Promise;
        unite.mongoose.infoStatus = ['Mongoose disconnected','Mongoose ready! MongoDB ready!'];



        unite.mongoose.connection.on('connected', () => {
            devs.point.succeed('connectMongo', { text: 'MongoDB status connected!' });
        });

        unite.mongoose.connection.on('err', err => {
            devs.point.fail('connectMongo', { text: 'Connection mongoDB:'+ err });
        });

        unite.mongoose.connection.on('disconnected', () => {
            devs.point.fail('connectMongo', { text: 'Not connection mongoDB:'});
        });

    }
};