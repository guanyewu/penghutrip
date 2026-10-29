import { SlidersIcon } from './Icons.jsx'

const groups = [
  ['region','區域',['馬公','北環','湖西','南環','機場周邊']],
  ['category','類型',['景點','正餐','小吃','甜點','咖啡廳','夜間活動']],
  ['diet','飲食',['有非海鮮選項','海鮮為主','食材待確認']],
  ['period','時段',['上午','中午','下午','晚上']],
  ['environment','環境',['室內','戶外','風大時不建議']],
  ['verificationStatus','營業資訊',['verified','unverified','seasonal']],
]
const labels = { verified:'已查證', unverified:'待查證', seasonal:'季節性營業' }

export default function FilterPanel({ filters, setFilters, resultCount }) {
  const activeCount = Object.values(filters).filter(Boolean).length
  const update = (key, value) => setFilters(current => ({...current, [key]: current[key] === value ? '' : value}))
  const clear = () => setFilters({region:'',category:'',diet:'',period:'',environment:'',verificationStatus:''})
  return <aside className="filter-panel">
    <div className="filter-heading"><div><SlidersIcon /><strong>篩選條件</strong>{activeCount > 0 && <span className="count-pill">{activeCount}</span>}</div><button onClick={clear} disabled={!activeCount}>清除全部</button></div>
    {groups.map(([key,title,options]) => <div className="filter-group" key={key}>
      <p>{title}</p><div className="filter-options">{options.map(option => <button key={option} className={filters[key] === option ? 'active' : ''} onClick={() => update(key, option)}>{labels[option] || option}</button>)}</div>
    </div>)}
    <div className="mobile-result-count">找到 {resultCount} 個候選</div>
  </aside>
}
