
import type React from "react"
import PuzzleForm from "./PuzzleForm"
import { getAllPuzzleImages } from "../backend/puzzle/action"
import { PuzzleImages } from "@prisma/client"
export const revalidate = 60;
const gridSize = 4
const totalPieces = gridSize * gridSize

export default async function ImagePuzzle() {

    const images: PuzzleImages[] = await getAllPuzzleImages();


    return (
        <main className="min-h-screen bg-gradient-to-br from-purple-100 to-pink-100 text-gray-800 p-4 flex flex-col items-center space-y-8">
            <h1 className="text-4xl font-extrabold text-gray-800 tracking-tight text-center mt-8">
                Image Puzzle (Drag & Drop)
            </h1>



            <PuzzleForm totalPieces={totalPieces} gridSize={gridSize} PuzzleImgs={images} />
        </main>
    )
}
