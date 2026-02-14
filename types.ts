export interface AdConfig {
  id: string;
  startTime: number; // When the ad starts in the main video (seconds)
  duration: number; // How long the ad is (seconds)
  skipAfter: number; // When the skip button appears (seconds)
  redirectUrl: string; // URL to open on click
  videoSrc: string; // The ad video source
  title: string;
}

export interface AdCampaign {
  id: string;
  name: string;
  videoSrc: string;
  redirectUrl: string;
  defaultDuration: number;
  defaultSkipAfter: number;
  impressions: number;
  clicks: number;
}

export interface GlobalAdSettings {
  enabled: boolean;
  intervalMinutes: number; // e.g., 2, 5, 10
  mode: 'direct' | 'campaign'; // 'direct' lets user input links directly here
  // Direct Mode Fields
  videoSrc: string;
  redirectUrl: string;
  duration: number;
  skipAfter: number;
  // Campaign Mode Field (Optional backup)
  campaignId: string; 
}

export interface Video {
  id: string;
  title: string;
  thumbnail: string;
  url: string; // R2 URL
  duration: number; // Total duration in seconds
  views: number;
  uploadDate: string;
  ads: AdConfig[];
  status: 'active' | 'processing' | 'error' | 'inactive';
}

export interface AnalyticsData {
  date: string;
  views: number;
  adImpressions: number;
  clicks: number;
  revenue: number;
}

export interface PlayerSettings {
  primaryColor: string;
  logoUrl: string;
  logoPosition: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  logoOpacity: number;
  autoPlay: boolean;
}

export interface Settings {
  siteName: string;
  allowSignup: boolean;
  logoUrl: string;
  sidebarBannerUrl: string;
  maintenanceMode: boolean;
  // SMTP Config
  smtpHost: string;
  smtpPort: number;
  smtpUser: string;
  smtpPass: string;
  smtpSecure: boolean;
}

export type Page = 
  | 'login' 
  | 'signup' 
  | 'forgot-password' 
  | 'dashboard' 
  | 'analytics' 
  | 'videos' 
  | 'add-video' 
  | 'edit-video' 
  | 'ad-manager'
  | 'player-settings'
  | 'settings'
  | 'smtp'
  | 'player-demo';