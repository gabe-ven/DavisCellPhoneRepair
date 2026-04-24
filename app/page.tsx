import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Services from "@/components/Services";
import WhyChooseUs from "@/components/WhyChooseUs";
import Reviews from "@/components/Reviews";
import ContactForm from "@/components/ContactForm";
import MapEmbed from "@/components/MapEmbed";
import Footer from "@/components/Footer";
import MobileCallBar from "@/components/MobileCallBar";

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="pb-20 md:pb-0">
        <Hero />
        <Services />
        <WhyChooseUs />
        <Reviews />
        <ContactForm />
        <MapEmbed />
      </main>
      <Footer />
      <MobileCallBar />
    </>
  );
}
