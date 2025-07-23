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
    const [url, setUrl] = useState(PuzzleImgs[0].imgUrl)

    const shuffleArray = useCallback((array: string[]) => {
        const newArray = [...array]
        for (let i = newArray.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1))
                ;[newArray[i], newArray[j]] = [newArray[j], newArray[i]]
        }
        return newArray
    }, [])

    useEffect(() => {
        const initialDraggableIds = Array.from({ length: totalPieces }, (_, i) => `drag${i + 1}`)
        setUnplacedPieces(new Set(shuffleArray(initialDraggableIds)))
        setPuzzleBoard(Array(totalPieces).fill(null))
    }, [shuffleArray, totalPieces])

    const checkComplete = useCallback(() => {
        let completed = true
        for (let i = 0; i < totalPieces; i++) {
            if (puzzleBoard[i] !== `drag${i + 1}`) {
                completed = false
                break
            }
        }
        if (completed) {
            console.log('Puzzle completed! 🎉')
        }
    }, [puzzleBoard])

    useEffect(() => {
        checkComplete()
    }, [puzzleBoard, checkComplete])

    const resetPuzzle = useCallback(() => {
        const initialDraggableIds = Array.from({ length: totalPieces }, (_, i) => `drag${i + 1}`)
        setUnplacedPieces(new Set(shuffleArray(initialDraggableIds)))
        setPuzzleBoard(Array(totalPieces).fill(null))
    }, [shuffleArray, totalPieces])

    return (
        <>
            <PuzzleImagePreview url={url} onNext={() => setUrl('2')} />

            <div className="flex flex-col lg:flex-row gap-8 w-full max-w-6xl">
                <PuzzlePieces
                    totalPieces={totalPieces}
                    gridSize={gridSize}
                    imageUrl={url}
                    unplacedPieces={unplacedPieces}
                />
                <PuzzleBoard
                    totalPieces={totalPieces}
                    gridSize={gridSize}
                    imageUrl={url}
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
