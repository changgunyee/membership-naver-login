import {$, $$, addClass} from "./utils.js";

const tagController = {
    tagInput: null,
    hiddenTagInput: null,
    tagList: [],
    init() {
        this.tagInput = $('#input-interest');
        this.hiddenTagInput = $('#input-interest-hidden');
        this.setInterestInput();
    },
    setInterestInput() {
        this.tagInput.addEventListener('input', (e) => {
            if (e.data === ',') {
                const tagContent = e.target.value.replace(",", "");
                this.addTagSpan(tagContent);
                e.target.value = "";
            }
        })

        this.tagInput.addEventListener('keydown', (e) => {
            if (e.key === "Backspace" && e.target.value === "") {
                const tagContent = this.tagList.pop();
                this.setHiddenInput();
                if (tagContent) {
                    e.target.value = tagContent;
                }

                const tagElementList = $$('span.tag');
                if (tagElementList.length > 0) {
                    tagElementList[tagElementList.length - 1].remove();
                }
            }
        })
    },
    addTagSpan(tagContent) {
        const tag = document.createElement("span");
        tag.innerText = tagContent;
        addClass(tag, "tag");
        const closeBtn = document.createElement("span");
        closeBtn.innerText = "X";
        addClass(closeBtn, "close");

        const index = this.tagList.push(tagContent) - 1;
        this.setHiddenInput();
        closeBtn.addEventListener('click', () => {
            this.tagList.splice(index, 1);
            this.setHiddenInput();
            tag.remove();
        })
        tag.insertAdjacentElement('beforeend', closeBtn);

        this.tagInput.before(tag);
    },
    setHiddenInput() {
        this.hiddenTagInput.value = this.tagList.join(',');
    }
}

export {
    tagController
}