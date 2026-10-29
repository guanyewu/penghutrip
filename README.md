# 島嶼慢慢走｜Penghu Trip Guide

供 5 人共同使用的澎湖自駕慢旅行網站。採 React + Vite、靜態 JSON 與手機優先設計，不需要登入、資料庫或後端。

## 本地開發

```bash
npm install
npm run dev
```

資料檢查與正式建置：

```bash
npm run validate:data
npm run build
npm run preview
```

## 資料維護

- 景點：`src/data/places.json`
- 餐飲：`src/data/restaurants.json`
- 區域行程：`src/data/itineraries.json`
- 旅行資訊：`src/data/travel-info.json`
- 開放時間、票價與預約條件：`src/data/visit-conditions.json`

每筆景點或餐飲需保留唯一 `id`，以及 `verificationStatus`、`lastVerifiedAt`、`sourceUrl`、`notes`。未取得可信來源時請使用 `unverified`，不要填入推測的地址、電話、營業時間或無海鮮保證。

## GitHub Pages 部署

1. 將專案推送至名稱為 `penghutrip` 的 GitHub repository `main` 分支。
2. 在 repository 的 **Settings → Pages → Build and deployment** 將 Source 設為 **GitHub Actions**。
3. 推送後，`.github/workflows/deploy.yml` 會自動驗證資料、建置並部署 `dist`。
4. 預設網址為 `https://USERNAME.github.io/penghutrip/`。

若 repository 名稱不同，請同步修改 `vite.config.js` 的 `base`。
