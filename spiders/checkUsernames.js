const checkUsername = require("./checkUsername");
const { SLEEP_PER_CHECK, MAX_USERNAME_COUNT } = require("../config");
const { sleepRandom } = require("../utils/request");


module.exports = async () => {
    console.log(`\n---------- 开始检查第${_current_plan}个计划的username ----------\n`);
    let current_index = 0;
    let available_user_ids = [];

    while (true) {
        await sleepRandom(...SLEEP_PER_CHECK);

        if (current_index >= MAX_USERNAME_COUNT){break};
        let msg = "",
            username = _usernames_ready.pop();
        if (!username) {break;};

        let {flag, user_id} = await checkUsername(username, _products_flag_1);

        if (flag === 1) {
            msg = "正常";
            _usernames_flag_1.push(username);
            available_user_ids.push(user_id);
            current_index += 1;
        } else if (flag === 2) {
            msg = "搜索不到达人";
            _usernames_flag_2.push(username);
        } else if (flag === 3) {
            msg = "达人不能重复带同一个产品";
            _usernames_flag_3.push(username);
        } else {
            msg = "请求失败, 待重新请求";
            _usernames_ready.push(username);
        }

        console.log(`username( ${username} ) 检查结果: ${msg}`);
    }

    console.log(`\n---------- 结束检查第${_current_plan}个计划的username ----------\n`);
    return available_user_ids;
}
