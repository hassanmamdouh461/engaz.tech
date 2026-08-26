import { ContactForm } from "@/components/sections/ContactForm";
import { EcosystemDiagram } from "@/components/sections/EcosystemDiagram";
import { Hero } from "@/components/sections/Hero";
import { Partners } from "@/components/sections/Partners";
import { Pillars } from "@/components/sections/Pillars";
import { ProjectsGrid } from "@/components/sections/ProjectsGrid";
import { Services } from "@/components/sections/Services";
import { Stats } from "@/components/sections/Stats";

export default function HomePage() {
  return (
    <>
      <Hero />
      <Pillars />
      <Stats />
      <ProjectsGrid />
      <EcosystemDiagram />
      <Services />
      <Partners />
      <ContactForm />
    </>
  );
}
