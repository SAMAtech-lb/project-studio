import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import FadeIn from '../components/FadeIn';
import LiveProjectButton from '../components/LiveProjectButton';

type Project = {
  number: string;
  category: string;
  name: string;
  col1Top: string;
  col1Bottom: string;
  col2: string;
};

const PROJECTS: Project[] = [
  {
    number: '01',
    category: 'Client',
    name: 'Nextlevel Studio',
    col1Top:
      'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055344_5eff02e0-87a5-41ce-b64f-eb08da8f33db.png&w=1280&q=85',
    col1Bottom:
      'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055431_11d841fd-8b41-46a5-82e4-b04f2407a7d8.png&w=1280&q=85',
    col2:
      'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055451_e317bf2d-28d4-48cc-86b0-6f72f25b6327.png&w=1280&q=85',
  },
  {
    number: '02',
    category: 'Personal',
    name: 'Aura Brand Identity',
    col1Top:
      'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055654_911201c5-36d9-4bc6-bac7-331adfce159f.png&w=1280&q=85',
    col1Bottom:
      'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055723_5ceda0b8-d9c2-4665-b2e3-83ba19ba76d1.png&w=1280&q=85',
    col2:
      'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055753_adc5dcbd-a8e6-49c0-b43a-9b030d835cea.png&w=1280&q=85',
  },
  {
    number: '03',
    category: 'Client',
    name: 'Solaris Digital',
    col1Top:
      'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055759_963cfb0b-4bd1-4b0f-9d0a-09bd6cf95b2f.png&w=1280&q=85',
    col1Bottom:
      'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_060108_438f781a-9846-4dcc-89ab-c4e6cb830f5b.png&w=1280&q=85',
    col2:
      'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055818_9d062121-ad7e-46b9-999a-1a6a692ef1ee.png&w=1280&q=85',
  },
];

type ProjectCardProps = {
  project: Project;
  index: number;
  total: number;
  progress: ReturnType<typeof useScroll>['scrollYProgress'];
};

function ProjectCard({ project, index, total, progress }: ProjectCardProps) {
  // Every card pins at the same offset, so the next one slides up and fully covers it.
  // The outgoing card shrinks a little as that happens, which reads as depth in the stack.
  const targetScale = 1 - (total - 1 - index) * 0.04;
  const range = [index / total, 1];
  const scale = useTransform(progress, range, [1, targetScale]);

  return (
    <div className="sticky top-0 h-[100svh] flex items-center justify-center">
      <motion.article
        style={{ scale, background: '#0C0C0C' }}
        className="w-full h-[84svh] rounded-[40px] sm:rounded-[50px] md:rounded-[60px] border-2 border-[#D7E2EA] p-4 sm:p-6 md:p-8 flex flex-col gap-4 md:gap-6 origin-top overflow-hidden"
      >
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 md:gap-8 flex-shrink-0">
          <div className="flex items-center gap-4 sm:gap-6 md:gap-8 flex-1 min-w-0">
            <div
              className="hero-heading font-black leading-none flex-shrink-0"
              style={{ fontSize: 'clamp(3rem, 10vw, 140px)' }}
            >
              {project.number}
            </div>
            <div className="flex flex-col gap-1 sm:gap-2 min-w-0">
              <span className="text-[#D7E2EA]/60 uppercase tracking-widest text-xs sm:text-sm font-light">
                {project.category}
              </span>
              <h3
                className="text-[#D7E2EA] font-medium uppercase leading-tight truncate"
                style={{ fontSize: 'clamp(1rem, 2.2vw, 2.1rem)' }}
              >
                {project.name}
              </h3>
            </div>
          </div>
          <div className="flex-shrink-0">
            <LiveProjectButton />
          </div>
        </div>

        <div className="flex gap-3 sm:gap-4 md:gap-5 w-full flex-1 min-h-0">
          <div
            className="flex flex-col gap-3 sm:gap-4 md:gap-5 min-h-0"
            style={{ width: '40%' }}
          >
            <img
              src={project.col1Top}
              alt=""
              loading="lazy"
              className="w-full min-h-0 rounded-[40px] sm:rounded-[50px] md:rounded-[60px] object-cover"
              style={{ flex: '0 0 38%' }}
            />
            <img
              src={project.col1Bottom}
              alt=""
              loading="lazy"
              className="w-full flex-1 min-h-0 rounded-[40px] sm:rounded-[50px] md:rounded-[60px] object-cover"
            />
          </div>
          <div className="min-h-0" style={{ width: '60%' }}>
            <img
              src={project.col2}
              alt=""
              loading="lazy"
              className="w-full h-full rounded-[40px] sm:rounded-[50px] md:rounded-[60px] object-cover"
            />
          </div>
        </div>
      </motion.article>
    </div>
  );
}

export default function ProjectsSection() {
  const stackRef = useRef<HTMLDivElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: stackRef,
    offset: ['start start', 'end end'],
  });

  return (
    <section
      id="projects"
      className="w-full rounded-t-[40px] sm:rounded-t-[50px] md:rounded-t-[60px] -mt-10 sm:-mt-12 md:-mt-14 relative z-10 px-5 sm:px-8 md:px-10 pt-20 sm:pt-24 md:pt-32 pb-24"
      style={{ background: '#0C0C0C' }}
    >
      <FadeIn delay={0} y={40}>
        <h2
          className="hero-heading font-black uppercase text-center leading-none tracking-tight mb-16 sm:mb-20 md:mb-24"
          style={{ fontSize: 'clamp(3rem, 12vw, 160px)' }}
        >
          Project
        </h2>
      </FadeIn>

      {/* Sticky siblings inside one tall container: each card pins at top:0 for the rest
          of the stack, so the following card scrolls in over it. Past the last one,
          the page scrolls normally again. */}
      <div ref={stackRef} className="max-w-6xl mx-auto">
        {PROJECTS.map((project, i) => (
          <ProjectCard
            key={project.number}
            project={project}
            index={i}
            total={PROJECTS.length}
            progress={scrollYProgress}
          />
        ))}
        {/* Holds the last card in view for a beat before the stack releases. */}
        <div className="h-[18svh]" aria-hidden />
      </div>
    </section>
  );
}
