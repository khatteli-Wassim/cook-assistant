import { Mode } from '@/lib/api'

interface Props {
  onSelect: (mode: Mode) => void
  selected?: Mode
}

const modes = [
  { mode: 'meal_to_ingredients' as Mode, icon: '🍽️', label: 'I know the meal' },
  { mode: 'ingredients_to_meals' as Mode, icon: '🥕', label: 'I have ingredients' },
  { mode: 'propose_meal' as Mode, icon: '✨', label: 'Surprise me' },
]

export default function ModeChips({ onSelect, selected }: Props) {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 12 }}>
      {modes.map(({ mode, icon, label }) => (
        <button
          key={mode}
          onClick={() => onSelect(mode)}
          style={{
            padding: '8px 14px',
            borderRadius: 20,
            border: `1px solid ${selected === mode ? 'var(--accent)' : 'var(--border)'}`,
            background: selected === mode ? 'rgba(232,184,109,0.1)' : 'var(--surface2)',
            color: selected === mode ? 'var(--accent)' : 'var(--text)',
            fontSize: 13,
            fontFamily: "'DM Sans', sans-serif",
            cursor: 'pointer',
            display: 'flex', alignItems: 'center', gap: 6,
            transition: 'all 0.18s ease',
          }}
        >
          <span style={{ fontSize: 16 }}>{icon}</span>
          {label}
        </button>
      ))}
    </div>
  )
}