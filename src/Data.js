const DataStore = require('nedb');
const db = new DataStore('users');
db.loadDatabase();

module.exports = class Data {
    async searchUsers(d) {
        var d = await new Promise((resolve,reject) => {
            

            db.find({}, (err, data) => {
                let _d = [];

                data.forEach(e => {
                    if((e.info.name.includes(d.text) || e.info.zone == d.zone || e.info.field == d.zone)) {
                        let toPush = e.info;
                        toPush.id = e._id;
                        _d.push(toPush);
                    }
                });

                resolve(_d);
            });
        });

        return d;
    }
}