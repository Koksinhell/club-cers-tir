import { HeroSection } from "@/components/hero-section"
import { LatestNews } from "@/components/latest-news"
import { EventCalendar } from "@/components/event-calendar"
import { AboutClub } from "@/components/about-club"
import { OnlineMembers } from "@/components/online-members"
import { DisciplinesSection } from "@/components/disciplines-section"
import { EquipmentSection } from "@/components/equipment-section"

export default async function Home() {
  return (
    <div>
      <HeroSection />

      <DisciplinesSection />

      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <LatestNews />
            <AboutClub className="mt-12" />
          </div>
          <div className="space-y-8">
            <OnlineMembers />
            <EventCalendar />
          </div>
        </div>
      </div>

      <EquipmentSection />
    </div>
  )
}

