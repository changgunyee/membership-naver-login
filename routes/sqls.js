const sqlite3 = require('sqlite3').verbose();

let db = new sqlite3.Database('./login.db', sqlite3.OPEN_READWRITE, (err) => {
    if (err) {
        return console.error(err.message);
    }
    console.log('Connected to the in-memory SQlite database.');
});

const executeSessionSqls = {
    EXPIRE_DELAY: 60 * 60 * 1000,
    getUserIdBySessionId(sessionId) {
        const query = `select * from session where id="${sessionId}"`;
        return new Promise((resolve, reject) => {
            db.get(query, (err, row) => {
                if (err) {
                    reject(err);
                } else if (row) {
                    resolve({userId: row.user_id});
                } else {
                    resolve(null);
                }
            })
        })
    },
    createSession(sessionId, userId, createDate, expireDate) {
        const query = `insert into session values ( "${sessionId}", "${userId}", ${createDate} , ${expireDate} )`;
        return new Promise((resolve, reject) => {
            db.run(query, (err) => {
                if (err) {
                    reject(err);
                } else {
                    resolve({sessionId: sessionId});
                }
            })
        })
    },
    deleteSessionById(sessionId) {
        const query = `delete from session where id="${sessionId}"`;
        return new Promise((resolve, reject) => {
            db.run(query, (err) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(true);
                }
            })
        })
    },
    updateSessionExpireDate(sessionId, expireDate) {
        const query = `update session set expire_date=${expireDate} where id="${sessionId}"`;
        return new Promise((resolve, reject) => {
            db.run(query, (err) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(true);
                }
            })
        })
    },
    deleteSessionsByExpireDate(date) {
        const query = `delete from session where expire_date <= ${date}`;
        return new Promise((resolve, reject) => {
            db.run(query, (err) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(true);
                }
            })
        })
    }
}

const executeUserSqls = {
    getUser(userId) {
        const query = `select * from user where id="${userId}"`;
        return new Promise((resolve, reject) => {
            db.get(query, (err, row) => {
                if (err) {
                    reject(err);
                } else if (row) {
                    resolve({id: row.id, name: row.name});
                } else {
                    resolve(null);
                }
            })
        })
    },
    login(id, password) {
        const query = `select * from user where id="${id}" and password="${password}"`;
        return new Promise((resolve, reject) => {
            db.get(query, (err, row) => {
                if (err) {
                    reject(err);
                } else if (row) {
                    resolve({userId: row.id});
                } else {
                    resolve(null);
                }
            })
        })
    },
    async addUser(id, password, name, birth, gender, email, phoneNumber, interest, tos) {
        const query = `insert into user values ("${id}", "${password}", "${name}", "${birth}", ${gender}, "${email}", "${phoneNumber}", "${interest}", ${tos})`;
        return new Promise((resolve, reject) => {
            db.run(query, function (err) {
                if (err) {
                    reject(err);
                } else {
                    resolve(true);
                }
            });
        })
    },
    checkIdAvailable(id) {
        const query = `select id from user where id="${id}"`;
        return new Promise((resolve, reject) => {
            db.get(query, (err, row) => {
                if (err) {
                    reject(err);
                } else if (row) {
                    resolve(false);
                } else {
                    resolve(true);
                }
            })
        })
    }
}

module.exports = {
    executeUserSqls, executeSessionSqls
}