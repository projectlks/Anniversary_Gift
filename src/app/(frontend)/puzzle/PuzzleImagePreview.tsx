import Image from 'next/image'

interface Props {
  url: string
  onNext: () => void
}

export default function PuzzleImagePreview({ url, onNext }: Props) {
  return (
    <div className="mb-4">
      <button onClick={onNext}>Next Image</button>
      <Image
        src={url}
        width={600}
        height={600}
        alt="Puzzle Preview"
        className="rounded-lg shadow-md md:w-[400px] w-full"
        loading="lazy"
      />
    </div>
  )
}
