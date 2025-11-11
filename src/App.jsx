import { useEffect, useMemo, useState } from 'react'
import Hero3D from './components/Hero3D'
import NoteComposer from './components/NoteComposer'
import NoteCard from './components/NoteCard'
import { Search, Filter } from 'lucide-react'

const API = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

export default function App() {
  const [notes, setNotes] = useState([])
  const [query, setQuery] = useState('')
  const [filterFav, setFilterFav] = useState(false)

  const fetchNotes = async () => {
    const url = new URL(`${API}/api/notes`)
    if (filterFav) url.searchParams.set('favorite', 'true')
    const res = await fetch(url)
    const data = await res.json()
    setNotes(data)
  }

  useEffect(() => { fetchNotes() }, [filterFav])

  const onCreate = async (payload) => {
    const res = await fetch(`${API}/api/notes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
    const data = await res.json()
    setNotes((prev) => [data, ...prev])
  }

  const toggleFavorite = async (note) => {
    const res = await fetch(`${API}/api/notes/${note.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ favorite: !note.favorite })
    })
    const updated = await res.json()
    setNotes((prev) => prev.map(n => n.id === updated.id ? updated : n))
  }

  const filtered = useMemo(() => {
    if (!query.trim()) return notes
    const q = query.toLowerCase()
    return notes.filter(n =>
      n.title.toLowerCase().includes(q) ||
      n.content.toLowerCase().includes(q) ||
      (n.tags||[]).some(t => t.toLowerCase().includes(q))
    )
  }, [query, notes])

  return (
    <div className="min-h-screen bg-black text-zinc-900">
      {/* Full-bleed hero (no white margins) */}
      <Hero3D />

      {/* Content area */}
      <div className="bg-white text-zinc-900">
        <div className="mx-auto max-w-6xl px-4 py-10 space-y-8">
          <div className="flex flex-col md:flex-row md:items-center gap-3 justify-between">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Rechercher des notes..."
                className="w-full pl-10 pr-3 py-2 rounded-xl border border-zinc-200 bg-white/70 backdrop-blur outline-none text-sm"
              />
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setFilterFav(v => !v)}
                className={`px-3 py-2 rounded-xl border text-sm transition-colors ${filterFav ? 'border-amber-300 bg-amber-50 text-amber-700' : 'border-zinc-200 text-zinc-600'}`}
              >
                <Filter className="inline h-4 w-4 mr-2" /> Favoris
              </button>
            </div>
          </div>

          <NoteComposer onCreate={onCreate} />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map(n => (
              <NoteCard key={n.id} note={n} onToggleFavorite={toggleFavorite} />
            ))}
            {filtered.length === 0 && (
              <div className="col-span-full text-center text-zinc-500 py-8">Aucune note pour le moment. Créez votre première ✨</div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
