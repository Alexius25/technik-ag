import Header from "@/components/Header"
import Image from "next/image"

export default function Page() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Multiple pictures (16:9) in a row, scrolls horizontally (auto) */}
      <div className="mx-4 flex items-center justify-between gap-8 overflow-x-auto rounded-lg bg-accent px-8 py-4">
        <div className="relative aspect-[16/9] h-80 flex-shrink-0 rounded-lg bg-gray-200">
          <Image
            src="/main_image.jpg"
            alt="Picture 1"
            fill
            className="rounded-lg object-cover"
          />
        </div>

        <div className="relative aspect-[16/9] h-80 flex-shrink-0 rounded-lg bg-gray-200">
          <Image
            src="/main_image2.png"
            alt="Picture 2"
            fill
            className="rounded-lg object-cover"
          />
        </div>
      </div>
    </div>
  )
}
