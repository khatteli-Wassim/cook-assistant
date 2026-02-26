interface Props {
  data: {
    meal?: string
    name?: string
    ingredients?: string[]
    instructions?: string[]
    meals?: string[]
    descriptions?: string[]
  }
  intent: string
}

export default function RecipeCard({ data, intent }: Props) {
  if (intent === 'ingredients_to_meals') {
    const meals = data.meals || []
    const descriptions = data.descriptions || []
    return (
      <div style={{
        background: 'var(--surface)', border: '1px solid var(--border)',
        borderRadius: 14, overflow: 'hidden', marginTop: 8,
      }}>
        <div style={{ padding: '14px 16px' }}>
          <div style={{ fontSize: 11, fontWeight: 500, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: 10 }}>
            Meals you can make
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {meals.map((meal, i) => (
              <div key={i} style={{ display: 'flex', gap: 10, fontSize: 13, lineHeight: 1.5 }}>
                <div style={{
                  width: 22, height: 22, borderRadius: '50%',
                  background: 'rgba(232,184,109,0.15)',
                  border: '1px solid rgba(232,184,109,0.3)',
                  color: 'var(--accent)', fontSize: 11, fontWeight: 600,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0,
                }}>{i + 1}</div>
                <div>
                  <strong>{meal}</strong>
                  {descriptions[i] && <span style={{ color: 'var(--muted)' }}> — {descriptions[i]}</span>}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  const name = data.meal || data.name || 'Recipe'
  const ingredients = data.ingredients || []
  const instructions = data.instructions || []

  return (
    <div style={{
      background: 'var(--surface)', border: '1px solid var(--border)',
      borderRadius: 14, overflow: 'hidden', marginTop: 8,
    }}>
      <div style={{
        padding: '14px 16px',
        borderBottom: '1px solid var(--border)',
        background: 'linear-gradient(135deg, rgba(232,184,109,0.08), transparent)',
      }}>
        <div style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: 18, fontWeight: 600, color: 'var(--accent)',
        }}>🍽️ {name}</div>
      </div>

      <div style={{ padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: 14 }}>
        <div>
          <div style={{ fontSize: 11, fontWeight: 500, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: 8 }}>
            Ingredients
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {ingredients.map((ing, i) => (
              <span key={i} style={{
                padding: '4px 10px',
                background: 'var(--surface2)',
                border: '1px solid var(--border)',
                borderRadius: 20, fontSize: 12, color: 'var(--text)',
              }}>{ing}</span>
            ))}
          </div>
        </div>

        <div>
          <div style={{ fontSize: 11, fontWeight: 500, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: 8 }}>
            Instructions
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {instructions.map((step, i) => (
              <div key={i} style={{ display: 'flex', gap: 10, fontSize: 13, lineHeight: 1.5 }}>
                <div style={{
                  width: 22, height: 22, borderRadius: '50%',
                  background: 'rgba(232,184,109,0.15)',
                  border: '1px solid rgba(232,184,109,0.3)',
                  color: 'var(--accent)', fontSize: 11, fontWeight: 600,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0, marginTop: 1,
                }}>{i + 1}</div>
                <div>{step}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}