import { ReactNode, useRef } from "react";
import { motion, useScroll, useTransform, useSpring, HTMLMotionProps, Variants } from "framer-motion";
import { cn } from "@/lib/utils";

/* -------------------------------------------------------------------------- */
/*                               ScrollProgress                               */
/* -------------------------------------------------------------------------- */
export function ScrollProgress({ className }: { className?: string }) {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <motion.div
      style={{ scaleX, transformOrigin: "0%" }}
      className={cn(
        "fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-indigo-500 to-teal-400 z-50 pointer-events-none shadow-[0_0_12px_rgba(99,102,241,0.5)]",
        className
      )}
    />
  );
}

/* -------------------------------------------------------------------------- */
/*                                ScrollReveal                                */
/* -------------------------------------------------------------------------- */
export interface ScrollRevealProps extends HTMLMotionProps<"div"> {
  children: ReactNode;
  direction?: "up" | "down" | "left" | "right" | "zoom" | "fade";
  delay?: number;
  duration?: number;
  distance?: number;
  threshold?: number;
  once?: boolean;
  className?: string;
}

export function ScrollReveal({
  children,
  direction = "up",
  delay = 0,
  duration = 0.6,
  distance = 30,
  threshold = 0.15,
  once = true,
  className,
  ...props
}: ScrollRevealProps) {
  const getInitialPosition = () => {
    switch (direction) {
      case "up":
        return { opacity: 0, y: distance, x: 0, scale: 1 };
      case "down":
        return { opacity: 0, y: -distance, x: 0, scale: 1 };
      case "left":
        return { opacity: 0, x: distance, y: 0, scale: 1 };
      case "right":
        return { opacity: 0, x: -distance, y: 0, scale: 1 };
      case "zoom":
        return { opacity: 0, scale: 0.92, x: 0, y: 0 };
      case "fade":
      default:
        return { opacity: 0, x: 0, y: 0, scale: 1 };
    }
  };

  return (
    <motion.div
      initial={getInitialPosition()}
      whileInView={{ opacity: 1, x: 0, y: 0, scale: 1 }}
      viewport={{ once, amount: threshold }}
      transition={{
        duration,
        delay,
        ease: [0.22, 1, 0.36, 1],
      }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
}

/* -------------------------------------------------------------------------- */
/*                        StaggerContainer & StaggerItem                      */
/* -------------------------------------------------------------------------- */
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: (staggerDelay: number = 0.08) => ({
    opacity: 1,
    transition: {
      staggerChildren: staggerDelay,
      delayChildren: 0.05,
    },
  }),
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 24, scale: 0.98 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.5,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

export interface StaggerContainerProps extends HTMLMotionProps<"div"> {
  children: ReactNode;
  staggerDelay?: number;
  threshold?: number;
  once?: boolean;
  className?: string;
}

export function StaggerContainer({
  children,
  staggerDelay = 0.08,
  threshold = 0.1,
  once = true,
  className,
  ...props
}: StaggerContainerProps) {
  return (
    <motion.div
      variants={containerVariants}
      custom={staggerDelay}
      initial="hidden"
      whileInView="visible"
      viewport={{ once, amount: threshold }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
}

export interface StaggerItemProps extends HTMLMotionProps<"div"> {
  children: ReactNode;
  className?: string;
}

export function StaggerItem({ children, className, ...props }: StaggerItemProps) {
  return (
    <motion.div variants={itemVariants} className={className} {...props}>
      {children}
    </motion.div>
  );
}

/* -------------------------------------------------------------------------- */
/*                               HeadingReveal                                */
/* -------------------------------------------------------------------------- */
export interface HeadingRevealProps {
  badge?: string;
  badgeIcon?: ReactNode;
  title: string | ReactNode;
  subtitle?: string | ReactNode;
  centered?: boolean;
  className?: string;
  cta?: ReactNode;
}

export function HeadingReveal({
  badge,
  badgeIcon,
  title,
  subtitle,
  centered = false,
  className,
  cta,
}: HeadingRevealProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-3",
        centered ? "items-center text-center max-w-3xl mx-auto" : "items-start",
        className
      )}
    >
      {badge && (
        <ScrollReveal direction="down" duration={0.4} delay={0.05}>
          <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-primary bg-primary/10 px-3.5 py-1 rounded-full border border-primary/20 shadow-2xs">
            {badgeIcon}
            <span>{badge}</span>
          </div>
        </ScrollReveal>
      )}

      <div className={cn("w-full flex", centered ? "justify-center" : "flex-col md:flex-row md:items-end justify-between gap-6")}>
        <div className={cn("space-y-2", centered ? "max-w-2xl" : "max-w-2xl")}>
          <ScrollReveal direction="up" duration={0.5} delay={0.1}>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
              {title}
            </h2>
          </ScrollReveal>

          {subtitle && (
            <ScrollReveal direction="up" duration={0.5} delay={0.18}>
              <p className="text-muted-foreground text-base sm:text-lg leading-relaxed">
                {subtitle}
              </p>
            </ScrollReveal>
          )}
        </div>

        {cta && (
          <ScrollReveal direction="left" duration={0.4} delay={0.2} className="shrink-0">
            {cta}
          </ScrollReveal>
        )}
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*                                FloatElement                                */
/* -------------------------------------------------------------------------- */
export interface FloatElementProps extends HTMLMotionProps<"div"> {
  children: ReactNode;
  duration?: number;
  amplitude?: number;
  className?: string;
}

export function FloatElement({
  children,
  duration = 4,
  amplitude = 8,
  className,
  ...props
}: FloatElementProps) {
  return (
    <motion.div
      animate={{
        y: [-amplitude, amplitude, -amplitude],
      }}
      transition={{
        duration,
        repeat: Infinity,
        ease: "easeInOut",
      }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
}

/* -------------------------------------------------------------------------- */
/*                              ParallaxElement                               */
/* -------------------------------------------------------------------------- */
export interface ParallaxElementProps {
  children: ReactNode;
  speed?: number; // e.g., -0.2 (slower) or 0.3
  className?: string;
  offset?: [number, number]; // [startOffset, endOffset] in px
}

export function ParallaxElement({
  children,
  speed = -0.15,
  offset,
  className,
}: ParallaxElementProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const range = offset || [speed * 80, -speed * 80];
  const y = useTransform(scrollYProgress, [0, 1], range);

  return (
    <div ref={ref} className={cn("relative overflow-hidden", className)}>
      <motion.div style={{ y }} className="w-full h-full">
        {children}
      </motion.div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*                             ParallaxBackground                             */
/* -------------------------------------------------------------------------- */
export interface ParallaxBackgroundProps {
  speed?: number;
  className?: string;
  children?: ReactNode;
}

export function ParallaxBackground({
  speed = 0.2,
  className,
  children,
}: ParallaxBackgroundProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], [`-${speed * 80}px`, `${speed * 80}px`]);

  return (
    <div ref={ref} className={cn("absolute inset-0 pointer-events-none overflow-hidden", className)}>
      <motion.div style={{ y }} className="w-full h-[120%] -top-[10%] absolute left-0">
        {children}
      </motion.div>
    </div>
  );
}


