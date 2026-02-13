import gsap from 'gsap';

export const animations = {
  // Message animations
  messageEnter: (element: Element, delay = 0) => {
    return gsap.fromTo(
      element,
      { opacity: 0, y: 10 },
      { opacity: 1, y: 0, duration: 0.4, delay, ease: 'power2.out' },
    );
  },

  // Stagger animation for multiple elements
  staggerEnter: (elements: Element[], staggerAmount = 0.05) => {
    return gsap.fromTo(
      elements,
      { opacity: 0, y: 10 },
      { opacity: 1, y: 0, duration: 0.4, stagger: staggerAmount, ease: 'power2.out' },
    );
  },

  // Dialog animations
  dialogEnter: (overlayElement: Element, dialogElement: Element) => {
    const timeline = gsap.timeline();
    timeline.fromTo(
      overlayElement,
      { opacity: 0 },
      { opacity: 1, duration: 0.2 },
      0,
    );
    timeline.fromTo(
      dialogElement,
      { scale: 0.9, opacity: 0 },
      { scale: 1, opacity: 1, duration: 0.3, ease: 'back.out' },
      0,
    );
    return timeline;
  },

  // Sidebar animations
  sidebarSlideIn: (element: Element) => {
    return gsap.fromTo(
      element,
      { opacity: 0, x: -20 },
      { opacity: 1, x: 0, duration: 0.5, ease: 'power2.out' },
    );
  },

  // Button ripple effect
  buttonRipple: (element: Element, event: MouseEvent) => {
    const rect = (element as HTMLElement).getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const ripple = document.createElement('span');

    ripple.style.position = 'absolute';
    ripple.style.left = `${x}px`;
    ripple.style.top = `${y}px`;
    ripple.style.width = '0';
    ripple.style.height = '0';
    ripple.style.borderRadius = '50%';
    ripple.style.backgroundColor = 'rgba(255, 255, 255, 0.5)';
    ripple.style.pointerEvents = 'none';

    (element as HTMLElement).style.position = 'relative';
    (element as HTMLElement).style.overflow = 'hidden';
    (element as HTMLElement).appendChild(ripple);

    gsap.to(ripple, {
      width: '400px',
      height: '400px',
      opacity: 0,
      duration: 0.6,
      ease: 'power3.out',
      onComplete: () => {
        ripple.remove();
      },
    });
  },

  // Pulse animation
  pulse: (element: Element) => {
    return gsap.to(element, {
      scale: 1.05,
      yoyo: true,
      repeat: 1,
      duration: 0.4,
      ease: 'sine.inOut',
    });
  },

  // Shake animation
  shake: (element: Element) => {
    return gsap.to(element, {
      x: -5,
      yoyo: true,
      repeat: 5,
      duration: 0.1,
      ease: 'sine.inOut',
    });
  },

  // Bounce in animation
  bounceIn: (element: Element) => {
    return gsap.fromTo(
      element,
      { scale: 0, opacity: 0 },
      {
        scale: 1,
        opacity: 1,
        duration: 0.5,
        ease: 'elastic.out(1, 0.5)',
      },
    );
  },
};
