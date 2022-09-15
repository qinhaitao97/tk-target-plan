const save = require("./save");
const uploadPlan = require("./spiders/uploadPlan");
const { sleepRandom } = require("./utils/request");
const { initialize, getDatetime } = require("./utils/base");
const { checkProductIds, getMetaPlans } = require("./spiders/checkProductIds");
const { SLEEP_PER_PLAN, MAX_USERNAME_COUNT, MAX_FAIL_TIMES } = require("./config");


let main = async () => {
    console.log(`\n---------- 程序开始 ----------\n`);

    await initialize();                     // 程序初始化

    _start_time = getDatetime();

    await checkProductIds();                // 只需要对所有 product_id 检查一次即可
    let meta_plans = await getMetaPlans();
    let _fail_times = 0;

    while (true) {
        if (_stop_plan_flag) {
            break;
        } else {
            console.log(`\n---------- 等待${SLEEP_PER_PLAN[0]}~${SLEEP_PER_PLAN[1]}秒后上传下一个计划 ----------\n`);
            await sleepRandom(...SLEEP_PER_PLAN);
        }
        _current_plan += 1;

        let flag = await uploadPlan(meta_plans);

        if (_fail_times > MAX_FAIL_TIMES) {
            flag = 1;
            _success_plan_count -= 1;
        };

        if (flag === 1) {
            _success_plan_count += 1;
            _fail_times = 0;
        } else if (flag === 2) {
            console.log(`\n---------- 计划已满, 程序即将退出 ----------\n`);
            _usernames_flag_1.splice(-MAX_USERNAME_COUNT, MAX_USERNAME_COUNT);
            _stop_plan_flag = true;
        } else {
            console.log(`\n---------- 上传计划请求失败 ----------\n`);
            _current_plan -= 1;
            _fail_times += 1;
        }

        if (_current_plan >= _settings.maxPlanCount) {
            _stop_plan_flag = true;
        }
    }

    _end_time = getDatetime();
    save();
    console.log(`\n---------- 程序结束 ----------\n`);
}


/**
【注】
1. 运行时, 如果弹出浏览器, 则需要手动登录; 登录成功后, 不要手动关闭浏览器, 要等待浏览器自动退出。
2. 如果 settings.json 中 area 的值以 “Global-” 开头, 则表示当前账号是全球站账号。
3. 请确保 settings.json 中 area 的值是完全正确的; 例如全球站的马来西亚: "Global-Malaysia", 非全球站的马来西亚: "Malaysia"; 
    不同国家的单词请参考 utils/constant.js。

全球站账号密码:
    huanliuxiaodian03@outlook.com
    Imhama4262!!
 */

main().then();
