const { sleepRandom } = require("../utils/request");
const checkProductId = require("./checkProductId");
const { SLEEP_PER_CHECK, MAX_PRODUCT_COUNT } = require("../config");


module.exports = {
    async checkProductIds() {
        console.log(`\n---------- 开始检查product_id ----------\n`);
    
        while (true) {
            await sleepRandom(...SLEEP_PER_CHECK);

            let msg = "", 
                product_id = _products_ready.pop();
            if ((!product_id) || (_products_flag_1.length >= MAX_PRODUCT_COUNT)) {break;};
    
            let flag = await checkProductId(product_id);
    
            if (flag === 1) {
                msg = "正常";
                _products_flag_1.push(product_id);
            } else if (flag === 2) {
                msg = "搜索不到产品";
                _products_flag_2.push(product_id);
            } else if (flag === 3) {
                msg = "产品无法选中";
                _products_flag_3.push(product_id);
            } else {
                msg = "请求失败, 待重新请求";
                _products_ready.push(product_id);
            }
    
            console.log(`product_id( ${product_id} ) 检查结果: ${msg}`);
        }

        console.log(`\n---------- 结束检查product_id ----------\n`);
    },

    getMetaPlans() {
        return _products_flag_1.map(
            product_id => {
                return {
                    meta_id: product_id,
                    meta_type: 1,
                    commission_rate: Number.parseInt(_settings.commission) * 100,
                }
            }
        )
    },
}
