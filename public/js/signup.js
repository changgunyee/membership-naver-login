import {signupValidator} from "./signupValidator.js";
import {tagController} from "./tag.js";
import {$, $$, addClass, listToCamelCaseStr, postData, removeClass, Validation} from "./utils.js";

const Render = {
    init() {
        signupValidator.tagController = tagController;
        tagController.init();
        this.registerInputEvents();
        this.toggleTosDescription();
        this.setTosAgreeBtn();
        this.setSignUpBtn();
        this.registerResetBtnEvent();
    },
    setSignUpBtn() {
        $('#btn-submit').addEventListener('click', async (e) => {
            e.preventDefault();
            // const checkResult = await signupValidator.CHECK_LIST.some(async function (check) {
            for (let check of signupValidator.CHECK_LIST) {
                const inputId = listToCamelCaseStr(check.split('_'));
                const validationFuncStr = "check" + inputId.charAt(0).toUpperCase() + inputId.slice(1);
                if (!signupValidator.hasOwnProperty(validationFuncStr)) {
                    continue;
                }

                const validationResult = await this.checkInputValid(inputId);
                if (validationResult === false || validationResult !== Validation.CHECK_RESULT[check].SUCCESS) {
                    this.showModal(check, validationResult);
                    return this;
                }
            }

            const result = await postData("/signup", signupValidator.getMapData());
            if (result) {
                window.location.href = `${window.location.origin}/#signin`
            }
        })
    },
    showModal(check, validationResult) {
        const modalMessageElement = $('.modal');
        modalMessageElement.querySelector('.modal-message p').innerText = `${check.toUpperCase()}를 확인해 주세요.\n${validationResult}`;
        removeClass(modalMessageElement, "none");
        setTimeout(() => {
            addClass(modalMessageElement, "none");
        }, 2000);
    },
    toggleTosDescription() {
        const tosDescriptionContainer = $('.tos-container .description-container');
        $('.tos-container .description-open').addEventListener('click', () => {
            removeClass(tosDescriptionContainer, "none");
        })
        $('.tos-container .description-close').addEventListener('click', () => {
            addClass(tosDescriptionContainer, "none");
        })
    },
    setTosAgreeBtn() {
        const agreeBtn = $('.tos-container .description-container .agree');
        const description = $('.tos-container .description-container .description');
        description.addEventListener('scroll', function () {
            if (this.scrollTop + this.clientHeight >= this.scrollHeight) {
                agreeBtn.removeAttribute("disabled");
                agreeBtn.addEventListener('click', () => {
                    $('#input-tos').checked = true;
                    signupValidator.tos = true;
                })
            }
        })
    },
    registerInputEvents() {
        signupValidator.CHECK_LIST.forEach((check) => {
            const inputId = listToCamelCaseStr(check.split('_'));
            const inputElement = $("#input-".concat(check.split('_').join('-').toLowerCase()));
            if (inputElement) {
                inputElement.addEventListener('blur', async (e) => {
                    if (inputId !== "tos") {
                        signupValidator[inputId] = e.target.value;
                    }

                    const result = await this.checkInputValid(inputId);
                    this.showInputResult(result, inputElement, check);
                })
            }
        })
    },
    async checkInputValid(inputId) {
        const inputTypeFuncName = "check" + inputId.charAt(0).toUpperCase() + inputId.slice(1);
        if (!signupValidator.hasOwnProperty(inputTypeFuncName)) {
            return "";
        }

        let result;
        if (signupValidator[inputTypeFuncName].constructor.name === "AsyncFunction") {
            result = await signupValidator[inputTypeFuncName]();
        } else {
            result = signupValidator[inputTypeFuncName]();
        }
        return result;
    },
    showInputResult(result, inputElement, check) {
        let resultElement = inputElement.parentElement.querySelector('.result');
        if (!resultElement) {
            resultElement = inputElement.parentElement.parentElement.querySelector('.result');
        }
        resultElement.innerText = result;

        if (Validation.CHECK_RESULT[check] && result === Validation.CHECK_RESULT[check].SUCCESS) {
            removeClass(resultElement, "fail");
            addClass(resultElement, "success");
        } else {
            removeClass(resultElement, "success");
            addClass(resultElement, "fail");
        }
    },
    registerResetBtnEvent() {
        $('.submit .btn-reset').addEventListener('click', () => {
            const inputList = $$('input');
            inputList.forEach((input) => {
                if (input.type === "checkbox") {
                    input.checked = false;
                } else {
                    input.value = "";
                }

                triggerEvent(input, "input");
            })

            $$('.result').forEach((e) => {
                e.innerText = "";
            })

            $$('.tags .tag').forEach((e) => {
                e.remove();
            })
            signupValidator.tagController.tagList = [];
        })
    }
}

export {
    Render
}