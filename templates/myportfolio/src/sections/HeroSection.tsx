import FadeIn from '../components/FadeIn';
import Magnet from '../components/Magnet';
import ContactButton from '../components/ContactButton';
import portrait from '../assets/ahmad.png';

const NAV_LINKS = ['About', 'Price', 'Projects', 'Contact'];

export default function HeroSection() {
  return (
    <section
      id="top"
      className="h-screen w-full flex flex-col relative"
      style={{ background: '#0C0C0C', overflowX: 'clip' }}
    >
      <FadeIn as="nav" delay={0} y={-20}>
        {/* z-20: the hero heading is pulled up over this row and would otherwise
            sit on top of the links. */}
        <div className="relative z-20 flex justify-between items-center px-6 md:px-10 pt-6 md:pt-8">
          {NAV_LINKS.map((link) => (
            <a
              key={link}
              href={`#${link.toLowerCase()}`}
              className="text-[#D7E2EA] font-medium uppercase tracking-wider text-sm md:text-lg lg:text-[1.4rem] hover:opacity-70 transition-opacity duration-200"
            >
              {link}
            </a>
          ))}
        </div>
      </FadeIn>

      <div className="flex-1 flex flex-col justify-between relative">
        <div className="overflow-hidden w-full mt-6 sm:mt-4 md:-mt-5 pointer-events-none">
          <FadeIn delay={0.15} y={40}>
            {/* Sized so the longer name still fills the viewport edge to edge, the way
                the short one did -- the wrapper crops the slight overhang. */}
            <h1 className="hero-heading font-black uppercase tracking-tight leading-none whitespace-nowrap w-full text-[8vw] sm:text-[8.6vw] md:text-[9.2vw] lg:text-[9.8vw] text-center">
              Hi, i&apos;m Ahmad Ghzayel
            </h1>
          </FadeIn>
        </div>

        <Magnet
          padding={150}
          strength={3}
          activeTransition="transform 0.3s ease-out"
          inactiveTransition="transform 0.6s ease-in-out"
          className="absolute left-1/2 -translate-x-1/2 z-10 top-1/2 -translate-y-1/2 sm:top-auto sm:translate-y-0 sm:bottom-0 w-[280px] sm:w-[360px] md:w-[440px] lg:w-[520px]"
        >
          <FadeIn delay={0.6} y={30}>
            <img
              src={portrait}
              alt="Ahmad Ghzayel portrait"
              className="w-full h-auto block"
              draggable={false}
            />
          </FadeIn>
        </Magnet>

        <div className="flex justify-between items-end pb-7 sm:pb-8 md:pb-10 px-6 md:px-10 relative z-20">
          <FadeIn delay={0.35} y={20}>
            <p
              className="text-[#D7E2EA] font-light uppercase tracking-wide leading-snug max-w-[160px] sm:max-w-[220px] md:max-w-[260px]"
              style={{ fontSize: 'clamp(0.75rem, 1.4vw, 1.5rem)' }}
            >
              a 3d creator driven by crafting striking and unforgettable projects
            </p>
          </FadeIn>
          <FadeIn delay={0.5} y={20}>
            <ContactButton />
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
