import {$, $$} from "./utils.js";

(() => {
    const root = $('html');

    const renderHtml = (html) => {
        root.innerHTML = html;
        const scriptList = $$('script');
        scriptList.forEach(script => {
            if (script.type === "module") {
                loadScript(script);
                script.remove();
            }
        })
    }

    const loadScript = (script) => {
        const newScript = document.createElement('script');
        newScript.type = script.type;
        newScript.src = script.src;
        newScript.asyc = true;
        newScript.onload = (e) => {
            const initScript = document.createElement('script')
            initScript.type = "module";
            initScript.innerText = `import {Render} from "${e.target.src}"; Render.init();`;
            $('head').appendChild(initScript);
        }
        $('head').appendChild(newScript);
    }

    const get = (url) => {
        fetch(url)
            .then((res) => {
                if (res.ok) {
                    return res.text();
                }
            })
            .then((res) => {
                renderHtml(res);
            })
    }

    const routes = {
        signin() {
            get('../html/signin.html');
        },
        signup() {
            get('../html/signup.html');
        },
        main() {
            get('../html/main.html');
        },
        otherwise() {
            get('../html/main.html');
        }
    };

    const router = () => {
        const hash = location.hash.replace('#', '');
        (routes[hash] || routes.otherwise)();
    }

    window.addEventListener('hashchange', router);
    window.addEventListener('DOMContentLoaded', router);
})();