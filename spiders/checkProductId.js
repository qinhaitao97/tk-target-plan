const { getHeaders, getParams, requestPost } = require("../utils/request");


module.exports = async (product_id) => {
    /**
     * 检查 product_id
     * @returns flag<Number>: 
     *     1: 正常
     *     2: 搜索不到产品
     *     3: 产品无法选中
     *     4: 请求失败
     */

    let flag,
        url = "https://affiliate.tiktok.com/api/v1/affiliate/product/search",
        headers = getHeaders(),
        params = getParams(),
        data = {
            "search_id": "0",
            "search_key": 1,
            "key_word": product_id,
            "plan_type": 2,
            "page_size": 50,
            "cur_page": 1
        };

    try {
        let _data = await requestPost({url, headers, params, data});
        if (_data.total_num === 0) {
            flag = 2;
        } else if (_data.products[0].status !== 1) {
            flag = 3;
        } else {
            flag = 1;
        }
    } catch(err) {
        console.error(err);
        flag = 4;
    }

    return flag;
}
