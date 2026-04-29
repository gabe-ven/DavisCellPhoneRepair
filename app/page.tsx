import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import TrustBar from "@/components/TrustBar";
import Services from "@/components/Services";
import WhyChooseUs from "@/components/WhyChooseUs";
import Reviews from "@/components/Reviews";
import ContactForm from "@/components/ContactForm";
import Footer from "@/components/Footer";
import MobileCallBar from "@/components/MobileCallBar";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <TrustBar />
        <Services />
        <WhyChooseUs />
        <Reviews />
        <ContactForm />
      </main>
      <Footer />
      <MobileCallBar />
    </>
  );
}
