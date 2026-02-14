import React, { useState, useEffect, useMemo } from 'react';
import { 
  LayoutDashboard, 
  Video as VideoIcon, 
  BarChart2, 
  Settings as SettingsIcon, 
  Plus, 
  LogOut, 
  User, 
  Menu,
  X,
  PlayCircle,
  Edit,
  Trash2,
  Share2,
  DollarSign,
  Eye,
  Server,
  Copy, 
  Check,
  Megaphone,
  Clock,
  Link as LinkIcon,
  Globe,
  Zap,
  Activity,
  TrendingUp,
  ArrowUpRight,
  Mail,
  Shield,
  Image,
  Lock,
  Sun,  
  Moon,
  Film,
  AlertCircle,
  HardDrive,
  MonitorPlay,
  Palette,
  LayoutTemplate,
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
  Calendar,
  Save,
  Play
} from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, AreaChart, Area, CartesianGrid, XAxis, YAxis, Tooltip } from 'recharts';
import { Video, AdConfig, Settings, Page, AdCampaign, GlobalAdSettings, PlayerSettings } from './types';
import { CustomVideoPlayer } from './components/CustomVideoPlayer';

// --- MOCK DATA ---
const MOCK_VIDEOS: Video[] = [
  {
    id: '1',
    title: 'Nature Documentary: The Forest',
    thumbnail: 'https://picsum.photos/800/450?random=1',
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    duration: 596,
    views: 12543,
    uploadDate: '2023-10-24',
    status: 'active',
    ads: [
      {
        id: 'ad1',
        startTime: 10,
        duration: 15,
        skipAfter: 5,
        title: 'Tech Store Promo',
        videoSrc: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4',
        redirectUrl: 'https://example.com/store'
      }
    ]
  },
  {
    id: '2',
    title: 'Coding Tutorial: React Basics',
    thumbnail: 'https://picsum.photos/800/450?random=2',
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
    duration: 653,
    views: 8900,
    uploadDate: '2023-10-25',
    status: 'active',
    ads: []
  },
  {
    id: '3',
    title: 'Space Exploration: Mars',
    thumbnail: 'https://picsum.photos/800/450?random=3',
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
    duration: 734,
    views: 5432,
    uploadDate: '2023-10-26',
    status: 'inactive',
    ads: []
  },
  {
    id: '4',
    title: 'Cooking Masterclass: Pasta',
    thumbnail: 'https://picsum.photos/800/450?random=4',
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4',
    duration: 888,
    views: 1200,
    uploadDate: '2023-10-27',
    status: 'active',
    ads: []
  }
];

const MOCK_CAMPAIGNS: AdCampaign[] = [
  {
    id: 'c1',
    name: 'Betting App Promo (Winter)',
    videoSrc: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4',
    redirectUrl: 'https://betting-site-example.com',
    defaultDuration: 15,
    defaultSkipAfter: 5,
    impressions: 45000,
    clicks: 1200
  },
  {
    id: 'c2',
    name: 'Tech Store Sale 11.11',
    videoSrc: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
    redirectUrl: 'https://tech-store-example.com/sale',
    defaultDuration: 30,
    defaultSkipAfter: 10,
    impressions: 22000,
    clicks: 800
  }
];

// --- APP COMPONENT ---

