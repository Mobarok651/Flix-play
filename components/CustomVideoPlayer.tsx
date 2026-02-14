import React, { useRef, useState, useEffect, useCallback } from 'react';
import { 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  Maximize, 
  Minimize, 
  SkipForward, 
  ExternalLink, 
  AlertTriangle,
  RotateCcw,
  RotateCw,
  Loader2,
  Settings
} from 'lucide-react';
import { Video, AdConfig, PlayerSettings } from '../types';

interface CustomVideoPlayerProps {
  video: Video;
  autoPlay?: boolean;
  settings?: PlayerSettings;
}

export const CustomVideoPlayer: React.FC<CustomVideoPlayerProps> = ({ 
  video, 
  autoPlay = false,
  settings = { 
    primaryColor: '#ef4444', 
    logoUrl: '', 
    logoPosition: 'top-right', 
    logoOpacity: 0.8,
    autoPlay: false 
  }
}) => {
  const videoContainerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const adVideoRef = useRef<HTMLVideoElement>(null);
  
  // State
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [buffered, setBuffered] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showControls, setShowControls] = useState(true);
  const [hasError, setHasError] = useState(false);
  
  // Ad State
  const [currentAd, setCurrentAd] = useState<AdConfig | null>(null);
  const [adTimeLeft, setAdTimeLeft] = useState(0);
  const [canSkip, setCanSkip] = useState(false);
  const [adsPlayed, setAdsPlayed] = useState<string[]>([]);
  
  const controlsTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Initial Autoplay check
  useEffect(() => {
    if (autoPlay || settings.autoPlay) {
      setIsPlaying(true);
    }
  }, [autoPlay, settings.autoPlay]);

  // Handle Mouse Movement to show/hide controls
  const handleMouseMove = () => {
    setShowControls(true);
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current);
    }
    if (isPlaying) {
      controlsTimeoutRef.current = setTimeout(() => {
        setShowControls(false);
      }, 3000);
    }
  };

  const handleMouseLeave = () => {
    if (isPlaying) {
      setShowControls(false);
    }
  };

  // Video Event Handlers
  const handleTimeUpdate = () => {
    if (videoRef.current && !currentAd) {
      const time = videoRef.current.currentTime;
      setCurrentTime(time);
      
      // Update Buffer
      if (videoRef.current.buffered.length > 0) {
        setBuffered(videoRef.current.buffered.end(videoRef.current.buffered.length - 1));
      }

      // Check for ads
      const adToPlay = video.ads.find(ad => 
        Math.abs(ad.startTime - time) < 1 && 
        !adsPlayed.includes(ad.id)
      );

      if (adToPlay) {
        startAd(adToPlay);
      }
    }
  };

  const handleWaiting = () => setIsLoading(true);
  const handleCanPlay = () => setIsLoading(false);
  
  const handleLoadedMetadata = () => {
    setHasError(false);
    setIsLoading(false);
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
      if (isPlaying) videoRef.current.play().catch(() => setIsPlaying(false));
    }
  };

  // Ad Logic
  const startAd = (ad: AdConfig) => {
    if (videoRef.current) videoRef.current.pause();
    setCurrentAd(ad);
    setAdTimeLeft(ad.duration);
    setCanSkip(false);
    setAdsPlayed(prev => [...prev, ad.id]);
    setIsPlaying(true); 
    setShowControls(true);
  };

  const handleAdEnded = () => {
    setCurrentAd(null);
    if (videoRef.current) {
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

  const skipAd = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (currentAd?.redirectUrl) {
       window.open(currentAd.redirectUrl, '_blank');
    }
    handleAdEnded();
  };

  // Ad Timer
  useEffect(() => {
    let interval: any;
    if (currentAd) {
      interval = setInterval(() => {
        setAdTimeLeft((prev) => {
          const newValue = prev - 1;
          const timeElapsed = currentAd.duration - newValue;
          if (timeElapsed >= currentAd.skipAfter) setCanSkip(true);
          if (newValue <= 0) {
            handleAdEnded();
            return 0;
          }
          return newValue;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [currentAd]);

  // Controls Logic
  const togglePlay = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (hasError) return;
    
    if (currentAd) {
       if (adVideoRef.current) {
         if (adVideoRef.current.paused) adVideoRef.current.play();
         else adVideoRef.current.pause();
       }
    } else {
      if (videoRef.current) {
        if (isPlaying) {
          videoRef.current.pause();
          setIsPlaying(false);
          setShowControls(true);
        } else {
          videoRef.current.play();
          setIsPlaying(true);
        }
      }
    }
  };

  const skipForward = (seconds: number) => {
    if (videoRef.current) {
      videoRef.current.currentTime = Math.min(videoRef.current.currentTime + seconds, duration);
      handleMouseMove();
    }
  };

  const skipBackward = (seconds: number) => {
    if (videoRef.current) {
      videoRef.current.currentTime = Math.max(videoRef.current.currentTime - seconds, 0);
      handleMouseMove();
    }
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    if (progressBarRef.current && videoRef.current) {
      const rect = progressBarRef.current.getBoundingClientRect();
      const pos = (e.clientX - rect.left) / rect.width;
      videoRef.current.currentTime = pos * duration;
    }
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      videoContainerRef.current?.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  // Branding
  const primaryColor = settings.primaryColor || '#ef4444';
  const getLogoStyle = () => {
    const base: React.CSSProperties = { position: 'absolute', zIndex: 40, maxHeight: '40px', maxWidth: '120px', opacity: settings.logoOpacity };
    switch (settings.logoPosition) {
      case 'top-left': return { ...base, top: '24px', left: '24px' };
      case 'bottom-left': return { ...base, bottom: '80px', left: '24px' };
      case 'bottom-right': return { ...base, bottom: '80px', right: '24px' };
      default: return { ...base, top: '24px', right: '24px' }; // top-right
    }
  };

  return (
    <div 
      ref={videoContainerRef}
      className="relative w-full aspect-video bg-black group overflow-hidden select-none font-sans shadow-2xl rounded-lg"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onContextMenu={(e) => e.preventDefault()} // Anti-download: Disable Right Click
    >
      
      {/* 1. Branding Watermark */}
      {settings.logoUrl && !currentAd && (
        <img src={settings.logoUrl} alt="Watermark" style={getLogoStyle()} className="pointer-events-none transition-opacity duration-300" />
      )}

      {/* 2. Main Video Engine */}
      <video
        ref={videoRef}
        src={video.url}
        className="w-full h-full object-contain"
        onTimeUpdate={handleTimeUpdate}
        onWaiting={handleWaiting}
        onCanPlay={handleCanPlay}
        onLoadedMetadata={handleLoadedMetadata}
        onError={() => { setHasError(true); setIsLoading(false); }}
        onEnded={() => { setIsPlaying(false); setShowControls(true); }}
        poster={video.thumbnail}
        onClick={togglePlay}
        playsInline
      />
      
      {/* 3. Buffering / Loading Spinner */}
      {isLoading && !hasError && (
        <div className="absolute inset-0 flex items-center justify-center z-30 pointer-events-none">
          <Loader2 className="animate-spin text-white w-12 h-12" />
        </div>
      )}

      {/* 4. Center Play/Pause Animation (Large) */}
      {!isLoading && !currentAd && !hasError && (
        <div 
           className={`absolute inset-0 flex items-center justify-center z-20 pointer-events-none transition-opacity duration-300 ${!isPlaying ? 'opacity-100' : 'opacity-0'}`}
        >
           <div className="bg-black/50 p-6 rounded-full backdrop-blur-sm">
              <Play className="text-white fill-white translate-x-1" size={48} />
           </div>
        </div>
      )}

      {/* 5. Error Overlay */}
      {hasError && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-zinc-900 z-50">
          <AlertTriangle className="text-red-500 mb-4" size={48} />
          <h3 className="text-white font-bold text-lg mb-2">Playback Error</h3>
          <p className="text-gray-400 text-sm">The video cannot be played.</p>
        </div>
      )}

      {/* 6. Ad Overlay System */}
      {currentAd && (
        <div className="absolute inset-0 z-50 bg-black flex flex-col items-center justify-center">
            {/* Ad Video */}
            <video
              ref={adVideoRef}
              src={currentAd.videoSrc}
              autoPlay
              className="w-full h-full object-contain cursor-pointer"
              onClick={() => { if(currentAd.redirectUrl) window.open(currentAd.redirectUrl, '_blank'); }}
            />
            {/* Ad UI Elements */}
            <div className="absolute top-6 left-6 bg-yellow-400 text-black px-3 py-1 text-xs font-bold rounded shadow-lg uppercase tracking-wider">
              Ad · {adTimeLeft}s
            </div>
            
            <div className="absolute bottom-12 right-12">
               {canSkip ? (
                 <button onClick={skipAd} className="flex items-center gap-2 bg-white text-black px-6 py-3 rounded hover:bg-gray-200 transition font-bold text-sm shadow-xl">
                   Skip <SkipForward size={16} fill="black" />
                 </button>
               ) : (
                 <div className="bg-black/60 text-white px-6 py-3 rounded backdrop-blur text-sm font-medium border border-white/10">
                   Skip in {Math.max(0, currentAd.skipAfter - (currentAd.duration - adTimeLeft))}s
                 </div>
               )}
            </div>
            
            <div 
              className="absolute bottom-12 left-12 bg-black/60 text-white px-4 py-2 rounded flex items-center gap-2 cursor-pointer hover:bg-black/80 transition border border-white/10"
              onClick={() => { if(currentAd.redirectUrl) window.open(currentAd.redirectUrl, '_blank'); }}
            >
              <ExternalLink size={16} /> <span className="text-sm font-medium">Visit Advertiser</span>
            </div>
        </div>
      )}

      {/* 7. Pro Control Bar */}
      {!currentAd && !hasError && (
        <div 
          className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black via-black/80 to-transparent pt-20 pb-4 px-4 transition-opacity duration-300 z-40 flex flex-col gap-2 ${showControls ? 'opacity-100' : 'opacity-0'}`}
        >
          {/* Progress Bar (Scrubber) */}
          <div 
            className="group/scrubber relative w-full h-1 bg-white/30 rounded-full cursor-pointer touch-none hover:h-2 transition-all duration-200"
            ref={progressBarRef}
            onClick={handleSeek}
          >
             {/* Buffered Bar */}
             <div 
               className="absolute top-0 left-0 h-full bg-white/40 rounded-full pointer-events-none" 
               style={{ width: `${(buffered / duration) * 100}%` }}
             />
             {/* Played Bar */}
             <div 
               className="absolute top-0 left-0 h-full rounded-full pointer-events-none" 
               style={{ width: `${(currentTime / duration) * 100}%`, backgroundColor: primaryColor }}
             >
                {/* Scrubber Knob */}
                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow scale-0 group-hover/scrubber:scale-100 transition-transform" />
             </div>
             
             {/* Ad Markers on Progress Bar */}
             {video.ads.map(ad => (
               <div 
                 key={ad.id}
                 className="absolute top-0 w-1 h-full bg-yellow-400 z-10 pointer-events-none"
                 style={{ left: `${(ad.startTime / duration) * 100}%` }}
               />
             ))}
          </div>

          {/* Controls Row */}
          <div className="flex items-center justify-between mt-2">
             
             {/* Left Controls */}
             <div className="flex items-center gap-4">
                <button onClick={togglePlay} className="text-white hover:text-white/80 transition transform active:scale-95">
                   {isPlaying ? <Pause size={28} fill="white" /> : <Play size={28} fill="white" />}
                </button>
                
                <div className="flex items-center gap-2">
                   <button onClick={() => skipBackward(5)} className="text-white/80 hover:text-white transition p-1.5 rounded-full hover:bg-white/10" title="-5s">
                      <RotateCcw size={20} />
                   </button>
                   <button onClick={() => skipForward(5)} className="text-white/80 hover:text-white transition p-1.5 rounded-full hover:bg-white/10" title="+5s">
                      <RotateCw size={20} />
                   </button>
                </div>

                <div className="flex items-center gap-2 group/volume">
                   <button onClick={() => { setIsMuted(!isMuted); if(videoRef.current) videoRef.current.muted = !isMuted; }} className="text-white hover:text-white/80">
                      {isMuted || volume === 0 ? <VolumeX size={24} /> : <Volume2 size={24} />}
                   </button>
                   <input 
                      type="range" min="0" max="1" step="0.1"
                      value={isMuted ? 0 : volume}
                      onChange={(e) => { 
                         const val = parseFloat(e.target.value); 
                         setVolume(val); 
                         if(videoRef.current) { videoRef.current.volume = val; videoRef.current.muted = false; setIsMuted(false); }
                      }}
                      className="w-0 group-hover/volume:w-20 transition-all duration-300 h-1 bg-white/30 rounded-lg appearance-none cursor-pointer accent-white"
                   />
                </div>

                <div className="text-sm font-medium text-white/90 font-mono tracking-wide">
                   {formatTime(currentTime)} <span className="text-white/50">/</span> {formatTime(duration)}
                </div>
             </div>

             {/* Right Controls */}
             <div className="flex items-center gap-4">
                <button className="text-white/80 hover:text-white transition" title="Settings">
                   <Settings size={20} />
                </button>
                <button onClick={toggleFullscreen} className="text-white hover:text-white/80 transition">
                   {isFullscreen ? <Minimize size={24} /> : <Maximize size={24} />}
                </button>
             </div>
          </div>
        </div>
      )}
    </div>
  );
};