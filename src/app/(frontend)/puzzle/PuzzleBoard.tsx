import PuzzlePiece from './PuzzlePiece'
import { Dispatch, SetStateAction } from 'react'

interface Props {
  totalPieces: number
  gridSize: number
  imageUrl: string
  puzzleBoard: (string | null)[]
  setPuzzleBoard: Dispatch<SetStateAction<(string | null)[]>>
  unplacedPieces: Set<string>
  setUnplacedPieces: Dispatch<SetStateAction<Set<string>>>
}

export default function PuzzleBoard({
  totalPieces,
  gridSize,
  imageUrl,
  puzzleBoard,
  setPuzzleBoard,
  unplacedPieces,
  setUnplacedPieces,
}: Props) {
  const allowDrop = (e: React.DragEvent<HTMLDivElement>) => e.preventDefault()

  const handleDrop = (e: React.DragEvent<HTMLDivElement>, index: number) => {
    e.preventDefault()
    const draggedId = e.dataTransfer.getData('text/plain')

    setPuzzleBoard((prev) => {
      const newBoard = [...prev]

      if (unplacedPieces.has(draggedId)) {
        setUnplacedPieces((prevSet) => {
          const newSet = new Set(prevSet)
          newSet.delete(draggedId)
          return newSet
        })
      } else {
        const fromIndex = newBoard.indexOf(draggedId)
        if (fromIndex !== -1) newBoard[fromIndex] = null
      }

      if (newBoard[index]) {
        setUnplacedPieces((prevSet) => new Set(prevSet).add(newBoard[index]!))
      }

      newBoard[index] = draggedId
      return newBoard
    })
  }

  return (
    <div className="flex-1 p-6 rounded-xl shadow-2xl bg-white/80 backdrop-blur-sm border border-gray-200">
      <h2 className="text-2xl font-semibold text-gray-700 mb-4">Puzzle Board</h2>
      <div className="grid grid-cols-4 aspect-square max-w-xl mx-auto p-2 rounded-lg bg-white/70 shadow-inner border border-gray-200">
        {Array.from({ length: totalPieces }).map((_, index) => (
          <div
            key={`drop${index + 1}`}
            id={`drop${index + 1}`}
            onDrop={(e) => handleDrop(e, index)}
            onDragOver={allowDrop}
            onDragEnter={(e) => e.currentTarget.classList.add('border-purple-500', 'bg-purple-50/20')}
            onDragLeave={(e) => e.currentTarget.classList.remove('border-purple-500', 'bg-purple-50/20')}
            className="border-dashed w-full border-gray-400 rounded-md aspect-square flex justify-center items-center bg-gray-50/50 transition-all duration-150 ease-in-out"
          >
            {puzzleBoard[index] ? (
              <PuzzlePiece id={puzzleBoard[index]!} imageUrl={imageUrl} gridSize={gridSize} />
            ) : (
              <span className="text-gray-300 text-sm select-none">Drop Here</span>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
