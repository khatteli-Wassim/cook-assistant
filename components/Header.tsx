export default function Header() {
  return (
    <header style={{
      position: 'relative',
      zIndex: 10,
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      padding: '16px 24px',
      borderBottom: '1px solid var(--border)',
      background: 'rgba(15,14,12,0.8)',
      backdropFilter: 'blur(12px)',
    }}>
      <div style={{
        width: 38, height: 38,
        background: 'linear-gradient(135deg, var(--accent), var(--accent2))',
        borderRadius: 10,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 20, flexShrink: 0,
      }}>🍳</div>

      <div>
        <h1 style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: 18, fontWeight: 600,
          color: 'var(--text)', lineHeight: 1,
        }}>What To Cook</h1>
        <p style={{ fontSize: 11, color: 'var(--muted)', marginTop: 2 }}>
          AI-powered kitchen assistant
        </p>
      </div>

      <div style={{
        marginLeft: 'auto',
        display: 'flex', alignItems: 'center', gap: 6,
        fontSize: 12, color: 'var(--green)',
      }}>
        <div style={{
          width: 7, height: 7, borderRadius: '50%',
          background: 'var(--green)',
          animation: 'pulse 2s infinite',
        }} />
        Online
      </div>
    </header>
  )
}