import RecipeCard from './RecipeCard'
import ModeChips from './ModeChips'
import { Mode } from '@/lib/api'

export interface MessageType {
  id: string
  role: 'bot' | 'user'
  text?: string
  showModeChips?: boolean
  chipsLocked?: boolean
  recipeData?: { data: any; intent: string }
  onModeSelect?: (mode: Mode) => void
  selectedMode?: Mode
}

interface Props {
  message: MessageType
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
          fontSize: 14, lineHeight: 1.6,
          background: isUser ? 'var(--user-bubble)' : 'var(--surface)',
          border: isUser ? '1px solid #2d5c44' : '1px solid var(--border)',
          color: isUser ? '#d4f0e0' : 'var(--text)',
        }}>
          {message.text && <div>{message.text}</div>}

          {message.showModeChips && !message.chipsLocked && (
            <ModeChips
              onSelect={message.onModeSelect!}
              selected={message.selectedMode}
            />
          )}

          {message.showModeChips && message.chipsLocked && message.selectedMode && (
            <div style={{
              marginTop: 10,
              display: 'inline-flex', alignItems: 'center', gap: 6,
              padding: '6px 12px',
              background: 'rgba(232,184,109,0.1)',
              border: '1px solid var(--accent)',
              borderRadius: 20, fontSize: 12, color: 'var(--accent)',
            }}>
              {message.selectedMode === 'meal_to_ingredients' && '🍽️ I know the meal'}
              {message.selectedMode === 'ingredients_to_meals' && '🥕 I have ingredients'}
              {message.selectedMode === 'propose_meal' && '✨ Surprise me'}
            </div>
          )}

          {message.recipeData && (
            <RecipeCard
              data={message.recipeData.data}
              intent={message.recipeData.intent}
            />
          )}
        </div>
      </div>
    </div>
  )
}