import config from '../../src/config/env';
import mongoose from 'mongoose';
import Promise from 'bluebird';

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
        let removals = Object.keys(mongoose.connection.collections)
            .map(key=>mongoose.connection.collections[key])
            .map(collection=>collection.remove());

        Promise.all(removals)
            .finally(()=>done());
    }

});


afterEach(function (done) {
    mongoose.disconnect();
    return done();
});