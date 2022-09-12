const path = require('path')
const { BASE_DIR, SETTINGS_PATH } = require('./config')

try {
  const settings = require(path.join(BASE_DIR, SETTINGS_PATH))
  console.log('================================')
  console.log(`area:     ${settings.area}`)
  console.log(`shop:     ${settings.shop}`)
  console.log(`eamil:    ${settings.email}`)
  console.log(`password: ${settings.password}`)
  console.log('================================')
} catch (e) {
  console.error('缺少 settings.json 配置文件')
}
