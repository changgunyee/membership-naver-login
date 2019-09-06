const addClass = (element, classString) => {
    element.className = element
        .className
        .split(' ')
        .filter((name) => {
            return name !== classString;
        })
        .concat(classString)
        .join(' ');
}

const removeClass = (element, classString) => {
    element.className = element
        .className
        .split(' ')
        .filter((name) => {
            return name !== classString;
        })
        .join(' ');
}

const listToCamelCaseStr = (list) => {
    const camelCaseStr = list.reduce((acc, cur, idx) => {
        if (idx === 0) {
            return acc + cur.toLowerCase();
        }
        return acc + cur.charAt(0).toUpperCase() + cur.slice(1).toLowerCase();
    }, "");
    return camelCaseStr;
}

const triggerEvent = (el, type) => {
    if ('createEvent' in document) {
        const e = document.createEvent('HTMLEvents');
        e.initEvent(type, false, true);
        el.dispatchEvent(e);
    } else {
        const e = document.createEventObject();
        e.eventType = type;
        el.fireEvent('on' + e.eventType, e);
    }
}

const $ = (query) => {
    return document.querySelector(query);
}

const $$ = (query) => {
    return document.querySelectorAll(query);
}

const postData = async (route, bodyData) => {
    const response = await fetch(`${window.location.origin}${route}`, {
        method: 'POST',
        mode: 'cors',
        cache: 'no-cache',
        credentials: 'same-origin',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(bodyData), // body data type must match "Content-Type" header
    })
    return response.json();
}

const getData = async (route, params) => {
    let paramStr = "?";
    for (let key in params) {
        paramStr += `${key}=${params[key]}&`
    }
    paramStr = paramStr.slice(0, -1);
    const response = await fetch(`${window.location.origin}${route}${paramStr}`, {
        method: 'GET',
        mode: 'cors',
        cache: 'no-cache',
        credentials: 'same-origin',
        headers: {
            'Content-Type': 'application/json',
        }
    })
    return response.json();
}

const Validation = {
    CHECK_RESULT: {
        ID: {
            SUCCESS: "사용 가능한 아이디입니다.",
            FAIL: "5~20자의 영문 소문자, 숫자와 특수기호(_)(-) 만 사용 가능합니다.",
            DUPLICATE_FAIL: "이미 존재하는 아이디입니다."
        },
        PASSWORD: {
            LENGTH_FAIL: "8자 이상 16자 이하로 입력해주세요.",
            SMALL_LETTER_FAIL: "영문 소문자를 최소 1자 이상 포함해주세요.",
            CAPITAL_FAIL: "영문 대문자를 최소 1자 이상 포함해주세요.",
            NUMBER_FAIL: "숫자를 최소 1자 이상 포함해주세요.",
            SPECIAL_CHAR_FAIL: "특수문자를 최소 1자 이상 포함해주세요.",
            SUCCESS: "안전한 비밀번호입니다."
        },
        REPASSWORD: {
            SUCCESS: "비밀번호가 일치합니다.",
            FAIL: "비밀번호가 일치하지 않습니다."
        },
        EMAIL: {
            SUCCESS: "",
            FAIL: "이메일 주소를 다시 확인해주세요."
        },
        PHONE_NUMBER: {
            SUCCESS: "",
            FAIL: "형식에 맞지 않는 번호입니다."
        },
        YEAR: {
            LENGTH_FAIL: "태어난 년도 4자리를 정확하게 입력하세요.",
            OVER_14_FAIL: "만 14세 이상, 99세 이하만 가입 가능합니다.",
            SUCCESS: ""
        },
        MONTH: {
            FAIL: "태어난 월을 정확하게 입력하세요.",
            SUCCESS: ""
        },
        DAY: {
            FAIL: "태어난 날짜를 다시 확인해주세요.",
            SUCCESS: ""
        },
        INTEREST: {
            FAIL: "3개이상 입력해주세요.",
            SUCCESS: ""
        },
        TOS: {
            FAIL: "약관동의를 해주세요",
            SUCCESS: ""
        }
    },
    checkInterest(interest) {
        if (interest.length > 2) {
            return this.CHECK_RESULT.INTEREST.SUCCESS;
        }
        return this.CHECK_RESULT.INTEREST.FAIL;
    },
    checkId(id) {
        if (id && /[a-z0-9_-]{5,20}/.test(id)) {
            return this.CHECK_RESULT.ID.SUCCESS;
        }
        return this.CHECK_RESULT.ID.FAIL;
    },
    checkPassword(password) {
        if (!password || password.length < 8 || password.length > 16) {
            return this.CHECK_RESULT.PASSWORD.LENGTH_FAIL;
        } else if (!/[a-z]/g.test(password)) {
            return this.CHECK_RESULT.PASSWORD.SMALL_LETTER_FAIL;
        } else if (!/[A-Z]/g.test(password)) {
            return this.CHECK_RESULT.PASSWORD.CAPITAL_FAIL;
        } else if (!/[0-9]/g.test(password)) {
            return this.CHECK_RESULT.PASSWORD.NUMBER_FAIL;
        } else if (!/[~`!@#$%\^&*()-+=]/g.test(password)) {
            return this.CHECK_RESULT.PASSWORD.SPECIAL_CHAR_FAIL;
        }
        return this.CHECK_RESULT.PASSWORD.SUCCESS;
    },
    checkBirth(year, month, day) {
        if (year === null || month === null || day === null) {
            return this.CHECK_RESULT.DAY.FAIL;
        }
        year = parseInt(year);
        month = parseInt(month);
        day = parseInt(day);
        const birthDateMonth = new Date(year, month, 0);
        const yearDiff = new Date(Date.now()).getFullYear() - year;

        if (year.toString().length !== 4) {
            return this.CHECK_RESULT.YEAR.LENGTH_FAIL;
        } else if (yearDiff < 15 || yearDiff > 99) {
            return this.CHECK_RESULT.YEAR.OVER_14_FAIL;
        } else if (!month) {
            return this.CHECK_RESULT.MONTH.FAIL;
        } else if (day < 1 || day > birthDateMonth.getDate()) {
            return this.CHECK_RESULT.DAY.FAIL;
        }
        return this.CHECK_RESULT.DAY.SUCCESS;
    },
    checkEmail(email) {
        if (!email || !(/^.+@.+\..+$/g.test(email))) {
            return this.CHECK_RESULT.EMAIL.FAIL;
        }
        return this.CHECK_RESULT.EMAIL.SUCCESS;
    },
    checkPhoneNumber(phoneNumber) {
        if (!phoneNumber || !(/^010[0-9]{7,8}$/g.test(phoneNumber))) {
            return this.CHECK_RESULT.PHONE_NUMBER.FAIL;
        }
        return this.CHECK_RESULT.PHONE_NUMBER.SUCCESS;
    },
    checkTos(tos) {
        if (tos) {
            return this.CHECK_RESULT.TOS.SUCCESS;
        }
        return this.CHECK_RESULT.TOS.FAIL;
    }
}

export {addClass, removeClass, listToCamelCaseStr, $, $$, triggerEvent, Validation, postData, getData}