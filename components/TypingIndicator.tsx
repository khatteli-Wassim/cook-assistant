export default function TypingIndicator() {
  return (
    <div style={{
      display: 'flex', gap: 10, alignItems: 'flex-start',
      animation: 'fadeUp 0.3s ease',
    }}>
      <div style={{
        width: 32, height: 32, borderRadius: '50%',
        background: 'linear-gradient(135deg, var(--accent), var(--accent2))',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 16, flexShrink: 0,
      }}>🍳</div>

      <div>
        <div style={{ fontSize: 11, color: 'var(--muted)', marginBottom: 6, fontWeight: 500 }}>
          Chef AI • typing
        </div>
        <div style={{
          padding: '12px 16px',
          borderRadius: 16, borderTopLeftRadius: 4,
          background: 'var(--surface)',
          border: '1px solid var(--border)',
          display: 'flex', alignItems: 'center', gap: 4,
        }}>
          {[0, 1, 2].map(i => (
            <div key={i} style={{
              width: 6, height: 6, borderRadius: '50%',
              background: 'var(--muted)',
              animation: `bounce 1.2s infinite ${i * 0.2}s`,
            }} />
          ))}
        </div>
      </div>
    </div>
  )
}