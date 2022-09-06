const fs = require("fs");
const path = require("path");
const { requestGet } = require("./request");
const { BASE_DIR, COOKIE_PATH } = require("../config");
const login = require("../login");


let loadCookie= () => {
    return fs.readFileSync(path.join(BASE_DIR, COOKIE_PATH), {encoding: "utf-8", flag: "r"}).trim();
},
writeCookie = (cookie) => {
    fs.writeFileSync(path.join(BASE_DIR, COOKIE_PATH), cookie, {encoding: "utf-8", flag: "w"});
},
checkCookie = async (cookie) => {
    let flag = false,
        cookie_ = cookie ?? "",
        url = "https://affiliate.tiktok.com/api/v1/affiliate/account/info?account_type=1&avatar_param[format]=webp&avatar_param[height]=84&avatar_param[width]=84&aid=4331",
        headers = {
            "authority": "affiliate.tiktok.com",
            "accept": "*/*",
            "accept-language": "zh-CN,zh;q=0.9,en;q=0.8",
            "cache-control": "no-cache",
            "pragma": "no-cache",
            "referer": "https://affiliate.tiktok.com/seller/dashboard/home",
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
        let _data = await requestGet({url, headers, params: {}}),
            user_id = _data.user_id;
        if (user_id) {
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
