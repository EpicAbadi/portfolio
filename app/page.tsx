import { Nav } from "@/components/Nav";
import { Hero } from "@/components/Hero";
import { About } from "@/components/About";
import { Approach } from "@/components/Approach";
import { Focus } from "@/components/Focus";
import { Stack } from "@/components/Stack";
import { Projects } from "@/components/Projects";
import { Contact } from "@/components/Contact";
import { Footer } from "@/components/Footer";
import { PlexusBackground } from "@/components/PlexusBackground";

export default function Home() {
  return (
    <>
      {/* Fixed behind everything. The veil sits over it to push the mesh back. */}
      <PlexusBackground />
      <div className="plexus-veil" aria-hidden />

      <Nav />
      <main id="top">
        <Hero />
        <About />
        <Approach />
        <Focus />
        <Stack />
        <Projects />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
