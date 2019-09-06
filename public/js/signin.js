import {$, addClass, removeClass, Validation as v} from "./utils.js";

const Render = {
    init() {
        this.registerLoginBtnEvent();
    },
    registerLoginBtnEvent() {
        $('.form-group .input-group-btn').addEventListener('click', () => {
            const id = String($('#id').value);
            let result = v.checkId(id);
            if (v.CHECK_RESULT.ID.SUCCESS !== result) {
                this.showModal("id", result);
                return this;
            }

            const password = String($('#password').value);
            if (!password) {
                this.showModal("password", "비밀번호를 입력해주세요");
                return this;
            }
        })
    },
    showModal(check, result) {
        const modalElement = $('.modal');
        modalElement.querySelector('p').innerText = `${check.toUpperCase()}를 확인해 주세요.\n${result}`;
        addClass(modalElement, "active");
        setTimeout(() => {
            removeClass(modalElement, "active");
        }, 2000);
    }
}

export {
    Render
}