import { readFile } from 'node:fs/promises'

const files = ['src/data/places.json', 'src/data/restaurants.json', 'src/data/souvenirs.json']
const allowedStatuses = new Set(['verified', 'unverified', 'seasonal', 'closed'])
const seen = new Set()
let count = 0

for (const file of files) {
  const items = JSON.parse(await readFile(new URL(`../${file}`, import.meta.url), 'utf8'))
  for (const item of items) {
    count += 1
    for (const key of ['id','name','category','region','verificationStatus','notes']) {
      if (!item[key]) throw new Error(`${file}: ${item.id || '(unknown)'} 缺少 ${key}`)
    }
    if (seen.has(item.id)) throw new Error(`重複 ID: ${item.id}`)
    seen.add(item.id)
    if (!allowedStatuses.has(item.verificationStatus)) throw new Error(`${item.id}: 無效 verificationStatus`)
    if (!('lastVerifiedAt' in item) || !('sourceUrl' in item)) throw new Error(`${item.id}: 缺少查證欄位`)
    if (item.verificationStatus === 'verified' && (!item.lastVerifiedAt || !item.sourceUrl)) throw new Error(`${item.id}: 已查證資料必須有日期與來源`)
    if (item.category === '伴手禮' && (!Array.isArray(item.stores) || item.stores.length === 0)) throw new Error(`${item.id}: 伴手禮必須提供至少一個店家或購買搜尋入口`)
    for (const store of item.stores || []) {
      if (!store.name || !store.query) throw new Error(`${item.id}: 店家入口缺少 name 或 query`)
    }
  }
}

console.log(`資料驗證完成：${count} 筆候選、${seen.size} 個唯一 ID。`)
