const fs = require("fs");


module.exports = () => {
    console.log(`\n---------- 正在保存运行结果 ----------\n`);
    let path = `./result/${_settings.resultFile}`,
        arr = [
            `【开始运行时间】 ${_start_time}`,
            `【结束运行时间】 ${_end_time}`,
            `【计划名称前缀】 ${_settings.planNamePrefix}`,
            `【计划匹配标签】 ${_settings.tags.join("、")}`,
            `【计划佣金】     ${_settings.commission}%`,
            `【计划有效天数】 ${_settings.period}`,
            `【原定计划数量】 ${_settings.maxPlanCount}`,
            `【实际计划数量】 ${_success_plan_count}`,
            `【使用达人数量】 ${_usernames_flag_1.length}`,
            `【使用达人列表】 ${_usernames_flag_1.join("、")}`,
            `【搜索不到达人】 ${_usernames_flag_2.join("、")}`,
            `【搜索不到产品】 ${_products_flag_2.join("、")}`,
            `【无法添加产品】 ${_products_flag_3.join("、")}`,
        ];
    fs.writeFileSync(path, arr.join("\n"), {encoding: "utf-8", flag: "w"});
}
