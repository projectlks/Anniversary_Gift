interface Props {
  id: string
  imageUrl: string
  gridSize: number
}

export default function PuzzlePiece({ id, imageUrl, gridSize }: Props) {
  const index = parseInt(id.replace('drag', '')) - 1
  const col = index % gridSize
  const row = Math.floor(index / gridSize)

  return (
    <div
      id={id}
      draggable
      onDragStart={(e) => e.dataTransfer.setData('text/plain', id)}
      className="w-full aspect-square rounded-md border-gray-300 cursor-grab overflow-hidden
        shadow-md hover:shadow-lg hover:border-purple-500 transition-all duration-200 ease-in-out"
      style={{
        backgroundImage: `url(${imageUrl})`,
        backgroundSize: `${gridSize * 100}% ${gridSize * 100}%`,
        backgroundPosition: `${(col / (gridSize - 1)) * 100}% ${(row / (gridSize - 1)) * 100}%`,
        backgroundRepeat: 'no-repeat',
      }}
    />
  )
}
