const fs = require('fs')
const path = require('path')
const clearCookie = require('./utils/clear-cookie')
const makeSetting = require('./utils/make-setting')
const { BASE_DIR, COOKIE_PATH } = require('./config')

if (!fs.existsSync(path.join(BASE_DIR, COOKIE_PATH))) {
  clearCookie()
}
makeSetting()