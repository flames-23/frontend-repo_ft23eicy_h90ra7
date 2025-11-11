import { useState } from 'react'
import { Plus, Sparkles } from 'lucide-react'

export default function NoteComposer({ onCreate }) {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')

  const suggestTags = (text) => {
    const words = text.toLowerCase().split(/\W+/).filter(Boolean)
    const set = new Set(words)
    const candidates = ['ai','product','design','idea','task','meeting','thought','plan','research','code']
    return candidates.filter(c => set.has(c)).slice(0, 4)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!title.trim() || !content.trim()) return
    const tags = suggestTags(`${title} ${content}`)
    const colorPalette = ['#0ea5e9','#22c55e','#a78bfa','#f43f5e','#f59e0b','#14b8a6']
    const color = colorPalette[Math.floor(Math.random()*colorPalette.length)]
    onCreate({ title, content, tags, color })
    setTitle('')
    setContent('')
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-2xl border border-zinc-200 p-4 bg-white/60 backdrop-blur">
      <div className="flex gap-3 items-center mb-3">
        <div className="h-6 w-6 rounded-full" style={{ background: '#0ea5e9' }} />
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Titre de la note"
          className="flex-1 bg-transparent outline-none text-zinc-900 placeholder:text-zinc-400 text-sm"
        />
        <button type="button" className="px-2 py-1 rounded-full text-xs bg-zinc-100 text-zinc-600 flex items-center gap-1">
          <Sparkles className="h-3 w-3" /> IA
        </button>
      </div>
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Votre idée, tâche, inspiration..."
        rows={4}
        className="w-full bg-transparent outline-none text-zinc-700 placeholder:text-zinc-400 text-sm resize-none"
      />
      <div className="flex justify-end mt-3">
        <button type="submit" className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-black text-white text-sm hover:opacity-90">
          <Plus className="h-4 w-4" /> Ajouter
        </button>
      </div>
    </form>
  )
}
