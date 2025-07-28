


import ShowAllImages from '@/components/ShowAllImages';
import Form from './Form';
import { deletePuzzleImage, getAllPuzzleImages } from './action';

export default async function ImgUploadForm() {


    const allImgs = await getAllPuzzleImages()






    return (


        <div className="w-full  h-screen overflow-hidden overflow-y-auto bg-pink-50 px-4 flex items-center justify-center">
            <div className="bg-white rounded-3xl mt-[50px] shadow-lg p-6 xl:p-8 w-full max-w-7xl border border-rose-100 flex flex-col">
                <h1 className="text-3xl font-semibold text-rose-500 mb-6 text-center">
                    Upload Your Lovely Photo 💖
                </h1>
                <div className="flex gap-8 md:flex-row flex-col flex-1 min-h-0">
                    <div className=" w-full md:w-1/2 xl:w-1/3">
                        <Form />

                    </div>
                    <div className="w-full hidden md:inline-block md:w-1/2 xl:w-2/3 max-h-[600px] overflow-y-auto rounded-lg p-4">
                        {allImgs.length ? (

                            <ShowAllImages allImgs={allImgs} deleteImg={deletePuzzleImage} />
                        ) : (
                            <p className="text-center text-gray-500">No images uploaded yet.</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