export default function App() {
  // Global State
  const [currentPage, setCurrentPage] = useState<Page>('login');
  const [user, setUser] = useState<{ email: string } | null>(null);
  
  // Initialize videos from localStorage or fallback to MOCK_VIDEOS
  const [videos, setVideos] = useState<Video[]>(() => {
    const saved = localStorage.getItem('streamflow_videos');
    return saved ? JSON.parse(saved) : MOCK_VIDEOS;
  });
  
  const [campaigns, setCampaigns] = useState<AdCampaign[]>(MOCK_CAMPAIGNS);
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  
  // Persist videos to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('streamflow_videos', JSON.stringify(videos));
  }, [videos]);

  // NEW: Global Ad Settings State with Direct Links
  const [globalAdSettings, setGlobalAdSettings] = useState<GlobalAdSettings>({
    enabled: false,
    intervalMinutes: 5,
    mode: 'direct', 
    campaignId: '',
    videoSrc: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4', 
    redirectUrl: 'https://adsterra.com/example',
    duration: 15,
    skipAfter: 5
  });

  // NEW: Player Branding Settings
  const [playerSettings, setPlayerSettings] = useState<PlayerSettings>({
    primaryColor: '#ef4444', 
    logoUrl: '',
    logoPosition: 'top-right',
    logoOpacity: 0.8,
    autoPlay: false
  });

  const [loginError, setLoginError] = useState('');
  
  const [settings, setSettings] = useState<Settings>({
    siteName: 'StreamFlow',
    allowSignup: true,
    logoUrl: '',
    sidebarBannerUrl: '',
    maintenanceMode: false,
    smtpHost: 'smtp.mailgun.org',
    smtpPort: 587,
    smtpUser: 'postmaster@streamflow.com',
    smtpPass: '',
    smtpSecure: true
  });

  // Forgot Password State
  const [resetStep, setResetStep] = useState<1 | 2 | 3>(1); 
  const [resetEmail, setResetEmail] = useState('');
  const [resetOtp, setResetOtp] = useState('');

  // UI State
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [editingVideo, setEditingVideo] = useState<Video | null>(null);
  const [demoVideo, setDemoVideo] = useState<Video | null>(null);
  
  // Modals
  const [showEmbedModal, setShowEmbedModal] = useState<Video | null>(null);
  const [videoToDelete, setVideoToDelete] = useState<Video | null>(null);
  
  const [copyFeedback, setCopyFeedback] = useState<string | null>(null);

  // --- EMBED MODE STATE ---
  const [isEmbedMode, setIsEmbedMode] = useState(false);
  const [embedVideoData, setEmbedVideoData] = useState<Video | null>(null);

  // Apply Theme Class
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  // Check for Embed Parameters on Mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const mode = params.get('mode');
    const videoId = params.get('id');

    if (mode === 'embed' && videoId) {
       const foundVideo = videos.find(v => v.id === videoId) || MOCK_VIDEOS.find(v => v.id === videoId);
       if (foundVideo) {
         setEmbedVideoData(foundVideo);
         setIsEmbedMode(true);
         // Force dark mode for player
         document.documentElement.classList.add('dark');
       }
    }
  }, [videos]);

  // --- LOGIC: GET EFFECTIVE ADS (Combines Manual + Global) ---
  const getEffectiveAds = (video: Video): AdConfig[] => {
    let effectiveAds = [...video.ads];
    if (globalAdSettings.enabled) {
       let source: { videoSrc: string, redirectUrl: string, duration: number, skipAfter: number, title: string } | null = null;
       
       if (globalAdSettings.mode === 'campaign' && globalAdSettings.campaignId) {
          const c = campaigns.find(cmp => cmp.id === globalAdSettings.campaignId);
          if (c) source = { ...c, title: `[Global] ${c.name}`, duration: c.defaultDuration, skipAfter: c.defaultSkipAfter };
       } else if (globalAdSettings.mode === 'direct' && globalAdSettings.videoSrc) {
          source = {
            videoSrc: globalAdSettings.videoSrc,
            redirectUrl: globalAdSettings.redirectUrl,
            duration: globalAdSettings.duration,
            skipAfter: globalAdSettings.skipAfter,
            title: '[Global] Direct Ad'
          };
       }

       if (source) {
          const intervalSeconds = globalAdSettings.intervalMinutes * 60;
          let time = intervalSeconds;
          while (time < video.duration) {
             const hasConflict = effectiveAds.some(ad => Math.abs(ad.startTime - time) < 30);
             if (!hasConflict) {
                effectiveAds.push({
                   id: `global_${video.id}_${time}`,
                   startTime: time,
                   duration: source.duration,
                   skipAfter: source.skipAfter,
                   redirectUrl: source.redirectUrl,
                   videoSrc: source.videoSrc,
                   title: source.title
                });
             }
             time += intervalSeconds;
          }
       }
    }
    return effectiveAds.sort((a,b) => a.startTime - b.startTime);
  };

  // --- RENDER EMBED PLAYER ONLY ---
  if (isEmbedMode && embedVideoData) {
    const videoWithAds = {
      ...embedVideoData,
      ads: getEffectiveAds(embedVideoData)
    };
    return (
      <div className="w-screen h-screen bg-black overflow-hidden flex items-center justify-center">
        <CustomVideoPlayer 
          video={videoWithAds} 
          settings={playerSettings} 
          autoPlay={true} 
        />
      </div>
    );
  }

  // --- HANDLERS ---
  const handleLogin = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    if (email === 'farabihasan4488@gmail.com' && password === 'Admin820') {
      setUser({ email });
      setCurrentPage('dashboard');
      setLoginError('');
    } else {
      setLoginError('Invalid credentials. Please check your email and password.');
    }
  };

  const handleLogout = () => {
    setUser(null);
    setCurrentPage('login');
    setLoginError('');
  };

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopyFeedback(key);
      setTimeout(() => setCopyFeedback(null), 2000);
    });
  };

  // Toggle Video Status Handler
  const toggleVideoStatus = (id: string) => {
    setVideos(videos.map(v => v.id === id ? { ...v, status: v.status === 'active' ? 'inactive' : 'active' } : v));
  };

  // Delete Video Logic
  const initiateDelete = (video: Video) => {
    setVideoToDelete(video);
  };

  const confirmDelete = () => {
    if (videoToDelete) {
      setVideos(videos.filter(v => v.id !== videoToDelete.id));
      setVideoToDelete(null);
    }
  };

  // --- PAGES ---

  const LoginPage = () => (
    <div className="min-h-screen flex items-center justify-center bg-black bg-[url('https://assets.nflxext.com/ffe/siteui/vlv3/f841d4c7-10e1-40af-bcae-07a3f8dc141a/f6d7434e-d6de-4185-a6d4-c77a2d08737b/US-en-20220502-popsignuptwoweeks-perspective_alpha_website_medium.jpg')] bg-cover bg-center text-white">
      <div className="absolute inset-0 bg-black/60"></div>
      <div className="relative z-10 w-full max-w-md bg-black/75 p-12 rounded-lg backdrop-blur-sm border border-neutral-800">
        <h1 className="text-3xl font-bold mb-8">Sign In</h1>
        <form onSubmit={handleLogin} className="space-y-6">
          {loginError && (
            <div className="bg-red-500/10 border border-red-500/50 text-red-500 text-sm p-3 rounded text-center">
              {loginError}
            </div>
          )}
          <div>
            <input name="email" type="email" placeholder="Email" defaultValue="farabihasan4488@gmail.com" className="w-full bg-[#333] text-white p-4 rounded border-none focus:ring-2 focus:ring-red-600 outline-none" required />
          </div>
          <div>
            <input name="password" type="password" placeholder="Password" defaultValue="Admin820" className="w-full bg-[#333] text-white p-4 rounded border-none focus:ring-2 focus:ring-red-600 outline-none" required />
          </div>
          <button type="submit" className="w-full bg-red-600 text-white font-bold py-4 rounded hover:bg-red-700 transition">Sign In</button>
        </form>
        <div className="mt-4 flex justify-between items-center text-sm text-neutral-400">
          <button type="button" className="hover:text-white underline" onClick={() => { setResetStep(1); setCurrentPage('forgot-password'); }}>Forgot password?</button>
          {settings.allowSignup && <button className="hover:text-white underline" onClick={() => setCurrentPage('signup')}>Sign up now</button>}
        </div>
      </div>
    </div>
  );

  const ForgotPasswordPage = () => (
    <div className="min-h-screen flex items-center justify-center bg-black bg-[url('https://assets.nflxext.com/ffe/siteui/vlv3/f841d4c7-10e1-40af-bcae-07a3f8dc141a/f6d7434e-d6de-4185-a6d4-c77a2d08737b/US-en-20220502-popsignuptwoweeks-perspective_alpha_website_medium.jpg')] bg-cover bg-center text-white">
      <div className="absolute inset-0 bg-black/60"></div>
      <div className="relative z-10 w-full max-w-md bg-black/75 p-12 rounded-lg backdrop-blur-sm border border-neutral-800">
        <h1 className="text-2xl font-bold mb-6">Reset Password</h1>
        {resetStep === 1 && (
           <div className="space-y-6">
              <p className="text-neutral-400 text-sm">Enter your email address to receive a verification code.</p>
              <input type="email" placeholder="Email Address" value={resetEmail} onChange={(e) => setResetEmail(e.target.value)} className="w-full bg-[#333] text-white p-4 rounded border-none focus:ring-2 focus:ring-red-600 outline-none" />
              <button onClick={() => { if(resetEmail) setResetStep(2); }} className="w-full bg-red-600 text-white font-bold py-4 rounded hover:bg-red-700 transition">Send OTP</button>
           </div>
        )}
        {resetStep === 2 && (
           <div className="space-y-6">
              <p className="text-neutral-400 text-sm">Enter the OTP sent to {resetEmail}</p>
              <input type="text" placeholder="Enter 6-digit OTP" value={resetOtp} onChange={(e) => setResetOtp(e.target.value)} className="w-full bg-[#333] text-white p-4 rounded border-none focus:ring-2 focus:ring-red-600 outline-none text-center tracking-widest text-xl" />
              <button onClick={() => { if(resetOtp) setResetStep(3); }} className="w-full bg-red-600 text-white font-bold py-4 rounded hover:bg-red-700 transition">Verify OTP</button>
           </div>
        )}
        {resetStep === 3 && (
           <div className="space-y-6">
              <p className="text-neutral-400 text-sm">Create a new password</p>
              <input type="password" placeholder="New Password" className="w-full bg-[#333] text-white p-4 rounded border-none focus:ring-2 focus:ring-red-600 outline-none" />
              <input type="password" placeholder="Confirm Password" className="w-full bg-[#333] text-white p-4 rounded border-none focus:ring-2 focus:ring-red-600 outline-none" />
              <button onClick={() => { alert('Password reset successfully!'); setCurrentPage('login'); }} className="w-full bg-red-600 text-white font-bold py-4 rounded hover:bg-red-700 transition">Reset Password</button>
           </div>
        )}
        <button onClick={() => setCurrentPage('login')} className="mt-6 w-full text-center text-sm text-neutral-400 hover:text-white">Back to Login</button>
      </div>
    </div>
  );

  const DashboardPage = () => {
    const stats = [
      { label: 'Total Views', value: videos.reduce((acc, v) => acc + v.views, 0).toLocaleString(), change: '+12%', icon: Eye, color: 'text-blue-500' },
      { label: 'Ad Revenue', value: '$12,450', change: '+8.1%', icon: DollarSign, color: 'text-green-500' },
      { label: 'Active Videos', value: videos.filter(v => v.status === 'active').length, change: '+2', icon: VideoIcon, color: 'text-purple-500' },
      { label: 'Storage Used', value: '450 GB', change: '85%', icon: HardDrive, color: 'text-orange-500' },
    ];

    return (
      <div className="space-y-6 animate-fade-in">
        <h2 className="text-2xl font-bold dark:text-white text-gray-900">Dashboard Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, idx) => (
            <div key={idx} className="dark:bg-neutral-900 bg-white p-6 rounded-xl border dark:border-neutral-800 border-gray-200 dark:hover:border-neutral-700 shadow-sm transition">
              <div className="flex justify-between items-start mb-4">
                <div className={`p-3 rounded-lg dark:bg-neutral-800 bg-gray-100 ${stat.color}`}>
                  <stat.icon size={24} />
                </div>
                <span className="text-green-600 dark:text-green-400 text-sm font-medium bg-green-100 dark:bg-green-400/10 px-2 py-1 rounded">{stat.change}</span>
              </div>
              <h3 className="text-3xl font-bold dark:text-white text-gray-900 mb-1">{stat.value}</h3>
              <p className="dark:text-neutral-400 text-gray-500">{stat.label}</p>
            </div>
          ))}
        </div>
        <div className="dark:bg-neutral-900 bg-white p-6 rounded-xl border dark:border-neutral-800 border-gray-200 shadow-sm">
            <h3 className="text-lg font-semibold dark:text-white text-gray-900 mb-6">Recent Activity</h3>
            <p className="dark:text-neutral-400 text-gray-500">System running smoothly. Global ad status: {globalAdSettings.enabled ? 'Active' : 'Disabled'}</p>
        </div>
      </div>
    );
  };

  const VideoListPage = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'inactive'>('all');
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [page, setPage] = useState(1);

    // Derived filtered list
    const filteredVideos = videos.filter(video => {
      const matchesSearch = video.title.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesFilter = filterStatus === 'all' || video.status === filterStatus;
      return matchesSearch && matchesFilter;
    });

    // Pagination Logic
    const totalPages = Math.ceil(filteredVideos.length / itemsPerPage);
    const paginatedVideos = filteredVideos.slice((page - 1) * itemsPerPage, page * itemsPerPage);

    // Reset page on filter change
    useEffect(() => {
      setPage(1);
    }, [searchTerm, filterStatus, itemsPerPage]);

    return (
      <div className="space-y-6 animate-fade-in">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <h2 className="text-2xl font-bold dark:text-white text-gray-900">Video Library</h2>
          <button onClick={() => setCurrentPage('add-video')} className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition shadow-lg">
            <Plus size={18} /> Add New Video
          </button>
        </div>

        {/* Toolbar: Search, Filter, Limit */}
        <div className="dark:bg-neutral-900 bg-white p-4 rounded-xl border dark:border-neutral-800 border-gray-200 flex flex-col md:flex-row gap-4 justify-between items-center shadow-sm">
          <div className="flex items-center gap-4 w-full md:w-auto">
             {/* Ajax Instant Search */}
             <div className="relative flex-1 md:w-64">
               <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
               <input 
                 type="text" 
                 placeholder="Search videos..." 
                 value={searchTerm}
                 onChange={(e) => setSearchTerm(e.target.value)}
                 className="w-full pl-10 pr-4 py-2 rounded-lg dark:bg-black bg-gray-50 border dark:border-neutral-700 border-gray-300 dark:text-white text-gray-900 outline-none focus:border-red-600 transition"
               />
             </div>
             
             {/* Filter Tabs */}
             <div className="flex rounded-lg overflow-hidden border dark:border-neutral-700 border-gray-300">
               {['all', 'active', 'inactive'].map((status) => (
                 <button
                   key={status}
                   onClick={() => setFilterStatus(status as any)}
                   className={`px-4 py-2 text-sm font-medium capitalize transition ${filterStatus === status ? 'bg-red-600 text-white' : 'dark:bg-neutral-800 bg-gray-100 dark:text-gray-400 text-gray-600 hover:bg-gray-200 dark:hover:bg-neutral-700'}`}
                 >
                   {status}
                 </button>
               ))}
             </div>
          </div>

          <div className="flex items-center gap-2">
             <span className="text-sm dark:text-gray-400 text-gray-600">Rows per page:</span>
             <select 
               value={itemsPerPage}
               onChange={(e) => setItemsPerPage(Number(e.target.value))}
               className="dark:bg-black bg-gray-50 border dark:border-neutral-700 border-gray-300 rounded p-2 text-sm dark:text-white text-gray-900 outline-none focus:border-red-600"
             >
               <option value={5}>5</option>
               <option value={10}>10</option>
               <option value={20}>20</option>
               <option value={50}>50</option>
             </select>
          </div>
        </div>

        {/* Video Table */}
        <div className="dark:bg-neutral-900 bg-white rounded-xl border dark:border-neutral-800 border-gray-200 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="dark:bg-neutral-800 bg-gray-100 dark:text-neutral-400 text-gray-600 text-sm uppercase tracking-wider">
                <tr>
                  <th className="p-4">Video Details</th>
                  <th className="p-4">Stats & Date</th>
                  <th className="p-4 text-center">Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y dark:divide-neutral-800 divide-gray-200">
                {paginatedVideos.map(video => { 
                  const totalAds = getEffectiveAds(video).length; 
                  return (
                    <tr key={video.id} className="dark:hover:bg-neutral-800/50 hover:bg-gray-50 transition group">
                      <td className="p-4">
                        <div className="flex items-center gap-4">
                          <div className="relative w-32 h-20 rounded overflow-hidden bg-neutral-800 shrink-0 border dark:border-neutral-700 border-gray-300">
                             <img src={video.thumbnail} alt="" className="w-full h-full object-cover" />
                             <div className="absolute bottom-1 right-1 bg-black/80 text-white text-[10px] px-1 rounded">
                               {Math.floor(video.duration / 60)}:{String(video.duration % 60).padStart(2, '0')}
                             </div>
                          </div>
                          <div>
                            <p className="font-bold dark:text-white text-gray-900 line-clamp-1">{video.title}</p>
                            <p className="text-xs dark:text-neutral-500 text-gray-500 mt-1 flex items-center gap-1">
                               <Megaphone size={12}/> {totalAds} Ads configured
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                         <div className="space-y-1">
                            <div className="flex items-center gap-2 text-sm dark:text-gray-300 text-gray-700" title="Real-time Views">
                               <Eye size={14} className="text-blue-500"/>
                               {video.views.toLocaleString()}
                            </div>
                            <div className="flex items-center gap-2 text-xs dark:text-gray-500 text-gray-500" title="Upload Date">
                               <Calendar size={14} />
                               {video.uploadDate}
                            </div>
                         </div>
                      </td>
                      <td className="p-4">
                         <div className="flex justify-center">
                            {/* Toggle Switch */}
                            <button 
                              onClick={() => toggleVideoStatus(video.id)}
                              className={`w-12 h-6 rounded-full transition-colors relative ${video.status === 'active' ? 'bg-green-600' : 'bg-neutral-600 dark:bg-neutral-700'}`}
                            >
                               <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform shadow-sm ${video.status === 'active' ? 'translate-x-7' : 'translate-x-1'}`}></div>
                            </button>
                         </div>
                      </td>
                      <td className="p-4">
                        <div className="flex justify-end gap-2 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity">
                          <button onClick={() => { setDemoVideo({...video, ads: getEffectiveAds(video)}); setCurrentPage('player-demo'); }} className="p-2 hover:bg-gray-200 dark:hover:bg-neutral-700 rounded dark:text-blue-400 text-blue-600" title="Preview Play">
                            <PlayCircle size={18} />
                          </button>
                          <button onClick={() => { setEditingVideo(video); setCurrentPage('edit-video'); }} className="p-2 hover:bg-gray-200 dark:hover:bg-neutral-700 rounded dark:text-neutral-400 text-gray-600 dark:hover:text-white hover:text-gray-900" title="Edit Video">
                            <Edit size={18} />
                          </button>
                          <button onClick={() => setShowEmbedModal(video)} className="p-2 hover:bg-gray-200 dark:hover:bg-neutral-700 rounded dark:text-neutral-400 text-gray-600 dark:hover:text-white hover:text-gray-900" title="Get Embed Code">
                            <Share2 size={18} />
                          </button>
                          <button onClick={() => initiateDelete(video)} className="p-2 hover:bg-red-900/30 rounded text-red-500 hover:text-red-400" title="Delete Video">
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
                {paginatedVideos.length === 0 && (
                   <tr>
                      <td colSpan={4} className="p-8 text-center dark:text-neutral-500 text-gray-500">
                         No videos found matching your criteria.
                      </td>
                   </tr>
                )}
              </tbody>
            </table>
          </div>
          
          {/* Pagination Controls */}
          <div className="p-4 border-t dark:border-neutral-800 border-gray-200 flex justify-between items-center bg-gray-50 dark:bg-black/20">
             <div className="text-sm dark:text-gray-500 text-gray-600">
                Showing <span className="font-bold">{paginatedVideos.length > 0 ? (page - 1) * itemsPerPage + 1 : 0}</span> to <span className="font-bold">{Math.min(page * itemsPerPage, filteredVideos.length)}</span> of <span className="font-bold">{filteredVideos.length}</span> videos
             </div>
             <div className="flex items-center gap-2">
                <button 
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="p-2 rounded border dark:border-neutral-700 border-gray-300 disabled:opacity-50 hover:bg-gray-200 dark:hover:bg-neutral-800 transition dark:text-white text-gray-900"
                >
                   <ChevronLeft size={16} />
                </button>
                
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(pageNum => (
                   <button
                     key={pageNum}
                     onClick={() => setPage(pageNum)}
                     className={`w-8 h-8 rounded text-sm font-medium transition ${page === pageNum ? 'bg-red-600 text-white' : 'dark:text-gray-400 text-gray-600 hover:bg-gray-200 dark:hover:bg-neutral-800'}`}
                   >
                     {pageNum}
                   </button>
                ))}

                <button 
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages || totalPages === 0}
                  className="p-2 rounded border dark:border-neutral-700 border-gray-300 disabled:opacity-50 hover:bg-gray-200 dark:hover:bg-neutral-800 transition dark:text-white text-gray-900"
                >
                   <ChevronRight size={16} />
                </button>
             </div>
          </div>
        </div>
      </div>
    );
  };

  const AddVideoPage = () => {
    const [title, setTitle] = useState('');
    const [url, setUrl] = useState('');
    const [thumbnail, setThumbnail] = useState('');
    const [duration, setDuration] = useState(0);

    const handleSubmit = () => {
      // Made thumbnail and duration optional to fix user issue
      if (!title || !url) {
        alert("Please enter at least a Title and Video Source URL.");
        return;
      }

      const newVideo: Video = {
        id: Date.now().toString(),
        title,
        url,
        // Use provided thumbnail or a default random one
        thumbnail: thumbnail || `https://picsum.photos/800/450?random=${Date.now()}`,
        duration: duration || 0, // 0 indicates unknown/auto
        views: 0,
        uploadDate: new Date().toISOString().split('T')[0],
        status: 'active',
        ads: []
      };

      setVideos([newVideo, ...videos]);
      setCurrentPage('videos');
    };

    return (
      <div className="max-w-2xl mx-auto space-y-8 animate-fade-in">
        <h2 className="text-2xl font-bold dark:text-white text-gray-900 flex items-center gap-2">
          <Film className="text-red-500" /> Add New Video
        </h2>
        
        <div className="dark:bg-neutral-900 bg-white p-8 rounded-xl border dark:border-neutral-800 border-gray-200 shadow-sm">
           <div className="flex items-center gap-4 mb-6 bg-blue-50 dark:bg-blue-900/20 p-4 rounded border border-blue-100 dark:border-blue-900/50">
              <AlertCircle className="text-blue-500" />
              <div>
                 <h4 className="dark:text-white text-gray-900 font-bold">Direct Link Mode</h4>
                 <p className="text-sm dark:text-neutral-400 text-gray-600">Paste your Public R2 URL directly below. No storage configuration required.</p>
              </div>
           </div>

           <div className="space-y-6">
              <div>
                 <label className="block text-sm font-medium dark:text-neutral-400 text-gray-700 mb-2">Video Title <span className="text-red-500">*</span></label>
                 <input 
                   type="text" 
                   value={title} 
                   onChange={(e) => setTitle(e.target.value)}
                   className="w-full dark:bg-black bg-gray-50 border dark:border-neutral-700 border-gray-300 rounded-lg py-3 px-4 dark:text-white text-gray-900 outline-none focus:border-red-600"
                   placeholder="e.g. My Awesome Video"
                   required
                 />
              </div>

              <div>
                 <label className="block text-sm font-medium dark:text-neutral-400 text-gray-700 mb-2">Video Source URL (R2/S3 Direct Link) <span className="text-red-500">*</span></label>
                 <div className="relative">
                    <Server className="absolute left-3 top-3 dark:text-neutral-500 text-gray-400" size={18} />
                    <input 
                      type="text" 
                      value={url} 
                      onChange={(e) => setUrl(e.target.value)}
                      className="w-full dark:bg-black bg-gray-50 border dark:border-neutral-700 border-gray-300 rounded-lg py-3 pl-10 dark:text-white text-gray-900 outline-none focus:border-red-600"
                      placeholder="https://pub-xxxx.r2.dev/video.mp4"
                      required
                    />
                 </div>
                 <p className="text-xs dark:text-neutral-500 text-gray-500 mt-2">Make sure the file is public or the URL contains a valid token.</p>
              </div>

              <div>
                 <label className="block text-sm font-medium dark:text-neutral-400 text-gray-700 mb-2">Thumbnail URL <span className="text-neutral-500 text-xs">(Optional)</span></label>
                 <div className="relative">
                    <Image className="absolute left-3 top-3 dark:text-neutral-500 text-gray-400" size={18} />
                    <input 
                      type="text" 
                      value={thumbnail} 
                      onChange={(e) => setThumbnail(e.target.value)}
                      className="w-full dark:bg-black bg-gray-50 border dark:border-neutral-700 border-gray-300 rounded-lg py-3 pl-10 dark:text-white text-gray-900 outline-none focus:border-red-600"
                      placeholder="https://example.com/image.jpg"
                    />
                 </div>
              </div>

              <div>
                 <label className="block text-sm font-medium dark:text-neutral-400 text-gray-700 mb-2">Duration (Seconds) <span className="text-neutral-500 text-xs">(Optional)</span></label>
                 <div className="relative">
                    <Clock className="absolute left-3 top-3 dark:text-neutral-500 text-gray-400" size={18} />
                    <input 
                      type="number" 
                      value={duration} 
                      onChange={(e) => setDuration(parseInt(e.target.value))}
                      className="w-full dark:bg-black bg-gray-50 border dark:border-neutral-700 border-gray-300 rounded-lg py-3 pl-10 dark:text-white text-gray-900 outline-none focus:border-red-600"
                      placeholder="0 (Auto-detect)"
                    />
                 </div>
              </div>
           </div>

           <div className="mt-8 flex justify-end gap-4">
              <button 
                onClick={() => setCurrentPage('videos')}
                className="px-6 py-3 rounded-lg dark:text-neutral-400 text-gray-600 hover:bg-gray-100 dark:hover:bg-neutral-800 transition"
              >
                 Cancel
              </button>
              <button 
                onClick={handleSubmit}
                className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg shadow-lg flex items-center gap-2"
              >
                 <Plus size={18}/> Add Video
              </button>
           </div>
        </div>
      </div>
    );
  };

  const EditVideoPage = () => {
    const [formState, setFormState] = useState<Video>(editingVideo!);
    
    if (!editingVideo) return <div className="p-8 text-center text-gray-500">No video selected for editing.</div>;

    const handleSave = () => {
        setVideos(videos.map(v => v.id === formState.id ? formState : v));
        setCurrentPage('videos');
        setEditingVideo(null);
    };

    return (
        <div className="max-w-2xl mx-auto space-y-6 animate-fade-in">
             <div className="flex items-center gap-4 mb-6">
                <button onClick={() => setCurrentPage('videos')} className="p-2 hover:bg-gray-200 dark:hover:bg-neutral-800 rounded-full"><ChevronLeft className="dark:text-white" size={24} /></button>
                <h2 className="text-2xl font-bold dark:text-white text-gray-900">Edit Video</h2>
             </div>
             <div className="dark:bg-neutral-900 bg-white p-6 rounded-xl border dark:border-neutral-800 border-gray-200 space-y-4 shadow-sm">
                <div>
                    <label className="block text-sm font-medium dark:text-gray-400 text-gray-700 mb-1">Title</label>
                    <input className="w-full p-2 rounded dark:bg-black bg-gray-50 border dark:border-neutral-700 border-gray-300 dark:text-white text-gray-900" value={formState.title} onChange={e => setFormState({...formState, title: e.target.value})} />
                </div>
                 <div>
                    <label className="block text-sm font-medium dark:text-gray-400 text-gray-700 mb-1">URL</label>
                    <input className="w-full p-2 rounded dark:bg-black bg-gray-50 border dark:border-neutral-700 border-gray-300 dark:text-white text-gray-900" value={formState.url} onChange={e => setFormState({...formState, url: e.target.value})} />
                </div>
                 <div>
                    <label className="block text-sm font-medium dark:text-gray-400 text-gray-700 mb-1">Thumbnail</label>
                    <input className="w-full p-2 rounded dark:bg-black bg-gray-50 border dark:border-neutral-700 border-gray-300 dark:text-white text-gray-900" value={formState.thumbnail} onChange={e => setFormState({...formState, thumbnail: e.target.value})} />
                </div>
                <div className="pt-4 flex justify-end gap-3">
                    <button onClick={() => setCurrentPage('videos')} className="px-4 py-2 rounded border dark:border-neutral-700 border-gray-300 dark:text-white text-gray-700 hover:bg-gray-100 dark:hover:bg-neutral-800">Cancel</button>
                    <button onClick={handleSave} className="bg-red-600 text-white px-6 py-2 rounded font-bold hover:bg-red-700 transition">Save Changes</button>
                </div>
             </div>
        </div>
    )
  }

  const PlayerDemoPage = () => {
      if (!demoVideo) return <div className="p-8 text-center text-gray-500">No video loaded.</div>;
      
      const videoWithAds = {
          ...demoVideo,
          ads: getEffectiveAds(demoVideo)
      };

      return (
          <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
              <button onClick={() => setCurrentPage('videos')} className="flex items-center gap-2 dark:text-white text-gray-900 hover:text-red-500 font-medium"><ChevronLeft /> Back to Videos</button>
              <div className="aspect-video border dark:border-neutral-800 border-gray-300 rounded-lg overflow-hidden shadow-2xl bg-black">
                  <CustomVideoPlayer video={videoWithAds} settings={playerSettings} autoPlay={true} />
              </div>
              <div className="p-4 dark:bg-neutral-900 bg-white rounded-lg border dark:border-neutral-800 border-gray-200">
                  <h1 className="text-xl font-bold dark:text-white text-gray-900">{demoVideo.title}</h1>
                  <p className="text-sm text-gray-500 mt-2">Preview Mode</p>
              </div>
          </div>
      )
  }

  const AnalyticsPage = () => {
      const data = [
          { name: 'Mon', views: 4000, revenue: 240 },
          { name: 'Tue', views: 3000, revenue: 139 },
          { name: 'Wed', views: 2000, revenue: 980 },
          { name: 'Thu', views: 2780, revenue: 390 },
          { name: 'Fri', views: 1890, revenue: 480 },
          { name: 'Sat', views: 2390, revenue: 380 },
          { name: 'Sun', views: 3490, revenue: 430 },
      ];
      return (
          <div className="space-y-6 animate-fade-in">
              <h2 className="text-2xl font-bold dark:text-white text-gray-900">Analytics</h2>
              <div className="dark:bg-neutral-900 bg-white p-6 rounded-xl border dark:border-neutral-800 border-gray-200 h-96 shadow-sm">
                  <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={data}>
                          <defs>
                              <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                                  <stop offset="5%" stopColor="#ef4444" stopOpacity={0.8}/>
                                  <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                              </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" stroke={theme === 'dark' ? "#333" : "#eee"} />
                          <XAxis dataKey="name" stroke="#888" />
                          <YAxis stroke="#888" />
                          <Tooltip 
                            contentStyle={{
                                backgroundColor: theme === 'dark' ? '#000' : '#fff', 
                                borderColor: theme === 'dark' ? '#333' : '#ccc',
                                borderRadius: '8px',
                                color: theme === 'dark' ? '#fff' : '#000'
                            }} 
                          />
                          <Area type="monotone" dataKey="views" stroke="#ef4444" fillOpacity={1} fill="url(#colorViews)" />
                      </AreaChart>
                  </ResponsiveContainer>
              </div>
          </div>
      )
  }

  const AdManagerPage = () => (
      <div className="space-y-6 animate-fade-in">
          <h2 className="text-2xl font-bold dark:text-white text-gray-900">Global Ad Manager</h2>
          <div className="dark:bg-neutral-900 bg-white p-6 rounded-xl border dark:border-neutral-800 border-gray-200 shadow-sm space-y-6">
              <div className="flex items-center justify-between">
                  <span className="dark:text-white text-gray-900 font-medium">Enable Global Ads</span>
                  <button 
                    onClick={() => setGlobalAdSettings({...globalAdSettings, enabled: !globalAdSettings.enabled})}
                    className={`w-12 h-6 rounded-full relative transition-colors ${globalAdSettings.enabled ? 'bg-green-500' : 'bg-gray-400'}`}
                  >
                      <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${globalAdSettings.enabled ? 'translate-x-7' : 'translate-x-1'}`} />
                  </button>
              </div>
              <div className="space-y-2">
                  <label className="block text-sm dark:text-gray-400 text-gray-600">Ad Interval (Minutes)</label>
                  <input 
                    type="number" 
                    value={globalAdSettings.intervalMinutes}
                    onChange={(e) => setGlobalAdSettings({...globalAdSettings, intervalMinutes: parseInt(e.target.value)})}
                    className="w-full p-2 rounded dark:bg-black bg-gray-50 border dark:border-neutral-700 border-gray-300 dark:text-white"
                  />
              </div>
              <div className="space-y-2">
                  <label className="block text-sm dark:text-gray-400 text-gray-600">Video Source URL</label>
                  <input 
                    type="text" 
                    value={globalAdSettings.videoSrc}
                    onChange={(e) => setGlobalAdSettings({...globalAdSettings, videoSrc: e.target.value})}
                    className="w-full p-2 rounded dark:bg-black bg-gray-50 border dark:border-neutral-700 border-gray-300 dark:text-white"
                  />
              </div>
              <div className="space-y-2">
                  <label className="block text-sm dark:text-gray-400 text-gray-600">Redirect URL</label>
                  <input 
                    type="text" 
                    value={globalAdSettings.redirectUrl}
                    onChange={(e) => setGlobalAdSettings({...globalAdSettings, redirectUrl: e.target.value})}
                    className="w-full p-2 rounded dark:bg-black bg-gray-50 border dark:border-neutral-700 border-gray-300 dark:text-white"
                  />
              </div>
          </div>
      </div>
  );

  const PlayerSettingsPage = () => (
      <div className="space-y-6 animate-fade-in">
          <h2 className="text-2xl font-bold dark:text-white text-gray-900">Player Branding</h2>
          <div className="dark:bg-neutral-900 bg-white p-6 rounded-xl border dark:border-neutral-800 border-gray-200 shadow-sm space-y-6">
               <div className="space-y-2">
                  <label className="block text-sm dark:text-gray-400 text-gray-600">Primary Color</label>
                  <div className="flex gap-4 items-center">
                    <input 
                        type="color" 
                        value={playerSettings.primaryColor}
                        onChange={(e) => setPlayerSettings({...playerSettings, primaryColor: e.target.value})}
                        className="h-10 w-20 rounded border border-gray-300"
                    />
                    <span className="text-sm dark:text-gray-500 text-gray-500">{playerSettings.primaryColor}</span>
                  </div>
              </div>
               <div className="space-y-2">
                  <label className="block text-sm dark:text-gray-400 text-gray-600">Logo Watermark URL</label>
                  <input 
                    type="text" 
                    value={playerSettings.logoUrl}
                    onChange={(e) => setPlayerSettings({...playerSettings, logoUrl: e.target.value})}
                    placeholder="https://example.com/logo.png"
                    className="w-full p-2 rounded dark:bg-black bg-gray-50 border dark:border-neutral-700 border-gray-300 dark:text-white"
                  />
              </div>
          </div>
      </div>
  );

  const SettingsPage = () => (
      <div className="space-y-6 animate-fade-in">
          <h2 className="text-2xl font-bold dark:text-white text-gray-900">Site Settings</h2>
          <div className="dark:bg-neutral-900 bg-white p-6 rounded-xl border dark:border-neutral-800 border-gray-200 shadow-sm space-y-6">
              <div className="space-y-2">
                  <label className="block text-sm dark:text-gray-400 text-gray-600">Site Name</label>
                  <input 
                    type="text" 
                    value={settings.siteName}
                    onChange={(e) => setSettings({...settings, siteName: e.target.value})}
                    className="w-full p-2 rounded dark:bg-black bg-gray-50 border dark:border-neutral-700 border-gray-300 dark:text-white"
                  />
              </div>
              <div className="flex items-center gap-4">
                  <input 
                    type="checkbox" 
                    checked={settings.allowSignup}
                    onChange={(e) => setSettings({...settings, allowSignup: e.target.checked})}
                    id="allowSignup"
                  />
                  <label htmlFor="allowSignup" className="dark:text-white text-gray-900">Allow Public Registration</label>
              </div>
          </div>
      </div>
  );

  const SmtpPage = () => (
      <div className="space-y-6 animate-fade-in">
          <h2 className="text-2xl font-bold dark:text-white text-gray-900">SMTP Configuration</h2>
           <div className="dark:bg-neutral-900 bg-white p-6 rounded-xl border dark:border-neutral-800 border-gray-200 shadow-sm space-y-6">
              <div className="space-y-2">
                  <label className="block text-sm dark:text-gray-400 text-gray-600">SMTP Host</label>
                  <input type="text" value={settings.smtpHost} className="w-full p-2 rounded dark:bg-black bg-gray-50 border dark:border-neutral-700 border-gray-300 dark:text-white" disabled />
              </div>
              <p className="text-sm text-yellow-500">SMTP Settings are read-only in this demo.</p>
           </div>
      </div>
  );

  const Sidebar = () => {
    const navItems: {id: Page, label: string, icon: any}[] = [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { id: 'analytics', label: 'Analytics', icon: BarChart2 },
        { id: 'videos', label: 'Videos', icon: VideoIcon },
        { id: 'ad-manager', label: 'Ad Manager', icon: DollarSign },
        { id: 'player-settings', label: 'Player Branding', icon: Palette },
        { id: 'settings', label: 'Site Settings', icon: SettingsIcon },
        { id: 'smtp', label: 'SMTP Config', icon: Mail },
    ];

    return (
        <aside className={`${sidebarOpen ? 'w-64' : 'w-20'} bg-black border-r border-neutral-800 flex flex-col transition-all duration-300 z-50 shrink-0`}>
            <div className="p-6 flex items-center gap-3 border-b border-neutral-800 h-20">
                <div className="w-8 h-8 bg-gradient-to-br from-red-600 to-red-900 rounded-lg flex items-center justify-center text-white font-bold text-xl shrink-0">S</div>
                {sidebarOpen && <span className="font-bold text-xl tracking-tight text-white whitespace-nowrap overflow-hidden">StreamFlow</span>}
            </div>
            
            <nav className="flex-1 py-6 px-3 space-y-1 overflow-y-auto">
                {navItems.map(item => (
                    <button 
                    key={item.id}
                    onClick={() => setCurrentPage(item.id)}
                    className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg transition-all duration-200 group ${currentPage === item.id ? 'bg-red-600 text-white shadow-lg shadow-red-900/20' : 'text-neutral-400 hover:bg-neutral-900 hover:text-white'}`}
                    title={item.label}
                    >
                        <item.icon size={20} className={`shrink-0 ${currentPage === item.id ? 'text-white' : 'text-neutral-500 group-hover:text-white transition-colors'}`} />
                        {sidebarOpen && <span className="font-medium whitespace-nowrap overflow-hidden">{item.label}</span>}
                    </button>
                ))}
            </nav>

            <div className="p-4 border-t border-neutral-800">
                <button onClick={handleLogout} className="w-full flex items-center gap-3 px-3 py-2 text-neutral-400 hover:text-white transition">
                    <LogOut size={20} className="shrink-0" />
                    {sidebarOpen && <span className="whitespace-nowrap overflow-hidden">Sign Out</span>}
                </button>
            </div>
        </aside>
    );
  };

  return (
    <div className={theme === 'dark' ? 'dark' : ''}>
      <div className="min-h-screen bg-gray-50 dark:bg-black text-gray-900 dark:text-white transition-colors duration-200 font-sans">
        {/* Auth Check for Render */}
        {['login', 'signup', 'forgot-password'].includes(currentPage) ? (
           currentPage === 'forgot-password' ? <ForgotPasswordPage /> : <LoginPage />
        ) : (
           <div className="flex h-screen overflow-hidden">
              <Sidebar />
              <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                 {/* Top Header */}
                 <header className="h-20 border-b dark:border-neutral-800 border-gray-200 bg-white/80 dark:bg-black/80 backdrop-blur-sm flex items-center justify-between px-4 lg:px-8 z-40 sticky top-0">
                    <div className="flex items-center gap-4">
                        <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-neutral-800 text-gray-600 dark:text-neutral-400 transition">
                            <Menu size={20} />
                        </button>
                        <h2 className="text-xl font-bold dark:text-white text-gray-900 capitalize hidden sm:block">
                            {currentPage.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                        </h2>
                    </div>
                    
                    <div className="flex items-center gap-4 lg:gap-6">
                        <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-neutral-800 text-gray-600 dark:text-neutral-400 transition">
                            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
                        </button>
                        <div className="flex items-center gap-3 pl-4 lg:pl-6 border-l dark:border-neutral-800 border-gray-200">
                            <div className="text-right hidden md:block">
                                <p className="text-sm font-bold dark:text-white text-gray-900">Admin User</p>
                                <p className="text-xs text-gray-500 dark:text-neutral-500">{user?.email}</p>
                            </div>
                            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold shadow-lg">
                                A
                            </div>
                        </div>
                    </div>
                 </header>

                 {/* Main Content Area */}
                 <main className="flex-1 overflow-y-auto p-4 lg:p-8 scroll-smooth">
                    {currentPage === 'dashboard' && <DashboardPage />}
                    {currentPage === 'videos' && <VideoListPage />}
                    {currentPage === 'add-video' && <AddVideoPage />}
                    {currentPage === 'edit-video' && <EditVideoPage />}
                    {currentPage === 'analytics' && <AnalyticsPage />}
                    {currentPage === 'ad-manager' && <AdManagerPage />}
                    {currentPage === 'player-settings' && <PlayerSettingsPage />}
                    {currentPage === 'settings' && <SettingsPage />}
                    {currentPage === 'smtp' && <SmtpPage />}
                    {currentPage === 'player-demo' && <PlayerDemoPage />}
                 </main>
              </div>
           </div>
        )}
        
        {/* Modals placed at the root level so they cover everything */}
        {showEmbedModal && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fade-in">
            <div className="dark:bg-neutral-900 bg-white border dark:border-neutral-700 border-gray-200 p-6 rounded-lg max-w-lg w-full shadow-2xl">
              <div className="flex justify-between items-center mb-4">
                <h3 className="dark:text-white text-gray-900 font-bold text-lg">Embed Video</h3>
                <button onClick={() => setShowEmbedModal(null)} className="dark:text-neutral-400 text-gray-500 hover:text-gray-900 dark:hover:text-white">
                  <X size={20} />
                </button>
              </div>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-sm dark:text-neutral-400 text-gray-600">Embed Code</label>
                    <button 
                      onClick={() => copyToClipboard(`<iframe src="${window.location.origin}?mode=embed&id=${showEmbedModal.id}&autoplay=0" width="100%" height="100%" frameborder="0" allowfullscreen allow="encrypted-media"></iframe>`, 'iframe')}
                      className="flex items-center gap-1 text-xs text-red-500 hover:text-red-400 transition"
                    >
                      {copyFeedback === 'iframe' ? <><Check size={12}/> Copied</> : <><Copy size={12}/> Copy Code</>}
                    </button>
                  </div>
                  <textarea 
                    readOnly 
                    className="w-full h-24 dark:bg-black bg-gray-100 border dark:border-neutral-700 border-gray-300 rounded p-3 dark:text-neutral-300 text-gray-800 font-mono text-xs focus:border-red-600 outline-none resize-none"
                    value={`<iframe src="${window.location.origin}?mode=embed&id=${showEmbedModal.id}&autoplay=0" width="100%" height="100%" frameborder="0" allowfullscreen allow="encrypted-media"></iframe>`}
                  />
                </div>
                <p className="text-xs text-neutral-500"><span className="text-red-500">*</span> Includes {globalAdSettings.enabled ? 'Global + Manual' : 'Manual'} ads.</p>
              </div>
            </div>
          </div>
        )}

        {videoToDelete && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fade-in">
            <div className="dark:bg-neutral-900 bg-white border dark:border-neutral-700 border-gray-200 p-6 rounded-lg max-w-md w-full shadow-2xl">
               <div className="flex flex-col items-center text-center space-y-4">
                  <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center text-red-500 mb-2">
                     <AlertCircle size={32} />
                  </div>
                  <h3 className="text-xl font-bold dark:text-white text-gray-900">Delete Video?</h3>
                  <p className="dark:text-gray-400 text-gray-600 text-sm">
                     Are you sure you want to delete <span className="font-bold">"{videoToDelete.title}"</span>? This action cannot be undone.
                  </p>
                  <div className="flex gap-3 w-full pt-2">
                     <button 
                       onClick={() => setVideoToDelete(null)}
                       className="flex-1 px-4 py-2 rounded-lg border dark:border-neutral-700 border-gray-300 dark:text-white text-gray-700 hover:bg-gray-100 dark:hover:bg-neutral-800 transition"
                     >
                       Cancel
                     </button>
                     <button 
                       onClick={confirmDelete}
                       className="flex-1 px-4 py-2 rounded-lg bg-red-600 text-white font-bold hover:bg-red-700 transition"
                     >
                       Delete
                     </button>
                  </div>
               </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}