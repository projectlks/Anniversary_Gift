'use client'

import React, { useCallback, useEffect, useState } from 'react'
import { PuzzleImages } from '@prisma/client'
import PuzzleImagePreview from './PuzzleImagePreview'
import PuzzlePieces from './PuzzlePieces'
import PuzzleBoard from './PuzzleBoard'

interface Props {
  totalPieces: number
  gridSize: number
  PuzzleImgs: PuzzleImages[]
}

export default function PuzzleForm({ totalPieces, gridSize, PuzzleImgs }: Props) {
  const [puzzleBoard, setPuzzleBoard] = useState<(string | null)[]>(Array(totalPieces).fill(null))
  const [unplacedPieces, setUnplacedPieces] = useState<Set<string>>(new Set())
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  const currentImageUrl = PuzzleImgs[currentImageIndex]?.imgUrl ?? '/p.jpg'

  const shuffleArray = useCallback((array: string[]) => {
    const newArray = [...array]
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[newArray[i], newArray[j]] = [newArray[j], newArray[i]]
    }
    return newArray
  }, [])

  const resetPuzzle = useCallback(() => {
    const initialDraggableIds = Array.from({ length: totalPieces }, (_, i) => `drag${i + 1}`)
    setUnplacedPieces(new Set(shuffleArray(initialDraggableIds)))
    setPuzzleBoard(Array(totalPieces).fill(null))
  }, [shuffleArray, totalPieces])

  useEffect(() => {
    resetPuzzle()
  }, [resetPuzzle])

  useEffect(() => {
    setCurrentImageIndex(0)
  }, [PuzzleImgs])

  const checkComplete = useCallback(() => {
    let completed = true
    for (let i = 0; i < totalPieces; i++) {
      if (puzzleBoard[i] !== `drag${i + 1}`) {
        completed = false
        break
      }
    }
    if (completed) {
      console.log('Puzzle completed!')
    }
  }, [puzzleBoard, totalPieces])

  useEffect(() => {
    checkComplete()
  }, [checkComplete])

  const showNextImage = useCallback(() => {
    if (PuzzleImgs.length <= 1) return
    setCurrentImageIndex((prev) => (prev + 1) % PuzzleImgs.length)
    resetPuzzle()
  }, [PuzzleImgs.length, resetPuzzle])

  return (
    <>
      <PuzzleImagePreview url={currentImageUrl} onNext={showNextImage} />

      <div className="flex flex-col lg:flex-row gap-8 w-full max-w-6xl">
        <PuzzlePieces
          totalPieces={totalPieces}
          gridSize={gridSize}
          imageUrl={currentImageUrl}
          unplacedPieces={unplacedPieces}
        />
        <PuzzleBoard
          totalPieces={totalPieces}
          gridSize={gridSize}
          imageUrl={currentImageUrl}
          puzzleBoard={puzzleBoard}
          setPuzzleBoard={setPuzzleBoard}
          unplacedPieces={unplacedPieces}
          setUnplacedPieces={setUnplacedPieces}
        />
      </div>

      <button
        onClick={resetPuzzle}
        className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-full shadow-lg
        transition-all duration-300 ease-in-out transform hover:scale-105"
      >
        Reset Puzzle
      </button>
    </>
  )
}
