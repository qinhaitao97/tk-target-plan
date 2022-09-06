module.exports = {
    // VPN 配置
    VPN_HOST: "127.0.0.1",
    VPN_PORT: "6153",
    // 根目录
    BASE_DIR: __dirname,
    // cookie 保存位置(相对路径)
    COOKIE_PATH: "./source/cookies.txt",
    // settings.json 所在位置(相对路径)
    SETTINGS_PATH: "./source/settings.json",
    // 登录等待时间(秒)
    LOGIN_TIME: 3 * 60,
    // 每个计划之间的间隔时间, 例如 [30, 60] 表示间隔 30~60 秒
    SLEEP_PER_PLAN: [3, 10],
    // 每次 checkProductId 或 checkUsername 之间的间隔时间, 例如 [0.5, 2.5] 表示间隔 0.5~2.5 秒
    SLEEP_PER_CHECK: [0.3, 1.5],
    // 单个计划最多添加达人数量
    MAX_USERNAME_COUNT: 30,
    // 第一个计划的索引(一般情况下保持默认值 0 即可)
    FIRST_PLAN_INDEX: 0,
}
