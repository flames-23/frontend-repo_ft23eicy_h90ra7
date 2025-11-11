import { Star } from 'lucide-react'

export default function NoteCard({ note, onToggleFavorite }) {
  return (
    <div className="group relative rounded-xl border border-zinc-200 bg-white/70 backdrop-blur p-4 hover:shadow-lg transition-shadow">
      <div className="absolute right-3 top-3">
        <button onClick={() => onToggleFavorite(note)} className="p-2 rounded-full hover:bg-zinc-100">
          <Star className={"h-5 w-5 " + (note.favorite ? 'text-amber-500 fill-amber-400' : 'text-zinc-400')} />
        </button>
      </div>
      <div className="h-1 w-12 rounded-full mb-3" style={{ background: note.color || '#0ea5e9' }} />
      <h3 className="text-lg font-medium text-zinc-900 mb-1">{note.title}</h3>
      <p className="text-sm text-zinc-600 line-clamp-3">{note.content}</p>
      {note.tags?.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {note.tags.map((t, i) => (
            <span key={i} className="text-[10px] px-2 py-0.5 rounded-full bg-zinc-100 text-zinc-600">#{t}</span>
          ))}
        </div>
      )}
    </div>
  )
}
