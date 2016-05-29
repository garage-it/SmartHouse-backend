import config from '../config/env';
import mongoose from 'mongoose';

beforeEach(function (done) {

    if (mongoose.connection.readyState !== 0) {
        return clearDB();
    }

    mongoose.connect(config.db, function (err) {
        if (err) {
            throw err;
        }

        return clearDB();
    });


    function clearDB() {
        for (var i in mongoose.connection.collections) {
            mongoose.connection.collections[i].remove(function() {});
        }

        return done();
    }

});


afterEach(function (done) {
    mongoose.disconnect();
    return done();
});