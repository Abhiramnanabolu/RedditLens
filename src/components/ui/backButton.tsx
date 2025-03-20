import { ArrowLeft } from "lucide-react"
import { useRouter } from "next/navigation"

export function BackButton() {
  const router = useRouter()

  return (
    <button
      onClick={() => router.push("/")}
      className="flex items-center gap-2 pointer-cursor cursor-pointer px-4 py-2 mb-4 bg-[#272729] text-[#D7DADC] rounded-full text-sm font-medium hover:bg-[#343536] transition-colors border border-[#343536]"
    >
      <ArrowLeft className="w-4 h-4" />
      Back
    </button>
  )
}
