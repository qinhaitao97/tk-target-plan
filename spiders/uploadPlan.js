const checkUsernames = require("./checkUsernames");
const { MAX_USERNAME_COUNT } = require("../config");
const { UPLOAD_PLAN_1, UPLOAD_PLAN_2 } = require("./api");
const { getHeaders, getParams, requestPost } = require("../utils/request");


module.exports = async (meta_plans) => {
    /**
     * 上传计划
     * @returns flag<Number>
     *     1: 新建计划成功
     *     2: 计划已满
     *     3: 请求失败
     */

    let user_ids = _failed_user_ids === null ? (await checkUsernames()) : _failed_user_ids;
    if (user_ids.length < MAX_USERNAME_COUNT) {
        console.log("\n---------- 达人数量不足, 程序即将停止 ----------\n");
        _stop_plan_flag=true;
    };

    console.log(`\n---------- 正在上传今日第${_current_plan}个计划 ----------\n`);

    let flag,
        url = UPLOAD_PLAN_1,
        params = getParams(),
        headers = getHeaders(),
        data = {
            "target_plans": [
                {
                    "plan_name": `${_settings.planNamePrefix}_${String(_current_plan).padStart(3, "0")}`,
                    "end_time": _upload_end_time,
                    "meta_plans": meta_plans,
                    "creator_ids": user_ids,
                }
            ]
        };

    if(_global_site) {
        url = UPLOAD_PLAN_2;
        data["target_plans"][0]["country"] = _account_region;
    }

    try {
        let _data = await requestPost({url, headers, params, data});
        console.log(_data);
        if (Array.isArray(_data.logic_plan_ids) && _data.logic_plan_ids.length > 0) {
            flag = 1;
            _failed_user_ids = null;
        } else if(String(_data.message).indexOf("CreateTargetPlanTooOften") !== -1) {
            flag = 2;
            _failed_user_ids = null;
        } else {
            flag = 3;
            _failed_user_ids = user_ids;
        }
    } catch(err) {
        console.error(err);
        flag = 3;
        _failed_user_ids = user_ids;
    }

    return flag;
}
