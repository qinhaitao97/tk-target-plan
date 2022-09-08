const xlsx = require('node-xlsx')
const dayjs = require('dayjs')
const fs = require('fs')
const path = require('path')
const { BASE_DIR, FILE_DIR, RESULT_DIR, MAX_PRODUCT_COUNT, SETTINGS_PATH } = require('../config')
const file_list = fs.readdirSync(path.join(BASE_DIR, FILE_DIR))
const result_list = fs.readdirSync(path.join(BASE_DIR, RESULT_DIR))

module.exports = () => {
  const file_name = file_list.filter((file) => file.indexOf('.xlsx') > -1)[0]
  if (!file_name) {
    console.error('缺少申请文件')
    return
  }
  const data = xlsx.parse(path.join(BASE_DIR, `${FILE_DIR}/${file_name}`))[0].data
  const data_line = data[1]
  const date = dayjs().format('YYYYMMDD')
  const products = data_line[6].split('、')
  if (!products.length) {
    console.error('没有计划产品')
    return
  }
  // 去重
  const uniq_products = []
  products.forEach((id) => {
    if (!uniq_products.includes(id)) {
      uniq_products.push(id)
    }
  })
  if (uniq_products.length < MAX_PRODUCT_COUNT) {
    console.error(`计划产品不足 ${uniq_products.length} / ${MAX_PRODUCT_COUNT}`)
    return
  }

  const settings = {
    area: 'Malaysia',
    email: data_line[1],
    password: data_line[2],
    maxPlanCount: 100,
    planNamePrefix: `${date}_`,
    period: data_line[4] || 10,
    commission: data_line[3] || 15,
    products: uniq_products,
    creators: [],
    resultFile: `${date}_${data_line[0]}_${result_list.length}.txt`,
    tags: [],
  }

  console.log('settings.json is ready now.')
  fs.writeFileSync(path.join(BASE_DIR, SETTINGS_PATH), JSON.stringify(settings, '', 2))
}