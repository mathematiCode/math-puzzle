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

  return (
    <span
      className={className}
      style={{
        display: 'inline-block',
        width: size,
        height: size,
        filter: isDisabled ? 'grayscale(1) opacity(0.35)' : 'none',
      }}
      onMouseEnter={() => {
        if (!isDisabled) {
          playerRef.current.stop();
          playerRef.current.play();
        }
      }}
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
