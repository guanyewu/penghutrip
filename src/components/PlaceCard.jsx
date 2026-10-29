import { PinIcon } from './Icons.jsx'

const statusLabels = { verified: '已查證', unverified: '待查證', seasonal: '季節性營業', closed: '已停業' }

export default function PlaceCard({ item }) {
  const mapsUrl = item.mapUrl || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(item.address || `${item.name} 澎湖`)}`
  return <article className="place-card">
    <div className="card-topline">
      <span className="type-label">{item.category}</span>
      <span className={`status status-${item.verificationStatus}`}>{statusLabels[item.verificationStatus] || '待確認'}</span>
    </div>
    <h3>{item.name}</h3>
    <p className="place-meta">{item.region} · 建議停留 {item.stayDuration || '待確認'}</p>
    {item.address && <p className="place-address">{item.address}</p>}
    <p className="place-copy">{item.description || '介紹待確認'}</p>
    <div className="tag-row">
      {item.diet !== '不適用' && <span className="tag diet-tag">{item.diet}</span>}
      {item.reservationStatus && <span className="tag booking-tag">{item.reservationStatus}</span>}
      {item.environment.slice(0, 2).map(tag => <span className="tag" key={tag}>{tag}</span>)}
    </div>
    <div className="note"><strong>行前備註</strong><span>{item.notes || '待確認'}</span></div>
    {item.stores?.length > 0 && <div className="store-list"><strong>文章提及店家</strong><div>{item.stores.map(store => <a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(store.query || `${store.name} 澎湖`)}`} target="_blank" rel="noreferrer" key={store.name}>{store.name} ↗</a>)}</div></div>}
    <div className="card-actions">
      {!item.stores?.length && <a className="map-button" href={mapsUrl} target="_blank" rel="noreferrer" aria-label={`在 Google Maps 搜尋 ${item.name}`}><PinIcon />Google Maps</a>}
      {item.sourceUrl && <a className="source-button" href={item.reservationUrl || item.sourceUrl} target="_blank" rel="noreferrer">{item.sourceLabel || '官方資訊'}</a>}
    </div>
  </article>
}
