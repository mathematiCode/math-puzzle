import { useRef } from 'react';
import Player from 'lottie-react';

interface AnimatedLottieIconProps {
  animationData: object | string;
  size?: number | string;
  loop?: boolean;
  className?: string;
  isDisabled?: boolean;
}

const AnimatedLottieIcon = ({
  animationData,
  size = 46,
  loop = false,
  className = '',
  isDisabled = false,
}: AnimatedLottieIconProps) => {
  const playerRef = useRef<any>(null);
  const hoverTimeout = useRef<NodeJS.Timeout | null>(null);
  const isHovering = useRef(false);

  const handleMouseEnter = () => {
    if (isDisabled) return;
    isHovering.current = true;
    hoverTimeout.current = setTimeout(() => {
      if (isHovering.current && playerRef.current) {
        playerRef.current.stop();
        playerRef.current.play();
      }
    }, 180); // 150ms delay before playing animation
  };

  const handleMouseLeave = () => {
    isHovering.current = false;
    if (hoverTimeout.current) {
      clearTimeout(hoverTimeout.current);
      hoverTimeout.current = null;
    }
    if (playerRef.current) {
      playerRef.current.stop();
      playerRef.current.goToAndStop(0, true);
    }
  };

  const handleClick = () => {
    if (hoverTimeout.current) {
      clearTimeout(hoverTimeout.current);
      hoverTimeout.current = null;
    }
    if (playerRef.current) {
      playerRef.current.stop();
      playerRef.current.goToAndStop(0, true);
    }
  };

  return (
    <span
      className={className}
      style={{
        display: 'inline-block',
        width: size,
        height: size,
        filter: isDisabled ? 'grayscale(1) opacity(0.35)' : 'none',
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
    >
      <Player
        lottieRef={playerRef}
        autoplay={false}
        loop={false}
        animationData={animationData}
        style={{ width: size, height: size, transform: 'translateY(10px)' }}
      />
    </span>
  );
};

export default AnimatedLottieIcon;
