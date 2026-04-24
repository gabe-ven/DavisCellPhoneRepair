import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Services from "@/components/Services";
import WhyChooseUs from "@/components/WhyChooseUs";
import Reviews from "@/components/Reviews";
import ContactForm from "@/components/ContactForm";
import MapEmbed from "@/components/MapEmbed";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Services />
        <WhyChooseUs />
        <Reviews />
        <ContactForm />
        <MapEmbed />
      </main>
      <Footer />
    </>
  );
}
