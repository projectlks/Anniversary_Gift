import React from 'react'
const PUZZLE_IMAGE_URL = "/p.jpg"

export default function page() {
    return (

        <>

            <div className="grid w-[1200px] bg-red-400  grid-cols-3">
                <div


                    className="w-[400px] aspect-square
          rounded-md border-2 border-gray-300 cursor-grab overflow-visible
          shadow-md hover:shadow-lg hover:border-purple-500
          transition-all duration-200 ease-in-out"
                    style={{
                        backgroundImage: `url(${PUZZLE_IMAGE_URL})`,
                        backgroundSize: `1200px 1200px`,
                        backgroundPosition: `0px 0px`,
                        backgroundRepeat: "no-repeat",
                    }}
                />
                <div


                    className="w-[400px] aspect-square
          rounded-md border-2 border-gray-300 cursor-grab overflow-visible
          shadow-md hover:shadow-lg hover:border-purple-500
          transition-all duration-200 ease-in-out"
                    style={{
                        backgroundImage: `url(${PUZZLE_IMAGE_URL})`,
                        backgroundSize: `1200px 1200px`,
                        backgroundPosition: `-400px 0px`,
                        backgroundRepeat: "no-repeat",
                    }}
                />

                <div


                    className="w-[400px] aspect-square
          rounded-md border-2 border-gray-300 cursor-grab overflow-visible
          shadow-md hover:shadow-lg hover:border-purple-500
          transition-all duration-200 ease-in-out"
                    style={{
                        backgroundImage: `url(${PUZZLE_IMAGE_URL})`,
                        backgroundSize: `1200px 1200px`,
                        backgroundPosition: `-800px 0px`,
                        backgroundRepeat: "no-repeat",
                    }}
                />

            </div>

            {/* <Image
                src={PUZZLE_IMAGE_URL}
                width={1200}
                height={1200}dsw2
                alt="Puzzle Preview"
                className="rounded-lg shadow-md"
            /> */}
        </>
    )
}
