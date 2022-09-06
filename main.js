const save = require("./save");
const { SLEEP_PER_PLAN } = require("./config");
const uploadPlan = require("./spiders/uploadPlan");
const { sleepRandom } = require("./utils/request");
const { initialize, getDatetime } = require("./utils/base");
const { checkProductIds, getMetaPlans } = require("./spiders/checkProductIds");


let main = async () => {
    console.log(`\n---------- 程序开始 ----------\n`);

    await initialize();                     // 程序初始化

    _start_time = getDatetime();

    await checkProductIds();                // 只需要对所有 product_id 检查一次即可
    let meta_plans = await getMetaPlans();

    while (true) {
        if (_stop_plan_flag) {
            break;
        } else {
            console.log(`\n---------- 等待${SLEEP_PER_PLAN[0]}~${SLEEP_PER_PLAN[1]}秒后上传下一个计划 ----------\n`);
            await sleepRandom(...SLEEP_PER_PLAN);
        }
        _current_plan += 1;

        let flag = await uploadPlan(meta_plans);
        if (flag === 1) {
            _success_plan_count += 1;
        } else if (flag === 2) {
            console.log(`\n---------- 计划已满, 程序即将退出 ----------\n`);
            _stop_plan_flag = true;
        } else {
            console.log(`\n---------- 上传计划请求失败 ----------\n`);
            // 上传计划请求失败时, _current_plan 回到上一状态
            _current_plan -= 1;
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
运行时, 如果弹出浏览器, 则需要手动登录;
登录成功后, 不要手动关闭浏览器, 要等待浏览器自动退出
 */
main().then();