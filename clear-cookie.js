const fs = require('fs')
const path = require('path')
const { BASE_DIR, COOKIE_PATH } = require('./config')

fs.writeFileSync(path.join(BASE_DIR, COOKIE_PATH), '')