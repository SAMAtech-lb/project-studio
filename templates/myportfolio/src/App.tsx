import HeroSection from './sections/HeroSection';
import MarqueeSection from './sections/MarqueeSection';
import AboutSection from './sections/AboutSection';
import ServicesSection from './sections/ServicesSection';
import TechSection from './sections/TechSection';
import ToolboxSection from './sections/ToolboxSection';
import BubblesSection from './sections/BubblesSection';
import ContactSection from './sections/ContactSection';
import ProjectsSection from './sections/ProjectsSection';

export default function App() {
  return (
    <main
      className="font-kanit"
      style={{ background: '#0C0C0C', overflowX: 'clip' }}
    >
      <HeroSection />
      <MarqueeSection />
      <AboutSection />
      <ServicesSection />
      <TechSection />
      <ToolboxSection />
      <BubblesSection />
      <ProjectsSection />
      <ContactSection />
    </main>
  );
}
