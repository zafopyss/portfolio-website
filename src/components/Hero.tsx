import { motion } from 'motion/react';
import { useLocale } from '../content/useLocale';
import Arrow from './Arrow';
import Backdrop from './Backdrop';
import { scrollToSection } from './scrollToSection';

const rise = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0 },
};

export default function Hero() {
  const { hero } = useLocale().content;
  return (
    <section className="hero" aria-labelledby="hero-heading">
      <Backdrop />
      <div className="hero-shade" aria-hidden="true" />
      <motion.div
        className="lang-fade relative z-10 max-w-[1000px] px-[5%] pb-32 pt-[clamp(150px,22vh,240px)] text-white"
        initial="hidden"
        animate="show"
        transition={{ staggerChildren: 0.12, delayChildren: 0.15 }}
      >
        <motion.p variants={rise} className="eyebrow mb-6 text-white/85">
          {hero.eyebrow}
        </motion.p>
        <motion.h1
          id="hero-heading"
          variants={rise}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="mb-6 max-w-[14ch] text-[clamp(2.6rem,6vw,5.4rem)] font-semibold leading-[1.04] tracking-[-0.04em] [text-shadow:0_2px_24px_rgba(6,40,58,0.25)]"
        >
          {hero.title}
        </motion.h1>
        <motion.p variants={rise} className="mb-9 max-w-[46ch] text-[1.0625rem] leading-relaxed text-white/90">
          {hero.description}
        </motion.p>
        <motion.div variants={rise}>
          <a href="#work" onClick={(event) => scrollToSection(event, 'work')} className="btn btn-light">
            {hero.cta}
            <Arrow down />
          </a>
        </motion.div>
      </motion.div>
    </section>
  );
}
