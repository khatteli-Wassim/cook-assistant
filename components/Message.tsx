export interface MessageType {
  id: string
  role: 'bot' | 'user'
  text?: string
  isStreaming?: boolean
}

interface Props {
  message: MessageType
}

function formatText(text: string) {
  return text.split('\n').map((line, i) => {
    const parts = line.split(/\*\*(.*?)\*\*/g)
    return (
      <span key={i}>
        {parts.map((part, j) =>
          j % 2 === 1
            ? <strong key={j} style={{ color: 'var(--accent)', fontWeight: 600 }}>{part}</strong>
            : part
        )}
        <br />
      </span>
    )
  })
}

export default function Message({ message }: Props) {
  const isUser = message.role === 'user'

  return (
    <div style={{
      display: 'flex',
      flexDirection: isUser ? 'row-reverse' : 'row',
      gap: 10, alignItems: 'flex-start',
      animation: 'fadeUp 0.3s ease',
    }}>
      <div style={{
        width: 32, height: 32, borderRadius: '50%',
        flexShrink: 0, display: 'flex',
        alignItems: 'center', justifyContent: 'center',
        fontSize: isUser ? 13 : 16, marginTop: 2,
        background: isUser
          ? 'var(--user-bubble)'
          : 'linear-gradient(135deg, var(--accent), var(--accent2))',
        border: isUser ? '1px solid #2d5c44' : 'none',
        color: isUser ? 'var(--green)' : 'inherit',
        fontWeight: isUser ? 600 : 400,
      }}>
        {isUser ? 'W' : '🍳'}
      </div>

      <div style={{ maxWidth: '80%' }}>
        <div style={{
          fontSize: 11, color: 'var(--muted)', marginBottom: 6,
          fontWeight: 500, textAlign: isUser ? 'right' : 'left',
        }}>
          {isUser ? 'You' : 'Chef AI'} • now
        </div>

        <div style={{
          padding: '12px 16px',
          borderRadius: 16,
          borderTopLeftRadius: isUser ? 16 : 4,
          borderTopRightRadius: isUser ? 4 : 16,
          fontSize: 14, lineHeight: 1.7,
          background: isUser ? 'var(--user-bubble)' : 'var(--surface)',
          border: isUser ? '1px solid #2d5c44' : '1px solid var(--border)',
          color: isUser ? '#d4f0e0' : 'var(--text)',
        }}>
          {message.text && (
            <div>
              {formatText(message.text)}
              {message.isStreaming && (
                <span style={{
                  display: 'inline-block',
                  width: 2, height: 14,
                  background: 'var(--accent)',
                  marginLeft: 2,
                  animation: 'pulse 0.8s infinite',
                  verticalAlign: 'middle',
                }} />
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
