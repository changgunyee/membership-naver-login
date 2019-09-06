const sqlite3 = require('sqlite3').verbose();

let db = new sqlite3.Database('./login.db', sqlite3.OPEN_READWRITE, (err) => {
    if (err) {
        return console.error(err.message);
    }
    console.log('Connected to the in-memory SQlite database.');
});

const executeSignupSqls = {
    async addUser(req) {
        const {id, password, name, birth, gender, email, phoneNumber, interest, tos} = req.body;
        const isExists = await this.checkIdExists(req);
        if (isExists) {
            return false;
        }
        const query = `insert into user values ("${id}", "${password}", "${name}", "${birth}", ${gender}, "${email}", "${phoneNumber}", "${interest}", ${tos})`;
        return new Promise((resolve, reject) => {
            db.run(query, function (err) {
                if (err) {
                    reject(err);
                } else {
                    resolve(name);
                }
            });
        })
    },
    checkIdExists(req) {
        const {id} = req.query;
        const query = `select id from user where id="${id}"`;
        return new Promise((resolve, reject) => {
            db.get(query, (err, row) => {
                if (err) {
                    reject(err);
                } else if (row) {
                    resolve(true);
                } else {
                    resolve(false);
                }
            })
        })
    }
}

module.exports = {
    executeSignupSqls
}