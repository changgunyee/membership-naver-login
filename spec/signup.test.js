const {executeSignupSqls} = require("../routes/sqls");

describe('signup', () => {
    test('signup', async () => {
        const req = {
            body: {
                id: `${Math.random()}`,
                password: "1234",
                name: "이창권",
                birth: "20190801",
                gender: 1,
                email: "wdfwdfw",
                phoneNumber: "01023232323",
                interest: "123,444,444",
                tos: 1
            }
        }
        const result = await executeSignupSqls.addUser(req);
        expect(typeof result).toMatch('number');
    });

    test('signup id is duplicate', async () => {
        const req = {
            query: {
                id: "12345678"
            }
        }
        const result = await executeSignupSqls.checkIdExists(req);
        expect(result).toBe(true);
    });

    test('signup id is not duplicate', async () => {
        const req = {
            query: {
                id: "123456789"
            }
        }
        const result = await executeSignupSqls.checkIdExists(req);
        expect(result).toBe(false);
    })
})
