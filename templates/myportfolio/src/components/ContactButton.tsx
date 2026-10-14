type ContactButtonProps = {
  className?: string;
};

export default function ContactButton({ className = '' }: ContactButtonProps) {
  return (
    <a
      href="#contact"
      className={`cta-gradient inline-block rounded-full text-white font-medium uppercase tracking-widest px-8 py-3 sm:px-10 sm:py-3.5 md:px-12 md:py-4 text-xs sm:text-sm md:text-base transition-transform duration-200 hover:scale-[1.03] ${className}`}
    >
      Contact Me
    </a>
  );
}
