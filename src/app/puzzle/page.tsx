"use client"

import type React from "react"
import { useCallback, useState, useEffect } from "react"
import Image from "next/image"

const gridSize = 4
const totalPieces = gridSize * gridSize

// Puzzle image URL
const PUZZLE_IMAGE_URL = "/p.jpg"

export default function ImagePuzzle() {
    // State: An array representing the pieces in the drop zones.
    // puzzleBoard[i] = id of piece in dropZone i+1, or null if empty.
    const [puzzleBoard, setPuzzleBoard] = useState<(string | null)[]>(Array(totalPieces).fill(null))
    // State: A Set of pieces currently in the draggable area (not on the board).
    const [unplacedPieces, setUnplacedPieces] = useState<Set<string>>(new Set())

    // Function to shuffle an array
    const shuffleArray = useCallback((array: string[]) => {
        const newArray = [...array]
        for (let i = newArray.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1))
                ;[newArray[i], newArray[j]] = [newArray[j], newArray[i]]
        }
        return newArray
    }, [])

    // Initialize pieces on component mount
    useEffect(() => {
        const initialDraggableIds = Array.from({ length: totalPieces }, (_, i) => `drag${i + 1}`)
        setUnplacedPieces(new Set(shuffleArray(initialDraggableIds)))
        setPuzzleBoard(Array(totalPieces).fill(null)) // Ensure board is empty initially
    }, [shuffleArray])

    const allowDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault()
    }, [])

    const drag = useCallback((e: React.DragEvent<HTMLDivElement>) => {
        e.dataTransfer.setData("text/plain", e.currentTarget.id)
    }, [])

    const drop = useCallback(
        (e: React.DragEvent<HTMLDivElement>) => {
            e.preventDefault()
            const draggedId = e.dataTransfer.getData("text/plain") // e.g., "drag1"
            const dropZoneId = e.currentTarget.id // e.g., "drop1"
            const dropZoneIndex = Number.parseInt(dropZoneId.slice(4)) - 1

            setPuzzleBoard((prevPuzzleBoard) => {
                const newPuzzleBoard = [...prevPuzzleBoard]
                const pieceAlreadyInDropZone = newPuzzleBoard[dropZoneIndex]

                // 1. Remove dragged piece from its *previous* location
                if (unplacedPieces.has(draggedId)) {
                    setUnplacedPieces((prevUnplaced) => {
                        const updatedUnplaced = new Set(prevUnplaced)
                        updatedUnplaced.delete(draggedId)
                        return updatedUnplaced
                    })
                } else {
                    // It was in another drop zone, clear that spot
                    const draggedPieceCurrentIndex = newPuzzleBoard.indexOf(draggedId)
                    if (draggedPieceCurrentIndex !== -1) {
                        newPuzzleBoard[draggedPieceCurrentIndex] = null
                    }
                }

                // 2. If drop zone already had a piece, move it back to unplacedPieces
                if (pieceAlreadyInDropZone) {
                    setUnplacedPieces((prevUnplaced) => new Set(prevUnplaced).add(pieceAlreadyInDropZone))
                }

                // 3. Place dragged piece in the new drop zone
                newPuzzleBoard[dropZoneIndex] = draggedId

                return newPuzzleBoard
            })
        },
        [unplacedPieces],
    )

    const handleDragEnter = useCallback((e: React.DragEvent<HTMLDivElement>) => {
        e.currentTarget.classList.add("border-purple-500", "bg-purple-50/20")
    }, [])

    const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
        e.currentTarget.classList.remove("border-purple-500", "bg-purple-50/20")
    }, [])

    const checkComplete = useCallback(() => {
        let completed = true
        for (let i = 0; i < totalPieces; i++) {
            const expectedId = `drag${i + 1}`
            if (puzzleBoard[i] !== expectedId) {
                completed = false
                break
            }
        }
        if (completed) {
            console.log("Puzzle completed! 🎉")
        }
    }, [puzzleBoard])

    // Call checkComplete whenever puzzleBoard changes
    useEffect(() => {
        checkComplete()
    }, [puzzleBoard, checkComplete])

    const resetPuzzle = useCallback(() => {
        const initialDraggableIds = Array.from({ length: totalPieces }, (_, i) => `drag${i + 1}`)
        setUnplacedPieces(new Set(shuffleArray(initialDraggableIds)))
        setPuzzleBoard(Array(totalPieces).fill(null))
    }, [shuffleArray])


    const allPuzzlePieces = Array.from({ length: totalPieces }, (_, i) => {
        const id = `drag${i + 1}`
        const col = i % gridSize
        const row = Math.floor(i / gridSize)

        return (
            <div
                key={id}
                id={id}
                draggable
                onDragStart={drag}
                className="w-full aspect-square
                rounded-md  border-gray-300 cursor-grab overflow-hidden
                shadow-md hover:shadow-lg hover:border-purple-500
                transition-all duration-200 ease-in-out"
                style={{
                    backgroundImage: `url(${PUZZLE_IMAGE_URL})`,
                    backgroundSize: `${gridSize * 100}% ${gridSize * 100}%`, // Makes the image spread across all cells
                    backgroundPosition: `${(col / (gridSize - 1)) * 100}% ${(row / (gridSize - 1)) * 100}%`,
                    backgroundRepeat: "no-repeat",
                }}
            />
        )
    })


    return (
        <main className="min-h-screen bg-gradient-to-br from-purple-100 to-pink-100 text-gray-800 p-4 flex flex-col items-center space-y-8">
            <h1 className="text-4xl font-extrabold text-gray-800 tracking-tight text-center mt-8">
                Image Puzzle (Drag & Drop)
            </h1>

            <Image
                src={PUZZLE_IMAGE_URL}
                width={600}
                height={600}
                alt="Puzzle Preview"
                loading="lazy"
                className="rounded-lg shadow-md md:w-[400px] w-full "
            />





            <div className="flex flex-col lg:flex-row gap-8 w-full max-w-6xl">
                {/* Draggable Pieces */}
                <div className="flex-1 p-6 rounded-xl shadow-2xl bg-white/80 backdrop-blur-sm border border-gray-200">
                    <div className="p-0 mb-4">
                        <h2 className="text-2xl font-semibold text-gray-700">Pieces</h2>
                    </div>
                    <div className="p-0">
                        <div id="draggable-container" className="grid grid-cols-4 justify-center gap-2 min-h-[200px]">
                            {/* Render only unplaced pieces here */}
                            {Array.from(unplacedPieces).map((pieceId) =>
                                allPuzzlePieces.find((piece) => piece.props.id === pieceId)
                            )}
                        </div>
                    </div>
                </div>

                {/* Drop Zones */}
                <div className="flex-1 p-6 rounded-xl shadow-2xl bg-white/80 backdrop-blur-sm border border-gray-200">
                    <div className="p-0 mb-4">
                        <h2 className="text-2xl font-semibold text-gray-700">Puzzle Board</h2>
                    </div>
                    <div className="p-0">
                        <div
                            className="grid grid-cols-4   aspect-square max-w-xl mx-auto 
               p-2 rounded-lg bg-white/70 shadow-inner border border-gray-200"
                        >
                            {Array.from({ length: totalPieces }, (_, i) => `drop${i + 1}`).map((id, index) => (
                                <div
                                    key={id}
                                    id={id}
                                    onDrop={drop}
                                    onDragOver={allowDrop}
                                    onDragEnter={handleDragEnter}
                                    onDragLeave={handleDragLeave}
                                    className=" border-dashed w-full border-gray-400 rounded-md aspect-square
flex justify-center items-center              bg-gray-50/50
                 transition-all duration-150 ease-in-out"
                                >
                                    {/* Render piece if it's in this drop zone */}
                                    {puzzleBoard[index] ? (
                                        allPuzzlePieces.find((piece) => piece.props.id === puzzleBoard[index])
                                    ) : (
                                        <span className="text-gray-300 text-sm select-none">Drop Here</span>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <button
                onClick={resetPuzzle}
                className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-full shadow-lg
           transition-all duration-300 ease-in-out transform hover:scale-105"
            >
                Reset Puzzle
            </button>
        </main>
    )
}
