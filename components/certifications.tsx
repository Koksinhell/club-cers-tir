import Image from "next/image"

export function Certifications() {
  const certifications = [
    {
      id: "fftir",
      name: "Fédération Française de Tir",
      logo: "/images/logos/fftir.png",
    },
    {
      id: "ipsc",
      name: "International Practical Shooting Confederation",
      logo: "/images/logos/ipsc.png",
    },
    {
      id: "tsv",
      name: "Tir Sportif de Vitesse",
      logo: "/images/logos/tsv.png",
    },
    {
      id: "issf",
      name: "International Shooting Sport Federation",
      logo: "/images/logos/issf.png",
    },
  ]

  return (
    <div className="py-8 border-t">
      <div className="container">
        <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12">
          {certifications.map((cert) => (
            <div key={cert.id} className="flex flex-col items-center">
              <div className="relative w-16 h-16 md:w-20 md:h-20">
                <Image src={cert.logo || "/placeholder.svg"} alt={cert.name} fill className="object-contain" />
              </div>
              <p className="text-xs text-center text-muted-foreground mt-2">{cert.name}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

