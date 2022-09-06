const getUserId = require("./getUserId");
const { getHeaders, getParams, requestPost } = require("../utils/request");


module.exports = async (username, product_ids) => {
    /**
     * 检查 username
     * @returns {flag, user_id}
     *     flag<Number>:
     *         1: 正常
     *         2: 搜索不到达人
     *         3: 达人不能重复带同一个产品
     *         4: 请求失败
     *     user_id<String>:
     *         用户ID
     */

    let flag,
        {user_id, err_code} = await getUserId(username);
    if (err_code == 1) {
        return {flag: 2, user_id};
    } else if (err_code == 2) {
        return {flag: 4, user_id};
    }

    let url = "https://affiliate.tiktok.com/api/v1/affiliate/commission_unique/check",
        headers = getHeaders(),
        params = getParams(),
        data = {
            "creator_ids": [
                user_id,
            ],
            "product_ids": product_ids,
        };

    try {
        let _data = await requestPost({url, headers, params, data});
        if (_data.conflict_creator_ids) {
            flag = 3;
        } else {
            flag = 1;
        }
    } catch(err) {
        console.error(err);
        flag = 4;
    }

    return {flag, user_id};
};
