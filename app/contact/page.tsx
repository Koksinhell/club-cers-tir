import { ContactForm } from "@/components/contact/contact-form"
import { ContactInfo } from "@/components/contact/contact-info"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Contact - ClubCersTir",
  description: "Contactez le club de tir ClubCersTir pour toute information ou demande d'adhésion.",
}

export default function ContactPage() {
  return (
    <div className="container py-12">
      <h1 className="text-3xl font-bold mb-8">Contact</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Formulaire de contact */}
        <div>
          <h2 className="text-2xl font-semibold mb-6">Envoyez-nous un message</h2>
          <ContactForm />
        </div>

        {/* Informations de contact */}
        <div>
          <h2 className="text-2xl font-semibold mb-6">Nos coordonnées</h2>
          <ContactInfo />
        </div>
      </div>
    </div>
  )
}

