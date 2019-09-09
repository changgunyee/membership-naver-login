import {$, addClass, getData} from "./utils.js";

const Render = {
    async init() {
        const nameSpan = $(".name");
        const user = await this.getUser();
        if (user) {
            nameSpan.innerText = `${user.name}님 환영합니다`;
            addClass($('.login'), "none");
        } else {
            addClass($('.logout'), "none");
        }

        this.registerEvents();
    },
    async getUser() {
        const user = await getData("/user");
        return user;
    },
    registerEvents() {
        $('.logout').addEventListener('click', async () => {
            const response = await getData("/logout");
            if (response) {
                window.location.reload();
            }
        })
    }
}

export {
    Render
}