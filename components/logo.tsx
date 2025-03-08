import Image from "next/image"
import Link from "next/link"

interface LogoProps {
  className?: string
}

export function Logo({ className }: LogoProps) {
  return (
    <Link href="/" className={`flex items-center gap-2 ${className}`}>
      <div className="relative w-10 h-10">
        <Image src="/logo.svg" alt="ClubCersTir Logo" width={40} height={40} priority />
      </div>
      <span className="text-xl font-bold">ClubCersTir</span>
    </Link>
  )
}

