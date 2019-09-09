const {executeUserSqls, executeSessionSqls} = require("../routes/sqls");
const uuidv4 = require('uuid/v4');

describe('user sqls test', () => {
    test('add user test', async () => {
        const response = await executeUserSqls.addUser(`${Math.random()}`, "1234", "이창권", "20190801", 1, "wdfwdfw", "01023232323", "123,444,444", 1);
        expect(response).toBe(true);
    });

    test('signup id is not available', async () => {
        const response = await executeUserSqls.checkIdAvailable("12345678");
        expect(response).toBe(false);
    });

    test('signup id is available', async () => {
        const response = await executeUserSqls.checkIdAvailable("123456789");
        expect(response).toBe(true);
    });
})

describe('session sqls test', () => {
    test('delete sessions expired', async () => {
        const response = await executeSessionSqls.deleteSessionsByExpireDate(Date.now());
        expect(response).toBe(true);
    });

    test('update session expire date', async () => {
        const response = await executeSessionSqls.updateSessionExpireDate("fc09c0dd-efa7-4d45-ba0b-72c6d1617193", Date.now() + executeSessionSqls.EXPIRE_DELAY);
        expect(response).toBe(true);
    });

    const sessionId = uuidv4();
    test('create session', async () => {
        const createDate = Date.now();
        const expireDate = createDate + executeSessionSqls.HOUR;
        const response = await executeSessionSqls.createSession(sessionId, null, createDate, expireDate);
        expect(response.sessionId).toBe(sessionId);
    });

    test('delete session', async () => {
        const result = await executeSessionSqls.deleteSessionById(sessionId);
        expect(result).toBe(true);
    });
})