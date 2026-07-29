
import AfricaVisualization from "~/components/maurice/AfricaMap";
import Footer from "~/components/maurice/footer";
import Hero from "~/components/maurice/hero";
import Navbar from "~/components/maurice/navbar";
import ServicesPreview from "~/components/maurice/services";
import Stats from "~/components/maurice/stats";
import TrustedCompanies from "~/components/maurice/trustedcompanies";
import WhyUs from "~/components/maurice/whyus";

export default function LandingPage() {
    return (
        <main className="bg-[#050505] text-white overflow-x-hidden pt-8">
            <Navbar />

            <Hero />
            <AfricaVisualization />

            <TrustedCompanies />

            <Stats />

            <ServicesPreview />

            <WhyUs />

            <Footer />
        </main>
    );
}