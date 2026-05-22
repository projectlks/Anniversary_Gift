import PuzzlePiece from './PuzzlePiece'

interface Props {
  totalPieces: number
  gridSize: number
  imageUrl: string
  unplacedPieces: Set<string>
}

export default function PuzzlePieces({  gridSize, imageUrl, unplacedPieces }: Props) {
  return (
    <div className="flex-1 p-6 rounded-xl shadow-2xl bg-white/80 backdrop-blur-sm border border-gray-200">
      <h2 className="text-2xl font-semibold text-gray-700 mb-4">Pieces</h2>
      <div className="grid grid-cols-4 justify-center gap-2 min-h-[200px]">
        {Array.from(unplacedPieces).map((id) => (
          <PuzzlePiece key={id} id={id} imageUrl={imageUrl} gridSize={gridSize} />
        ))}
      </div>
    </div>
  )
}
