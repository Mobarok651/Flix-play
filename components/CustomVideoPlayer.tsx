import React, { useRef, useState, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX, Maximize, SkipForward, ExternalLink } from 'lucide-react';
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
  const videoRef = useRef<HTMLVideoElement>(null);
  const adVideoRef = useRef<HTMLVideoElement>(null);
  
  const [isPlaying, setIsPlaying] = useState(autoPlay || settings.autoPlay);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  
  // Ad State
  const [currentAd, setCurrentAd] = useState<AdConfig | null>(null);
  const [adTimeLeft, setAdTimeLeft] = useState(0);
  const [canSkip, setCanSkip] = useState(false);
  const [adsPlayed, setAdsPlayed] = useState<string[]>([]); // Track IDs of played ads

  // Handle Main Video Time Update
  const handleTimeUpdate = () => {
    if (videoRef.current && !currentAd) {
      const time = videoRef.current.currentTime;
      setCurrentTime(time);

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

  const startAd = (ad: AdConfig) => {
    if (videoRef.current) videoRef.current.pause();
    setCurrentAd(ad);
    setAdTimeLeft(ad.duration);
    setCanSkip(false);
    setAdsPlayed(prev => [...prev, ad.id]);
    setIsPlaying(true); // Ad is technically playing
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
    
    // Redirect logic if configured
    if (currentAd?.redirectUrl) {
       window.open(currentAd.redirectUrl, '_blank');
    }

    handleAdEnded();
  };

  const handleAdClick = () => {
    if (currentAd?.redirectUrl) {
      window.open(currentAd.redirectUrl, '_blank');
    }
  };

  // Ad Timer Logic
  useEffect(() => {
    let interval: any;
    if (currentAd) {
      interval = setInterval(() => {
        setAdTimeLeft((prev) => {
          const newValue = prev - 1;
          // Check skip logic
          const timeElapsed = currentAd.duration - newValue;
          if (timeElapsed >= currentAd.skipAfter) {
            setCanSkip(true);
          }
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

  const togglePlay = () => {
    if (currentAd) {
       // Control ad play/pause if needed, usually ads are forced play
       if (adVideoRef.current) {
         if (adVideoRef.current.paused) adVideoRef.current.play();
         else adVideoRef.current.pause();
       }
    } else {
      if (videoRef.current) {
        if (isPlaying) videoRef.current.pause();
        else videoRef.current.play();
        setIsPlaying(!isPlaying);
      }
    }
  };

  const toggleMute = () => {
    const newVal = !isMuted;
    setIsMuted(newVal);
    if (videoRef.current) videoRef.current.muted = newVal;
    if (adVideoRef.current) adVideoRef.current.muted = newVal;
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  // Branding Styles
  const primaryColor = settings.primaryColor || '#ef4444';
  
  const getLogoStyle = () => {
    const base: React.CSSProperties = { position: 'absolute', zIndex: 40, maxHeight: '40px', maxWidth: '100px', opacity: settings.logoOpacity };
    switch (settings.logoPosition) {
      case 'top-left': return { ...base, top: '16px', left: '16px' };
      case 'top-right': return { ...base, top: '16px', right: '16px' };
      case 'bottom-left': return { ...base, bottom: '60px', left: '16px' }; // Above controls
      case 'bottom-right': return { ...base, bottom: '60px', right: '16px' }; // Above controls
      default: return { ...base, top: '16px', right: '16px' };
    }
  };

  return (
    <div className="relative w-full aspect-video bg-black group overflow-hidden rounded-lg shadow-2xl border border-neutral-800">
      
      {/* Branding Logo */}
      {settings.logoUrl && !currentAd && (
        <img src={settings.logoUrl} alt="Watermark" style={getLogoStyle()} className="pointer-events-none" />
      )}

      {/* Main Video */}
      <video
        ref={videoRef}
        src={video.url}
        className="w-full h-full object-contain"
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={() => setIsPlaying(false)}
        poster={video.thumbnail}
        onClick={togglePlay}
        autoPlay={autoPlay || settings.autoPlay}
      />

      {/* Ad Overlay */}
      {currentAd && (
        <div className="absolute inset-0 z-50 bg-black flex flex-col items-center justify-center">
          <div className="relative w-full h-full">
            <video
              ref={adVideoRef}
              src={currentAd.videoSrc}
              autoPlay
              className="w-full h-full object-contain cursor-pointer"
              onClick={handleAdClick}
            />
            
            {/* Ad Controls */}
            <div className="absolute bottom-8 right-8 flex flex-col items-end space-y-2">
              <div className="bg-black/60 text-white px-3 py-1 text-sm rounded backdrop-blur-sm">
                Ad ends in {adTimeLeft}s
              </div>
              
              {canSkip ? (
                <button
                  onClick={skipAd}
                  className="flex items-center gap-2 bg-white text-black px-4 py-2 rounded font-bold hover:bg-gray-200 transition-colors"
                >
                  Skip Ad <SkipForward size={16} />
                </button>
              ) : (
                <div className="bg-neutral-800/80 text-neutral-400 px-4 py-2 rounded font-medium text-sm">
                  Skip in {Math.max(0, currentAd.skipAfter - (currentAd.duration - adTimeLeft))}s
                </div>
              )}
            </div>

            {/* Ad Overlay Label */}
            <div className="absolute top-4 left-4 bg-yellow-500 text-black px-2 py-1 text-xs font-bold rounded">
              Sponsored
            </div>
            
            {/* Click to Visit Overlay (CTA) */}
            <div 
              className="absolute bottom-8 left-8 bg-black/60 text-white px-4 py-2 rounded flex items-center gap-2 cursor-pointer hover:bg-black/80 transition"
              onClick={handleAdClick}
            >
              <span>Visit Advertiser</span>
              <ExternalLink size={14} />
            </div>
          </div>
        </div>
      )}

      {/* Main Controls (Only show if no ad) */}
      {!currentAd && (
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          
          {/* Progress Bar */}
          <div className="w-full h-1 bg-gray-600 rounded-full mb-4 cursor-pointer relative group/progress">
            <div 
              className="absolute h-full rounded-full"
              style={{ width: `${(currentTime / duration) * 100}%`, backgroundColor: primaryColor }}
            />
            {/* Ad Markers */}
            {video.ads.map(ad => (
              <div 
                key={ad.id}
                className="absolute h-2 w-2 bg-yellow-400 rounded-full -top-0.5"
                style={{ left: `${(ad.startTime / duration) * 100}%` }}
                title={`Ad at ${formatTime(ad.startTime)}`}
              />
            ))}
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button onClick={togglePlay} className="text-white hover:opacity-80 transition" style={{ color: isPlaying ? primaryColor : 'white' }}>
                {isPlaying ? <Pause size={24} /> : <Play size={24} />}
              </button>
              
              <div className="flex items-center gap-2 group/vol">
                <button onClick={toggleMute} className="text-white hover:text-gray-300">
                  {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
                </button>
                <input 
                  type="range" 
                  min="0" 
                  max="1" 
                  step="0.1"
                  value={isMuted ? 0 : volume}
                  onChange={(e) => {
                    const val = parseFloat(e.target.value);
                    setVolume(val);
                    if (videoRef.current) videoRef.current.volume = val;
                    setIsMuted(val === 0);
                  }}
                  className="w-0 overflow-hidden group-hover/vol:w-20 transition-all h-1"
                  style={{ accentColor: primaryColor }}
                />
              </div>

              <span className="text-sm text-gray-300">
                {formatTime(currentTime)} / {formatTime(duration)}
              </span>
            </div>

            <div className="flex items-center gap-4">
              <button className="text-white hover:text-gray-300">
                <Maximize size={20} onClick={() => {
                   if (videoRef.current?.requestFullscreen) videoRef.current.requestFullscreen();
                }}/>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};