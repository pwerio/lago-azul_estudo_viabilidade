import LeadRegistrationForm from "@/components/lead-registration-form"
import Slideshow from "@/components/slideshow"
import Image from "next/image"

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-6 md:py-12">
        <div className="mb-6">
          <Image
            src="/images/skan-hous-logo.png"
            alt="SKAN HOUS Incorporadora"
            width={200}
            height={60}
            className="object-contain"
          />
        </div>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          <div className="bg-white rounded-xl shadow-sm p-6 md:p-8">
            <LeadRegistrationForm />
          </div>
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <Slideshow />
          </div>
        </div>
      </div>
    </main>
  )
}
