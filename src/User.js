const { urlencoded } = require('express');
const e = require('express');
const DataStore = require('nedb');
const db = new DataStore('users');
db.loadDatabase();

module.exports = class User {
    
    constructor() {
        this.loged = false;
    }

    async updatePhoto(userId, url) {
        console.log(userId, url);
        db.update({_id: userId}, {$set: {photo: url}}, {}, (err, num) => {
            console.log(num);
        });
    }

    async getPhoto(userId) {
        var url = await new Promise((resolve,reject) => {
            db.find({_id: userId}, (err, data) => {
                const photo = data[0].photo;
                resolve(photo);
            });
        });

        return url;
    }

    update(user, id) {
        db.update({_id: id}, {$set: {info: user}}, (err, num) => {
            console.log(num);
        });
    }

    register(user) {
        db.insert(user);
        return true;
    }

     async login(user) {
        var x = await new Promise((resolve,reject) => {
            db.find({email: user.email, pass: user.pass}, (err, data) => {
                resolve(data);
            });
        });

        return x;
    }

    async getUsers() {
        let users = await new Promise((resolve,reject) => {
            db.find({}, (err, data) => {
                let d = [];
                data.forEach(e => {
                    if(e.info.name != 'John Doe') {
                        d.push(e);
                    }
                });
                resolve(d);
            });
        });

        let data = [];

        users.forEach(user => {
            if(user.info !== undefined) {
                const {name, field, zone, contact, certified, levels, college} = user.info;
                const id = user._id;
                const photo = user.photo;

                data.push({
                    id, name, field, zone, contact, certified, levels, college, photo
                });
            }
        });

        return data;
    }

    async getUser(id) {
        let user = await new Promise((resolve,reject) => {
            db.find({_id: id}, (err, data) => {
                resolve(data[0]);
            });
        });

        const {name, contact,field, zone, level, levels, certified, college} = user.info;
        const photo = user.photo;
        const data = {name, contact,field, zone, level, levels, certified, college, photo};
        
        return data;
    }

    async updateDisciplinas(data, userId) {
        db.find({_id: userId}, (err, d)=> {
            const user = d[0];
            if(user.disciplinas != undefined) {
                let exists = false;
                user.disciplinas.forEach(ds=> {
                    if(ds.disciplina == data.disciplina) {
                        exists = true;
                        return;
                    }
                });

                if(!exists) {
                    user.disciplinas.push(data);
                    db.update({_id: userId}, {$set: {disciplinas: user.disciplinas}}, (err, num) => {
                        console.log(num);
                    });    
                }
            } else {
                db.update({_id: userId}, {$set: {disciplinas: [data]}}, (err, num) => {
                    console.log(num);
                });
            }
        });
    }
    

    async getDisciplinas(userId) {
        let disciplinas = await new Promise((resolve,reject) => {
            db.find({_id: userId}, (err, data) => {
                const dss = data[0].disciplinas;
                resolve(dss);
            });
        }); 

        return disciplinas;
    }

    removeDisciplina(userId, itemId) {
        console.log(userId, itemId);
        db.find({_id: userId}, (err, d)=> {
            const disciplinas = d[0].disciplinas;
            let dss = [];

            disciplinas.forEach(ds=> {
                if(parseInt(ds.disciplina) != parseInt(itemId)) {
                    dss.push(ds);
                }
            });

            db.update({_id: userId}, {$set: {disciplinas: dss}}, (err, num) => {
                console.log(num);
            });
        });
    }
}