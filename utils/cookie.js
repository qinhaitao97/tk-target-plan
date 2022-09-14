const fs = require("fs");
const path = require("path");
const login = require("../login");
const { requestGet } = require("./request");
const { BASE_DIR, COOKIE_PATH } = require("../config");
const { CHECK_COOKIE_1, CHECK_COOKIE_2, REFERER_1, REFERER_2 } = require("../spiders/api");


let loadCookie= () => {
    return fs.readFileSync(path.join(BASE_DIR, COOKIE_PATH), {encoding: "utf-8", flag: "r"}).trim();
},
writeCookie = (cookie) => {
    fs.writeFileSync(path.join(BASE_DIR, COOKIE_PATH), cookie, {encoding: "utf-8", flag: "w"});
},
checkCookie = async (cookie) => {
    let flag = false,
        cookie_ = cookie ?? "",
        url = _global_site ? CHECK_COOKIE_2 : CHECK_COOKIE_1,
        headers = {
            "authority": "affiliate.tiktok.com",
            "accept": "*/*",
            "accept-language": "zh-CN,zh;q=0.9,en;q=0.8",
            "cache-control": "no-cache",
            "pragma": "no-cache",
            "referer": _global_site ? REFERER_2 : REFERER_1,
            "sec-ch-ua": "\"Chromium\";v=\"104\", \" Not A;Brand\";v=\"99\", \"Google Chrome\";v=\"104\"",
            "sec-ch-ua-mobile": "?0",
            "sec-ch-ua-platform": "\"Windows\"",
            "sec-fetch-dest": "empty",
            "sec-fetch-mode": "cors",
            "sec-fetch-site": "same-origin",
            "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/104.0.0.0 Safari/537.36",
            "cookie": cookie_,
        };

    try{
        let _data = await requestGet({url, headers, params: {}});
        if (_data.user_id && _data.region) {
            flag = true;
        }
    } catch(err) {
        console.error(err);
    }

    return flag;
};


module.exports = async () => {
    console.log(`\n---------- 正在获取cookie ----------\n`);
    let cookie = loadCookie();
    if (!(await checkCookie(cookie))) {
        console.log(`\n---------- cookie已失效, 请在弹出的浏览器中手动登录 ----------\n`);
        cookie = await login();
        if (await checkCookie(cookie)) {
            writeCookie(cookie);
        }
    }
    return cookie;
};
