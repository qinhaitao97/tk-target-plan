const superagent = require("superagent");
require("superagent-proxy")(superagent);
const { VPN_HOST, VPN_PORT } = require("../config");


module.exports = {
    sleepRandom(start, end) {
        start *= 1000;
        end *= 1000;
		let time = Math.floor(Math.random() * (end - start + 1)) + start;
        return new Promise(resolve => setTimeout(() => resolve(), time));
    },

    getHeaders() {
        return {
            "authority": "affiliate.tiktok.com",
            "accept": "application/json, text/plain, */*",
            "accept-language": "zh-CN,zh;q=0.9",
            "cache-control": "no-cache",
            "content-type": "application/json",
            "origin": "https://affiliate.tiktok.com",
            "pragma": "no-cache",
            "referer": "https://affiliate.tiktok.com/seller/dashboard/plan/target-plan/add-target-plan",
            "sec-ch-ua": "\"Chromium\";v=\"104\", \" Not A;Brand\";v=\"99\", \"Google Chrome\";v=\"104\"",
            "sec-ch-ua-mobile": "?0",
            "sec-ch-ua-platform": "\"Windows\"",
            "sec-fetch-dest": "empty",
            "sec-fetch-mode": "cors",
            "sec-fetch-site": "same-origin",
            "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/104.0.0.0 Safari/537.36",
            "cookie": global._cookie,
        }
    },

    getParams() {
        return {
            "user_language": "en",
            "shop_region": "MY",
            "aid": "4331",
            "app_name": "i18n_ecom_alliance",
            "device_id": "0",
            "device_platform": "web",
            "cookie_enabled": "true",
            "browser_language": "zh-CN",
            "browser_platform": "Win32",
            "browser_name": "Mozilla",
            "browser_version": "5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/104.0.0.0 Safari/537.36",
            "browser_online": "true",
            "timezone_name": "Asia/Shanghai",
        }
    },

    async requestPost(options) {
        let promise = superagent
            .post(options.url)
            .set(options.headers)
            .query(options.params)
            .send(JSON.stringify(options.data))
            .timeout({deadline: 20 * 1000})
            .proxy(`socks5h://${VPN_HOST}:${VPN_PORT}`);
        return (await promise.type("application/json")).body;
    },

    async requestGet(options) {
        let promise = superagent
            .get(options.url)
            .set(options.headers)
            .query(options.params)
            .timeout({deadline: 20 * 1000})
            .proxy(`socks5h://${VPN_HOST}:${VPN_PORT}`);
        return (await promise.type("application/json")).body;
    },
}
