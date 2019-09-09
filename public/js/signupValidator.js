import {getData, listToCamelCaseStr, Validation as v} from "./utils.js";

const signupValidator = {
    CHECK_LIST: ["ID", "PASSWORD", "REPASSWORD", "NAME", "YEAR", "MONTH", "GENDER", "DAY", "EMAIL", "PHONE_NUMBER", "INTEREST", "TOS"],
    id: null,
    password: null,
    repassword: null,
    year: null,
    month: null,
    day: null,
    email: null,
    phoneNumber: null,
    tagController: null,
    tos: null,
    gender: null,
    name: null,
    async checkId() {
        const check = v.checkId(this.id);
        if (check === v.CHECK_RESULT.ID.FAIL) {
            return v.CHECK_RESULT.ID.FAIL
        }

        const avaiable = await this.checkIdAvailable();
        if (!avaiable) {
            return v.CHECK_RESULT.ID.DUPLICATE_FAIL;
        }
        return v.CHECK_RESULT.ID.SUCCESS;
    },
    checkPassword() {
        return v.checkPassword(this.password);
    },
    checkYear() {
        return v.checkBirth(this.year, this.month, this.day);
    },
    checkMonth() {
        return v.checkBirth(this.year, this.month, this.day);
    },
    checkDay() {
        return v.checkBirth(this.year, this.month, this.day);
    },
    checkEmail() {
        return v.checkEmail(this.email);
    },
    checkRepassword() {
        if (this.password === this.repassword) {
            return v.CHECK_RESULT.REPASSWORD.SUCCESS;
        }
        return v.CHECK_RESULT.REPASSWORD.FAIL;
    },
    checkPhoneNumber() {
        return v.checkPhoneNumber(this.phoneNumber);
    },
    checkInterest() {
        return v.checkInterest(this.tagController.tagList);
    },
    checkTos() {
        return v.checkTos(this.tos);
    },
    getMapData() {
        return this.CHECK_LIST.reduce((acc, cur) => {
            const camelCheck = listToCamelCaseStr(cur.split('_'));
            if (camelCheck === "tos") {
                acc[camelCheck] = Number(this[camelCheck]);
            } else if (camelCheck === "interest") {
                acc[camelCheck] = this.tagController.tagList.join(',');
            } else if (camelCheck === "year" || camelCheck === "month" || camelCheck === "day") {
                if (!acc.birth) {
                    acc["birth"] = `${this.year}${this.month}${this.day}`;
                }
            } else if (camelCheck === "gender") {
                if (this.gender === "male") {
                    acc["gender"] = 1;
                } else {
                    acc["gender"] = 0;
                }
            } else {
                acc[camelCheck] = this[camelCheck];
            }
            return acc;
        }, {})
    },
    async checkIdAvailable() {
        const data = await getData("/signup", {
            id: `${this.id}`
        });
        return data;
    }
}

export {
    signupValidator
}