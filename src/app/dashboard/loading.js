import loading from "@/images/loading.png"
import Image from "next/image";

export default function Loading() {
    return (
    <div className="relative h-full">
        <Image
          aria-hidden
          src={loading}
          alt="loading"
          layout="fill"
          className="object-cover"
        />
      </div>
    )
  }