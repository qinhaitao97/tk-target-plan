const { GET_UID_1, GET_UID_2 } = require("./api");
const { getHeaders, getParams, requestPost } = require("../utils/request");


module.exports = async (username) => {
    /**
     * 根据 username 获取 userId
     * @returns {user_id, err_code}
     *     user_id<String>:
     *         用户ID
     *     err_code<Number>:
     *         0: 正常
     *         1: 搜索不到达人
     *         2: 请求失败
     */
    let err_code = 0,
        user_id = "",
        url = GET_UID_1,
        headers = getHeaders(),
        params = getParams(),
        data = {
            "page_size": 20,
            "search_id": "0",
            "search_key": 4,
            "key_word": username,
        };

    if (_global_site) {
        url = GET_UID_2;
        data["creator_region"] = _account_region;
    }

    try {
        let _data = await requestPost({url, headers, params, data});
        if (_data.creators !== undefined) {
            user_id = _data.creators[0].creator_id;
        } else {
            err_code = 1;
        }
    } catch(err) {
        console.error(err);
        err_code = 2;
    }

    return {user_id, err_code};
}
