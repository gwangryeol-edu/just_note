import './shell.css'

const NAV_ITEMS = ['list', 'create', 'find']

function SideNav({ active, onSelect }) {
  return (
    <aside className="side-nav">
      <p className="side-nav-brand">jn.</p>
      <nav className="side-nav-list" aria-label="primary">
        {NAV_ITEMS.map((item) => {
          const isActive = active === item
          return (
            <button
              key={item}
              type="button"
              className={isActive ? 'side-nav-item is-active' : 'side-nav-item'}
              aria-current={isActive ? 'page' : undefined}
              onClick={onSelect?.[item]}
            >
              {item}
            </button>
          )
        })}
      </nav>
    </aside>
  )
}

export function AppShell({ active, onSelect, children }) {
  return (
    <div className="app-shell">
      <SideNav active={active} onSelect={onSelect} />
      {children}
    </div>
  )
}

export function CenterColumn({ children, columnRef, layout = 'single', label = 'note list' }) {
  const className = layout === 'stack' ? 'center-column is-stack' : 'center-column'
  return (
    <section ref={columnRef} className={className} aria-label={label}>
      {children}
    </section>
  )
}

export function DetailColumn({ children, label, scroll = false }) {
  return (
    <aside
      className={scroll ? 'detail-column is-scroll' : 'detail-column'}
      aria-label={label}
    >
      {children}
    </aside>
  )
}
