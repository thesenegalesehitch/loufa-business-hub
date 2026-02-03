import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';

interface VideoBackgroundProps {
  videoUrl?: string;
  fallbackImage?: string;
  overlay?: boolean;
  overlayOpacity?: number;
  children?: React.ReactNode;
  className?: string;
}

export function VideoBackground({
  videoUrl,
  fallbackImage,
  overlay = true,
  overlayOpacity = 0.5,
  children,
  className = '',
}: VideoBackgroundProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch(() => {
        // Autoplay might be blocked, that's ok
      });
    }
  }, []);

  const showVideo = videoUrl && !hasError;
  const showFallback = !showVideo && fallbackImage;

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {/* Video Layer */}
      {showVideo && (
        <motion.video
          ref={videoRef}
          initial={{ opacity: 0 }}
          animate={{ opacity: isLoaded ? 1 : 0 }}
          transition={{ duration: 0.5 }}
          className="absolute inset-0 w-full h-full object-cover"
          autoPlay
          muted
          loop
          playsInline
          onLoadedData={() => setIsLoaded(true)}
          onError={() => setHasError(true)}
        >
          <source src={videoUrl} type="video/mp4" />
        </motion.video>
      )}

      {/* Fallback Image */}
      {showFallback && (
        <div
          className="absolute inset-0 w-full h-full bg-cover bg-center"
          style={{ backgroundImage: `url(${fallbackImage})` }}
        />
      )}

      {/* Gradient Overlay */}
      {overlay && (
        <div 
          className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/40 to-background"
          style={{ opacity: overlayOpacity }}
        />
      )}

      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
}
