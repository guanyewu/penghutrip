import { useEffect, useMemo, useState } from 'react'
import places from './data/places.json'
import restaurants from './data/restaurants.json'
import souvenirs from './data/souvenirs.json'
import itineraries from './data/itineraries.json'
import travelInfo from './data/travel-info.json'
import visitConditions from './data/visit-conditions.json'
import tomorrowPlans from './data/tomorrow-plans.json'
import PlaceCard from './components/PlaceCard.jsx'
import FilterPanel from './components/FilterPanel.jsx'
import { ArrowIcon, CompassIcon, SearchIcon } from './components/Icons.jsx'

const conditionByPlaceId = Object.fromEntries(visitConditions.items.map(item => [item.placeId, item]))
const allItems = [...places.map(item => ({...item, visitCondition:conditionByPlaceId[item.id]})), ...restaurants, ...souvenirs]
const blankFilters = {region:'',category:'',diet:'',period:'',environment:'',bookingType:'',verificationStatus:''}

function routeFromHash() {
  const value = window.location.hash.replace(/^#\/?/, '')
  if (value.startsWith('region/')) return {page:'region', id:value.split('/')[1]}
  return {page: value || 'home'}
}

function useRoute() {
  const [route, setRoute] = useState(routeFromHash)
  useEffect(() => { const onHash = () => { setRoute(routeFromHash()); window.scrollTo(0,0) }; window.addEventListener('hashchange', onHash); return () => window.removeEventListener('hashchange', onHash) }, [])
  return route
}

function Header({ route }) {
  return <header className="site-header"><a href="#/" className="brand" aria-label="回首頁"><span className="brand-mark"><CompassIcon /></span><span><strong>島嶼慢慢走</strong><small>PENGHU TRIP GUIDE</small></span></a><nav aria-label="主要導覽">
    <a className={route.page==='home'?'active':''} href="#/">首頁</a><a className={route.page==='plans'?'active':''} href="#/plans">明日方案</a><a className={route.page==='explore'?'active':''} href="#/explore">探索</a><a className={route.page==='regions'||route.page==='region'?'active':''} href="#/regions">區域行程</a><a className={route.page==='info'?'active':''} href="#/info">旅行資訊</a>
  </nav></header>
}

function SearchBox({ value, onChange, onSubmit, compact=false }) {
  return <form className={`search-box ${compact?'compact':''}`} onSubmit={e=>{e.preventDefault();onSubmit?.()}}><SearchIcon/><label className="sr-only" htmlFor={compact?'explore-search':'home-search'}>搜尋地點、區域或標籤</label><input id={compact?'explore-search':'home-search'} value={value} onChange={e=>onChange(e.target.value)} placeholder="搜尋景點、餐廳、小吃或區域…"/><button type="submit">搜尋</button></form>
}

function Home({ goExplore }) {
  const [query,setQuery]=useState('')
  const quick = filters => goExplore('', filters)
  return <main>
    <section className="hero">
      <div className="hero-art" aria-hidden="true"><div className="sun"></div><div className="island island-one"></div><div className="island island-two"></div><div className="wave wave-one"></div><div className="wave wave-two"></div></div>
      <div className="hero-content"><p className="eyebrow">2026 · 4 天 3 夜 · 五人自駕</p><h1>不用趕路，<br/><em>慢慢走就好。</em></h1><p className="hero-copy">一份把路線、風景和吃飯選擇都整理好的澎湖旅行手冊。今天想往哪裡，就從那裡開始。</p><SearchBox value={query} onChange={setQuery} onSubmit={()=>goExplore(query)}/><div className="hero-notice"><span>↗</span><p><strong>行前小提醒</strong>11 月東北季風強，店家與潮汐資訊請在出發前再次查證。</p></div></div>
    </section>

    <section className="tomorrow-callout"><div><p className="eyebrow">TOMORROW · 11/01</p><h2>摩西分海之後，兩種走法</h2><p>船班順利就去吉貝；海況不合就改走東環南環。兩案都留了昇恆昌購物時間。</p></div><a href="#/plans">查看兩套明日方案 <ArrowIcon/></a></section>

    <section className="section region-section"><div className="section-heading"><div><p className="eyebrow">CHOOSE A DIRECTION</p><h2>今天，想往哪邊走？</h2></div><a href="#/regions">查看全部區域 <ArrowIcon/></a></div><div className="region-grid">
      {itineraries.map((itinerary,index)=><a href={`#/region/${itinerary.id}`} className={`region-card ${itinerary.accent}`} key={itinerary.id}><span className="region-number">0{index+1}</span><div className="region-shape" aria-hidden="true"></div><div className="region-card-content"><p>{itinerary.eyebrow}</p><h3>{itinerary.name}</h3><span>{itinerary.summary}</span><strong>展開這條路線 <ArrowIcon/></strong></div></a>)}
    </div></section>

    <section className="section food-strip"><div><p className="eyebrow">EAT ALONG THE WAY</p><h2>走到哪，吃到哪</h2><p>正餐、小吃、甜點、咖啡與伴手禮都放在一起。海鮮餐廳照樣收錄，交給篩選決定；資料不足則誠實標記待查證。</p></div><div className="food-buttons"><button onClick={()=>quick({category:'正餐',diet:'有非海鮮選項'})}><span>飯</span>非海鮮正餐</button><button onClick={()=>quick({diet:'海鮮為主'})}><span>鮮</span>海鮮餐廳</button><button onClick={()=>quick({category:'小吃'})}><span>食</span>在地小吃</button><button onClick={()=>quick({category:'甜點'})}><span>甘</span>甜點飲品</button><button onClick={()=>quick({category:'咖啡廳'})}><span>珈</span>咖啡休息</button><button onClick={()=>quick({category:'伴手禮'})}><span>禮</span>伴手禮</button></div></section>

    <section className="section today-section"><div className="section-heading"><div><p className="eyebrow">TRIP AT A GLANCE</p><h2>出發前先知道</h2></div></div><div className="trip-grid"><div className="trip-panel"><span>旅</span><p>旅行時間</p><strong>{travelInfo.trip.date}</strong></div><div className="trip-panel"><span>人</span><p>同行人數</p><strong>{travelInfo.trip.people} · 慢旅行</strong></div><div className="trip-panel"><span>車</span><p>移動方式</p><strong>{travelInfo.trip.transport}</strong></div><a className="trip-panel link-panel" href="#/info"><span>風</span><p>天氣與潮汐</p><strong>查看官方資訊 <ArrowIcon/></strong></a></div></section>
  </main>
}

function Explore({ initialQuery='', initialFilters=blankFilters }) {
  const [query,setQuery]=useState(initialQuery)
  const [filters,setFilters]=useState({...blankFilters,...initialFilters})
  const results=useMemo(()=>allItems.filter(item=>{
    const condition=item.visitCondition
    const haystack=[item.name,item.category,item.region,item.description,item.diet,item.notes,...item.period,...item.environment,...(item.stores || []).map(store=>store.name),condition?.hours,condition?.closed,condition?.admission,condition?.booking].filter(Boolean).join(' ').toLowerCase()
    if(query.trim()&&!haystack.includes(query.trim().toLowerCase())) return false
    if(filters.region&&item.region!==filters.region) return false
    if(filters.category&&item.category!==filters.category) return false
    if(filters.diet&&item.diet!==filters.diet) return false
    if(filters.period&&!item.period.includes(filters.period)) return false
    if(filters.environment&&!item.environment.includes(filters.environment)) return false
    if(filters.bookingType&&condition?.bookingType!==filters.bookingType) return false
    if(filters.verificationStatus&&item.verificationStatus!==filters.verificationStatus) return false
    return true
  }),[query,filters])
  return <main className="page-main"><section className="page-intro"><p className="eyebrow">EXPLORE YOUR WAY</p><h1>找到現在想去的地方</h1><p>所有項目都是候選，依天氣、順路程度和大家當下的心情決定。</p><SearchBox compact value={query} onChange={setQuery}/></section><div className="explore-layout"><FilterPanel filters={filters} setFilters={setFilters} resultCount={results.length}/><section className="results"><div className="results-heading"><div><strong>{results.length}</strong><span>個候選地點</span></div><p>未查證資料不代表停業，請在出發前向官方或店家確認。</p></div>{results.length?<div className="card-grid">{results.map(item=><PlaceCard key={item.id} item={item}/>)}</div>:<div className="empty-state"><span>⌁</span><h2>沒有符合的候選</h2><p>試著縮短關鍵字，或清除部分篩選條件。</p></div>}</section></div></main>
}

function Regions() { return <main className="page-main"><section className="page-intro narrow"><p className="eyebrow">ONE REGION A DAY</p><h1>一天走一區，才有時間感受</h1><p>區域順序不固定。早上看風勢與潮汐，再選一條今天舒服的路。</p></section><section className="section regions-list">{itineraries.map((itinerary,index)=><a href={`#/region/${itinerary.id}`} className={`region-row ${itinerary.accent}`} key={itinerary.id}><span className="big-number">0{index+1}</span><div><p>{itinerary.eyebrow}</p><h2>{itinerary.name}</h2><span>{itinerary.summary}</span></div><strong>查看行程 <ArrowIcon/></strong></a>)}</section></main> }

function RegionPage({ id }) {
  const itinerary=itineraries.find(item=>item.id===id) || itineraries[0]
  const regionItems=allItems.filter(item=>item.region===itinerary.shortName || (itinerary.id==='huxi'&&item.region==='機場周邊'))
  const columns=[['上午候選',itinerary.morning],['午餐方向',itinerary.lunch],['下午候選',itinerary.afternoon],['小吃與咖啡',itinerary.snacks],['晚間安排',itinerary.evening]]
  return <main className={`page-main region-detail ${itinerary.accent}`}><section className="region-hero"><a href="#/regions">← 回到四大區域</a><p className="eyebrow">{itinerary.eyebrow}</p><h1>{itinerary.name}</h1><p>{itinerary.summary}</p><div className="route-line"><span>建議方向</span><strong>{itinerary.direction}</strong></div></section><section className="section schedule-section"><div className="schedule-grid">{columns.map(([title,items])=><article key={title}><p>{title}</p><ul>{items.map((item,i)=><li key={item}><span>{String(i+1).padStart(2,'0')}</span>{item}</li>)}</ul></article>)}</div><aside className="weather-plan"><span>風</span><div><strong>天氣備案</strong><p>{itinerary.badWeather}</p></div></aside></section><section className="section"><div className="section-heading"><div><p className="eyebrow">PLACES ON THIS ROUTE</p><h2>這一區的候選地點</h2></div></div><div className="card-grid">{regionItems.map(item=><PlaceCard key={item.id} item={item}/>)}</div></section></main>
}

function TomorrowPlans() {
  return <main className="page-main"><section className="page-intro plans-intro"><p className="eyebrow">TOMORROW · TWO OPTIONS</p><h1>{tomorrowPlans.title}</h1><p>{tomorrowPlans.date}｜{tomorrowPlans.summary}</p><div className="tide-facts"><div><span>乾潮</span><strong>{tomorrowPlans.tide.dryTime}</strong></div><div><span>安全通行參考</span><strong>{tomorrowPlans.tide.safeWindow}</strong></div><p>{tomorrowPlans.tide.arrivalAdvice}</p><a href={tomorrowPlans.tide.sourceUrl} target="_blank" rel="noreferrer">官方潮汐表 <ArrowIcon/></a></div></section>
    <section className="section plan-options"><div className="plans-guide"><div><p className="eyebrow">DECIDE IN THE MORNING</p><h2>先確認船，再選方案</h2></div><p>兩案 07:10–09:20 完全相同。只有吉貝船班與海況都確認沒問題時才選 A；否則直接走 B，不需要臨時重排行程。</p></div><div className="plan-columns">{tomorrowPlans.plans.map(plan=><article className={`day-plan ${plan.tone}`} key={plan.id}><header><div><span>{plan.label}</span><h2>{plan.title}</h2><p>{plan.description}</p></div><strong>{plan.status}</strong></header><div className="decision-note"><span>決定條件</span><p>{plan.decision}</p></div><ol className="day-timeline">{plan.schedule.map((stop,index)=><li className={`stop-${stop.kind}`} key={`${stop.time}-${stop.title}`}><time>{stop.time}</time><div><span>{String(index+1).padStart(2,'0')}</span><h3>{stop.title}</h3><p>{stop.detail}</p></div></li>)}</ol></article>)}</div></section>
    <section className="section shopping-brief"><div><p className="eyebrow">DUTY FREE STOP</p><h2>{tomorrowPlans.dutyFree.name}</h2><p>{tomorrowPlans.dutyFree.shoppingNote}</p></div><div><span>營業時間</span><strong>{tomorrowPlans.dutyFree.hours}</strong><a href={tomorrowPlans.dutyFree.sourceUrl} target="_blank" rel="noreferrer">查看官方資訊 <ArrowIcon/></a></div></section>
    <section className="section plan-sources"><p>資料查證：{tomorrowPlans.lastVerifiedAt}</p>{tomorrowPlans.sources.map(source=><a href={source.url} target="_blank" rel="noreferrer" key={source.url}>{source.label} ↗</a>)}</section></main>
}

function Info() {
  const namedConditions=visitConditions.items.map(condition=>({condition,place:places.find(place=>place.id===condition.placeId)})).filter(item=>item.place)
  return <main className="page-main"><section className="page-intro narrow"><p className="eyebrow">BEFORE YOU GO</p><h1>把變動留給風，把確認留給出發前</h1><p>會影響入場的開放時間、休館日、票價與預約規則集中在這裡；資料以 2026 年 10 月 30 日官方公告為準。</p></section>
    <section className="section conditions-section"><a className="campaign-banner" href={visitConditions.campaign.sourceUrl} target="_blank" rel="noreferrer"><span>本次適用</span><div><p>{visitConditions.campaign.period}</p><h2>{visitConditions.campaign.title}</h2><small>{visitConditions.campaign.summary}</small></div><ArrowIcon/></a><div className="conditions-heading"><div><p className="eyebrow">ENTRY CONDITIONS</p><h2>需要排時間的景點</h2></div><p>只收錄會影響能否進場或行程順序的條件；戶外開放空間仍以天候及現場封閉為準。</p></div><div className="conditions-grid">{namedConditions.map(({condition,place})=><article className="condition-card" key={condition.placeId}><div className="condition-title"><div><span>{place.region}</span><h3>{place.name}</h3></div><strong>{condition.badge}</strong></div><dl><div><dt>開放</dt><dd>{condition.hours}</dd></div><div><dt>休館／限制</dt><dd>{condition.closed}</dd></div><div><dt>費用</dt><dd>{condition.admission}</dd></div><div><dt>預約</dt><dd>{condition.booking}</dd></div></dl><a href={condition.sourceUrl} target="_blank" rel="noreferrer">查看官方來源 <ArrowIcon/></a></article>)}</div></section>
    <section className="section info-layout"><div><h2>旅行基本資訊</h2><dl className="facts">{Object.entries(travelInfo.trip).map(([key,value])=><div key={key}><dt>{{date:'日期',duration:'天數',people:'人數',transport:'交通',stay:'住宿'}[key]}</dt><dd>{value}</dd></div>)}</dl><h2>出發前確認清單</h2><ul className="reminder-list">{travelInfo.reminders.map((item,index)=><li key={item}><span>{index+1}</span>{item}</li>)}</ul></div><aside className="official-links"><p className="eyebrow">OFFICIAL LINKS</p><h2>官方資訊</h2>{travelInfo.links.map(link=><a href={link.url} target="_blank" rel="noreferrer" key={link.url}><div><strong>{link.label}</strong><span>{link.description}</span></div><ArrowIcon/></a>)}<div className="verify-note"><strong>資料標記原則</strong><p>以上條件已查到官方或場館第一方來源；臨時休館、天候封閉與票價異動仍以出發前公告為準。</p></div></aside></section></main>
}

function Footer() { return <footer><div><strong>島嶼慢慢走</strong><p>給五個人的澎湖自駕旅行手冊</p></div><p>所有行程皆為候選 · 安全與現場公告優先</p></footer> }

export default function App() {
  const route=useRoute()
  const [exploreSeed,setExploreSeed]=useState({query:'',filters:blankFilters,key:0})
  const goExplore=(query='',filters={})=>{setExploreSeed({query,filters,key:Date.now()});window.location.hash='/explore'}
  let content
  if(route.page==='explore') content=<Explore key={exploreSeed.key} initialQuery={exploreSeed.query} initialFilters={exploreSeed.filters}/>
  else if(route.page==='plans') content=<TomorrowPlans/>
  else if(route.page==='regions') content=<Regions/>
  else if(route.page==='region') content=<RegionPage id={route.id}/>
  else if(route.page==='info') content=<Info/>
  else content=<Home goExplore={goExplore}/>
  return <><Header route={route}/>{content}<Footer/></>
}
