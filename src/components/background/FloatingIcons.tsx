'use client';

import { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faChartLine, faShieldHalved, faBolt, faCoins, faChartPie,
  faWallet, faCreditCard, faMoneyBillTrendUp, faCircleDollarToSlot,
  faHandHoldingDollar, faPiggyBank, faMoneyBillTransfer, faScaleBalanced,
  faArrowTrendUp, faChartColumn
} from '@fortawesome/free-solid-svg-icons';

// Define array of icons with their properties
// Each icon has a specific size and color from our Nordic theme
const icons = [
  { icon: faChartLine, size: '6xl', color: 'aurora-green' },
  { icon: faShieldHalved, size: '7xl', color: 'frost-blue' },
  { icon: faBolt, size: '5xl', color: 'northern-pink' },
  { icon: faCoins, size: '6xl', color: 'aurora-green' },
  { icon: faChartPie, size: '7xl', color: 'frost-blue' },
  { icon: faWallet, size: '5xl', color: 'northern-pink' },
  { icon: faCreditCard, size: '6xl', color: 'aurora-green' },
  { icon: faMoneyBillTrendUp, size: '7xl', color: 'frost-blue' },
  { icon: faCircleDollarToSlot, size: '5xl', color: 'northern-pink' },
  { icon: faHandHoldingDollar, size: '6xl', color: 'aurora-green' },
  { icon: faPiggyBank, size: '4xl', color: 'frost-blue' },
  { icon: faMoneyBillTransfer, size: '7xl', color: 'northern-pink' },
  { icon: faScaleBalanced, size: '5xl', color: 'aurora-green' },
  { icon: faArrowTrendUp, size: '6xl', color: 'frost-blue' },
  { icon: faChartColumn, size: '7xl', color: 'northern-pink' },
].map(icon => ({
  ...icon,
  // Add random initial positions for each icon
  initialX: Math.random() * 100, // Random percentage across viewport width
  initialY: Math.random() * 100, // Random percentage across viewport height
}));

export default function FloatingIcons() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const icons = document.querySelectorAll('.floating-icon');
    let animationFrames: number[] = [];

    icons.forEach((icon) => {
      // Much higher base speed
      const speed = 30 + Math.random() * 20; // Increased from 15 + 10
      const angle = Math.random() * Math.PI * 2;
      let x = Math.random() * window.innerWidth;
      let y = Math.random() * window.innerHeight;
      let dx = Math.cos(angle) * speed;
      let dy = Math.sin(angle) * speed;
      let rotation = 0;
      const rotationSpeed = (Math.random() - 0.5) * 15; // Increased rotation speed

      const animate = () => {
        const bounds = icon.getBoundingClientRect();
        
        // Check window boundaries and bounce
        if (x <= 0 || x + bounds.width >= window.innerWidth) {
          dx = -dx * 1.5; // Increased bounce speed
          x = x <= 0 ? 0 : window.innerWidth - bounds.width; // Keep within bounds
          rotation += (Math.random() - 0.5) * 180; // More dramatic spin on bounce
        }
        
        if (y <= 0 || y + bounds.height >= window.innerHeight) {
          dy = -dy * 1.5;
          y = y <= 0 ? 0 : window.innerHeight - bounds.height;
          rotation += (Math.random() - 0.5) * 180;
        }

        // Higher max speed
        const maxSpeed = 50;
        dx = Math.sign(dx) * Math.min(Math.abs(dx), maxSpeed);
        dy = Math.sign(dy) * Math.min(Math.abs(dy), maxSpeed);

        x += dx;
        y += dy;
        rotation += rotationSpeed;

        (icon as HTMLElement).style.transform = 
          `translate3d(${x}px, ${y}px, 0) rotate(${rotation}deg)`;

        const frame = requestAnimationFrame(animate);
        animationFrames.push(frame);
      };

      animate();
    });

    // Handle window resize
    const handleResize = () => {
      // Cancel existing animations
      animationFrames.forEach(frame => cancelAnimationFrame(frame));
      animationFrames = [];
      // Restart animations with new window dimensions
      icons.forEach(icon => {
        (icon as HTMLElement).style.transform = 'none';
      });
    };

    window.addEventListener('resize', handleResize);

    return () => {
      animationFrames.forEach(frame => cancelAnimationFrame(frame));
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Don't render anything until mounted (prevents hydration issues)
  if (!mounted) return null;

  return (
    // Container for all floating icons
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {icons.map((item, index) => (
        // Individual floating icon
        <div
          key={index}
          className={`floating-icon text-${item.color}/20 text-${item.size} absolute`}
          style={{
            left: `${item.initialX}%`,
            top: `${item.initialY}%`,
          }}
        >
          <FontAwesomeIcon icon={item.icon} />
        </div>
      ))}
    </div>
  );
} 