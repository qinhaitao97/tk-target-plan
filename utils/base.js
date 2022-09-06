const fs = require("fs");
const path = require("path");
const getCookie = require("./cookie");
const { BASE_DIR, SETTINGS_PATH, FIRST_PLAN_INDEX } = require("../config");


let loadSettings = () => {
    let text = fs.readFileSync(path.join(BASE_DIR, SETTINGS_PATH), {encoding: "utf-8", flag: "r"});
    return JSON.parse(text);
},
getDatetime = () => {
    return new Date((new Date).getTime() + 8*60*60*1000).toJSON().split('T').join(' ').substr(0, 19);
};


module.exports = {
    getDatetime,

    async initialize() {
        console.log(`\n---------- 正在初始化程序 ----------\n`);

        let settings = loadSettings(),
            cookie = await getCookie(),
            obj = {
                _settings: settings,
                _products_ready: settings.products.reverse(),   // 反转数组, 使得 pop 可以取第一个元素
                _products_flag_1: [],
                _products_flag_2: [],
                _products_flag_3: [],
                _usernames_ready: settings.creators.reverse(),  // 反转数组, 使得 pop 可以取第一个元素
                _usernames_flag_1: [],
                _usernames_flag_2: [],
                _usernames_flag_3: [],
                _current_plan: FIRST_PLAN_INDEX,
                _success_plan_count: 0,
                _stop_plan_flag: false,
                _cookie: cookie,
                _start_time: "",
                _end_time: "",
                _upload_end_time: new Date(`${getDatetime().split(" ")[0]} 23:59:59`).getTime() + settings.period * 24 * 60 * 60 * 1000 + "",
            };

        Object.assign(global, obj);
    },
}
