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
  Save
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
  const [showEmbedModal, setShowEmbedModal] = useState<Video | null>(null);
  const [copyFeedback, setCopyFeedback] = useState<string | null>(null);

  // Apply Theme Class
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

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

  // Delete Video Handler
  const deleteVideo = (id: string) => {
    if (confirm('Are you sure you want to delete this video? This action cannot be undone.')) {
      setVideos(videos.filter(v => v.id !== id));
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
                          <button onClick={() => deleteVideo(video.id)} className="p-2 hover:bg-red-900/30 rounded text-red-500 hover:text-red-400" title="Delete Video">
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
      if (!title || !url || !thumbnail) {
        alert("Please fill in all fields.");
        return;
      }

      const newVideo: Video = {
        id: Date.now().toString(),
        title,
        url,
        thumbnail,
        duration: duration || 600, // Default 10 min if not specified
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
                 <label className="block text-sm font-medium dark:text-neutral-400 text-gray-700 mb-2">Video Title</label>
                 <input 
                   type="text" 
                   value={title} 
                   onChange={(e) => setTitle(e.target.value)}
                   className="w-full dark:bg-black bg-gray-50 border dark:border-neutral-700 border-gray-300 rounded-lg py-3 px-4 dark:text-white text-gray-900 outline-none focus:border-red-600"
                   placeholder="e.g. My Awesome Video"
                 />
              </div>

              <div>
                 <label className="block text-sm font-medium dark:text-neutral-400 text-gray-700 mb-2">Video Source URL (R2/S3 Direct Link)</label>
                 <div className="relative">
                    <Server className="absolute left-3 top-3 dark:text-neutral-500 text-gray-400" size={18} />
                    <input 
                      type="text" 
                      value={url} 
                      onChange={(e) => setUrl(e.target.value)}
                      className="w-full dark:bg-black bg-gray-50 border dark:border-neutral-700 border-gray-300 rounded-lg py-3 pl-10 dark:text-white text-gray-900 outline-none focus:border-red-600"
                      placeholder="https://pub-xxxx.r2.dev/video.mp4"
                    />
                 </div>
                 <p className="text-xs dark:text-neutral-500 text-gray-500 mt-2">Make sure the file is public or the URL contains a valid token.</p>
              </div>

              <div>
                 <label className="block text-sm font-medium dark:text-neutral-400 text-gray-700 mb-2">Thumbnail URL</label>
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
                 <label className="block text-sm font-medium dark:text-neutral-400 text-gray-700 mb-2">Duration (Seconds)</label>
                 <div className="relative">
                    <Clock className="absolute left-3 top-3 dark:text-neutral-500 text-gray-400" size={18} />
                    <input 
                      type="number" 
                      value={duration} 
                      onChange={(e) => setDuration(parseInt(e.target.value))}
                      className="w-full dark:bg-black bg-gray-50 border dark:border-neutral-700 border-gray-300 rounded-lg py-3 pl-10 dark:text-white text-gray-900 outline-none focus:border-red-600"
                      placeholder="600"
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
    if (!editingVideo) {
      setCurrentPage('videos');
      return null;
    }

    const [title, setTitle] = useState(editingVideo.title);
    const [url, setUrl] = useState(editingVideo.url);
    const [thumbnail, setThumbnail] = useState(editingVideo.thumbnail);
    const [duration, setDuration] = useState(editingVideo.duration);

    const handleSubmit = () => {
      const updatedVideos = videos.map(v => 
        v.id === editingVideo.id 
          ? { ...v, title, url, thumbnail, duration }
          : v
      );
      setVideos(updatedVideos);
      setCurrentPage('videos');
      setEditingVideo(null);
    };

    return (
      <div className="max-w-2xl mx-auto space-y-8 animate-fade-in">
        <h2 className="text-2xl font-bold dark:text-white text-gray-900 flex items-center gap-2">
          <Edit className="text-blue-500" /> Edit Video
        </h2>
        
        <div className="dark:bg-neutral-900 bg-white p-8 rounded-xl border dark:border-neutral-800 border-gray-200 shadow-sm space-y-6">
           <div>
              <label className="block text-sm font-medium dark:text-neutral-400 text-gray-700 mb-2">Video Title</label>
              <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full dark:bg-black bg-gray-50 border dark:border-neutral-700 border-gray-300 rounded-lg py-3 px-4 dark:text-white text-gray-900 outline-none focus:border-red-600" />
           </div>
           <div>
              <label className="block text-sm font-medium dark:text-neutral-400 text-gray-700 mb-2">Video Source URL</label>
              <input type="text" value={url} onChange={(e) => setUrl(e.target.value)} className="w-full dark:bg-black bg-gray-50 border dark:border-neutral-700 border-gray-300 rounded-lg py-3 px-4 dark:text-white text-gray-900 outline-none focus:border-red-600" />
           </div>
           <div>
              <label className="block text-sm font-medium dark:text-neutral-400 text-gray-700 mb-2">Thumbnail URL</label>
              <input type="text" value={thumbnail} onChange={(e) => setThumbnail(e.target.value)} className="w-full dark:bg-black bg-gray-50 border dark:border-neutral-700 border-gray-300 rounded-lg py-3 px-4 dark:text-white text-gray-900 outline-none focus:border-red-600" />
           </div>
           <div>
              <label className="block text-sm font-medium dark:text-neutral-400 text-gray-700 mb-2">Duration (Seconds)</label>
              <input type="number" value={duration} onChange={(e) => setDuration(parseInt(e.target.value))} className="w-full dark:bg-black bg-gray-50 border dark:border-neutral-700 border-gray-300 rounded-lg py-3 px-4 dark:text-white text-gray-900 outline-none focus:border-red-600" />
           </div>
           
           <div className="mt-8 flex justify-end gap-4">
              <button onClick={() => setCurrentPage('videos')} className="px-6 py-3 rounded-lg dark:text-neutral-400 text-gray-600 hover:bg-gray-100 dark:hover:bg-neutral-800 transition">Cancel</button>
              <button onClick={handleSubmit} className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg shadow-lg flex items-center gap-2">
                 <Save size={18}/> Save Changes
              </button>
           </div>
        </div>
      </div>
    );
  };

  const AnalyticsPage = () => {
    const data = [
      { name: 'Mon', views: 4000, revenue: 2400 },
      { name: 'Tue', views: 3000, revenue: 1398 },
      { name: 'Wed', views: 2000, revenue: 9800 },
      { name: 'Thu', views: 2780, revenue: 3908 },
      { name: 'Fri', views: 1890, revenue: 4800 },
      { name: 'Sat', views: 2390, revenue: 3800 },
      { name: 'Sun', views: 3490, revenue: 4300 },
    ];

    return (
      <div className="space-y-6 animate-fade-in">
        <h2 className="text-2xl font-bold dark:text-white text-gray-900">Analytics</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
           <div className="dark:bg-neutral-900 bg-white p-6 rounded-xl border dark:border-neutral-800 border-gray-200 shadow-sm">
              <h3 className="mb-4 text-lg font-semibold dark:text-white text-gray-900">Views Overview</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={data}>
                    <defs>
                      <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#ef4444" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="name" stroke="#9ca3af" />
                    <YAxis stroke="#9ca3af" />
                    <Tooltip contentStyle={{ backgroundColor: '#171717', border: '1px solid #404040' }} />
                    <Area type="monotone" dataKey="views" stroke="#ef4444" fillOpacity={1} fill="url(#colorViews)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
           </div>
           {/* Revenue Chart */}
           <div className="dark:bg-neutral-900 bg-white p-6 rounded-xl border dark:border-neutral-800 border-gray-200 shadow-sm">
              <h3 className="mb-4 text-lg font-semibold dark:text-white text-gray-900">Revenue</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="name" stroke="#9ca3af" />
                    <YAxis stroke="#9ca3af" />
                    <Tooltip contentStyle={{ backgroundColor: '#171717', border: '1px solid #404040' }} />
                    <Bar dataKey="revenue" fill="#10b981" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
           </div>
        </div>
      </div>
    );
  };

  const PlayerSettingsPage = () => {
     return (
        <div className="max-w-4xl mx-auto animate-fade-in space-y-6">
           <h2 className="text-2xl font-bold dark:text-white text-gray-900">Player Branding & Settings</h2>
           <div className="dark:bg-neutral-900 bg-white p-8 rounded-xl border dark:border-neutral-800 border-gray-200 shadow-sm space-y-6">
              <div>
                 <label className="block text-sm font-medium dark:text-neutral-400 text-gray-700 mb-2">Primary Color</label>
                 <div className="flex items-center gap-4">
                    <input type="color" value={playerSettings.primaryColor} onChange={(e) => setPlayerSettings({...playerSettings, primaryColor: e.target.value})} className="h-10 w-20 rounded cursor-pointer" />
                    <span className="dark:text-white text-gray-900">{playerSettings.primaryColor}</span>
                 </div>
              </div>
              <div>
                 <label className="block text-sm font-medium dark:text-neutral-400 text-gray-700 mb-2">Logo URL (Watermark)</label>
                 <input type="text" value={playerSettings.logoUrl} onChange={(e) => setPlayerSettings({...playerSettings, logoUrl: e.target.value})} className="w-full dark:bg-black bg-gray-50 border dark:border-neutral-700 border-gray-300 rounded-lg p-3 dark:text-white text-gray-900 outline-none focus:border-red-600" placeholder="https://..." />
              </div>
              <div className="grid grid-cols-2 gap-4">
                 <div>
                    <label className="block text-sm font-medium dark:text-neutral-400 text-gray-700 mb-2">Logo Position</label>
                    <select value={playerSettings.logoPosition} onChange={(e) => setPlayerSettings({...playerSettings, logoPosition: e.target.value as any})} className="w-full dark:bg-black bg-gray-50 border dark:border-neutral-700 border-gray-300 rounded-lg p-3 dark:text-white text-gray-900 outline-none focus:border-red-600">
                       <option value="top-left">Top Left</option>
                       <option value="top-right">Top Right</option>
                       <option value="bottom-left">Bottom Left</option>
                       <option value="bottom-right">Bottom Right</option>
                    </select>
                 </div>
                 <div>
                    <label className="block text-sm font-medium dark:text-neutral-400 text-gray-700 mb-2">Logo Opacity</label>
                    <input type="range" min="0" max="1" step="0.1" value={playerSettings.logoOpacity} onChange={(e) => setPlayerSettings({...playerSettings, logoOpacity: parseFloat(e.target.value)})} className="w-full" />
                 </div>
              </div>
              <div className="flex items-center gap-2">
                 <input type="checkbox" checked={playerSettings.autoPlay} onChange={(e) => setPlayerSettings({...playerSettings, autoPlay: e.target.checked})} className="w-4 h-4 text-red-600 rounded" />
                 <label className="dark:text-white text-gray-900">Auto-play videos by default</label>
              </div>
              <div className="pt-4 border-t dark:border-neutral-800 border-gray-200">
                 <h3 className="text-lg font-bold dark:text-white text-gray-900 mb-4">Preview</h3>
                 <div className="max-w-md">
                   <CustomVideoPlayer video={MOCK_VIDEOS[0]} settings={playerSettings} />
                 </div>
              </div>
           </div>
        </div>
     );
  };

  const AdManagerPage = () => {
    return (
      <div className="animate-fade-in space-y-6">
        <h2 className="text-2xl font-bold dark:text-white text-gray-900">Ad Manager</h2>
        <div className="dark:bg-neutral-900 bg-white p-8 rounded-xl border dark:border-neutral-800 border-gray-200 shadow-sm space-y-6">
           <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold dark:text-white text-gray-900">Global Ad Injection</h3>
              <div className="flex items-center gap-2">
                <span className="text-sm dark:text-neutral-400 text-gray-600">{globalAdSettings.enabled ? 'Enabled' : 'Disabled'}</span>
                <button 
                  onClick={() => setGlobalAdSettings({...globalAdSettings, enabled: !globalAdSettings.enabled})}
                  className={`w-12 h-6 rounded-full transition-colors relative ${globalAdSettings.enabled ? 'bg-green-600' : 'bg-neutral-600'}`}
                >
                   <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform shadow-sm ${globalAdSettings.enabled ? 'translate-x-7' : 'translate-x-1'}`}></div>
                </button>
              </div>
           </div>

           {globalAdSettings.enabled && (
             <div className="space-y-4 p-4 rounded-lg bg-gray-50 dark:bg-black/20 border dark:border-neutral-800 border-gray-200">
                <div>
                   <label className="block text-sm font-medium dark:text-neutral-400 text-gray-700 mb-2">Injection Interval (Minutes)</label>
                   <input type="number" value={globalAdSettings.intervalMinutes} onChange={(e) => setGlobalAdSettings({...globalAdSettings, intervalMinutes: parseInt(e.target.value)})} className="w-full dark:bg-black bg-white border dark:border-neutral-700 border-gray-300 rounded p-2 dark:text-white text-gray-900" />
                </div>
                <div>
                   <label className="block text-sm font-medium dark:text-neutral-400 text-gray-700 mb-2">Mode</label>
                   <select value={globalAdSettings.mode} onChange={(e) => setGlobalAdSettings({...globalAdSettings, mode: e.target.value as any})} className="w-full dark:bg-black bg-white border dark:border-neutral-700 border-gray-300 rounded p-2 dark:text-white text-gray-900">
                      <option value="direct">Direct Link (Simple)</option>
                      <option value="campaign">Campaign Based</option>
                   </select>
                </div>
                
                {globalAdSettings.mode === 'direct' ? (
                   <>
                     <div>
                       <label className="block text-sm font-medium dark:text-neutral-400 text-gray-700 mb-2">Ad Video URL</label>
                       <input type="text" value={globalAdSettings.videoSrc} onChange={(e) => setGlobalAdSettings({...globalAdSettings, videoSrc: e.target.value})} className="w-full dark:bg-black bg-white border dark:border-neutral-700 border-gray-300 rounded p-2 dark:text-white text-gray-900" />
                     </div>
                     <div>
                       <label className="block text-sm font-medium dark:text-neutral-400 text-gray-700 mb-2">Redirect URL</label>
                       <input type="text" value={globalAdSettings.redirectUrl} onChange={(e) => setGlobalAdSettings({...globalAdSettings, redirectUrl: e.target.value})} className="w-full dark:bg-black bg-white border dark:border-neutral-700 border-gray-300 rounded p-2 dark:text-white text-gray-900" />
                     </div>
                   </>
                ) : (
                   <div>
                       <label className="block text-sm font-medium dark:text-neutral-400 text-gray-700 mb-2">Select Campaign</label>
                       <select value={globalAdSettings.campaignId} onChange={(e) => setGlobalAdSettings({...globalAdSettings, campaignId: e.target.value})} className="w-full dark:bg-black bg-white border dark:border-neutral-700 border-gray-300 rounded p-2 dark:text-white text-gray-900">
                          <option value="">-- Select Campaign --</option>
                          {campaigns.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                       </select>
                   </div>
                )}
             </div>
           )}
        </div>
      </div>
    );
  };

  const SettingsPage = () => {
    return (
      <div className="max-w-4xl mx-auto animate-fade-in space-y-6">
        <h2 className="text-2xl font-bold dark:text-white text-gray-900">General Settings</h2>
        <div className="dark:bg-neutral-900 bg-white p-8 rounded-xl border dark:border-neutral-800 border-gray-200 shadow-sm space-y-6">
            <div>
               <label className="block text-sm font-medium dark:text-neutral-400 text-gray-700 mb-2">Site Name</label>
               <input type="text" value={settings.siteName} onChange={(e) => setSettings({...settings, siteName: e.target.value})} className="w-full dark:bg-black bg-white border dark:border-neutral-700 border-gray-300 rounded p-3 dark:text-white text-gray-900 outline-none" />
            </div>
            <div className="flex items-center gap-2">
               <input type="checkbox" checked={settings.allowSignup} onChange={(e) => setSettings({...settings, allowSignup: e.target.checked})} className="w-4 h-4" />
               <label className="dark:text-white text-gray-900">Allow User Registration</label>
            </div>
            <div className="flex items-center gap-2">
               <input type="checkbox" checked={settings.maintenanceMode} onChange={(e) => setSettings({...settings, maintenanceMode: e.target.checked})} className="w-4 h-4" />
               <label className="dark:text-white text-gray-900">Maintenance Mode</label>
            </div>
        </div>
      </div>
    );
  };

  const SMTPPage = () => {
    return (
       <div className="max-w-4xl mx-auto animate-fade-in space-y-6">
        <h2 className="text-2xl font-bold dark:text-white text-gray-900">SMTP Configuration</h2>
        <div className="dark:bg-neutral-900 bg-white p-8 rounded-xl border dark:border-neutral-800 border-gray-200 shadow-sm space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium dark:text-neutral-400 text-gray-700 mb-2">SMTP Host</label>
                <input type="text" value={settings.smtpHost} onChange={(e) => setSettings({...settings, smtpHost: e.target.value})} className="w-full dark:bg-black bg-white border dark:border-neutral-700 border-gray-300 rounded p-3 dark:text-white text-gray-900 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium dark:text-neutral-400 text-gray-700 mb-2">SMTP Port</label>
                <input type="number" value={settings.smtpPort} onChange={(e) => setSettings({...settings, smtpPort: parseInt(e.target.value)})} className="w-full dark:bg-black bg-white border dark:border-neutral-700 border-gray-300 rounded p-3 dark:text-white text-gray-900 outline-none" />
              </div>
            </div>
            <div>
                <label className="block text-sm font-medium dark:text-neutral-400 text-gray-700 mb-2">SMTP User</label>
                <input type="text" value={settings.smtpUser} onChange={(e) => setSettings({...settings, smtpUser: e.target.value})} className="w-full dark:bg-black bg-white border dark:border-neutral-700 border-gray-300 rounded p-3 dark:text-white text-gray-900 outline-none" />
            </div>
            <div>
                <label className="block text-sm font-medium dark:text-neutral-400 text-gray-700 mb-2">SMTP Password</label>
                <input type="password" value={settings.smtpPass} onChange={(e) => setSettings({...settings, smtpPass: e.target.value})} className="w-full dark:bg-black bg-white border dark:border-neutral-700 border-gray-300 rounded p-3 dark:text-white text-gray-900 outline-none" />
            </div>
        </div>
      </div>
    );
  };

  if (!user && !['login', 'signup', 'forgot-password'].includes(currentPage)) setCurrentPage('login');
  if (currentPage === 'login') return <LoginPage />;
  if (currentPage === 'forgot-password') return <ForgotPasswordPage />;
  if (currentPage === 'player-demo' && demoVideo) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-5xl"><div className="flex justify-between items-center mb-4"><h2 className="text-white font-bold text-xl">{demoVideo.title} (Preview)</h2><button onClick={() => setCurrentPage('videos')} className="text-neutral-400 hover:text-white flex items-center gap-2"><X size={20} /> Close Preview</button></div>
        <CustomVideoPlayer 
          video={demoVideo} 
          autoPlay 
          settings={playerSettings} 
        />
        <div className="mt-8 text-neutral-500 text-sm"><p>Showing effective ads (Manual + Global if enabled).</p></div></div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen font-sans flex overflow-hidden transition-colors duration-300 ${theme === 'dark' ? 'dark bg-black text-neutral-200' : 'bg-gray-50 text-gray-900'}`}>
      <aside className={`fixed lg:relative z-20 h-full border-r transition-all duration-300 flex flex-col ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0 lg:w-20 lg:hover:w-64 group'} ${theme === 'dark' ? 'bg-black border-neutral-800' : 'bg-white border-gray-200'}`}>
        <div className={`h-16 flex items-center px-6 border-b shrink-0 ${theme === 'dark' ? 'border-neutral-800' : 'border-gray-200'}`}>
          <div className="flex items-center gap-2 text-red-600 font-bold text-xl tracking-tighter"><PlayCircle size={28} /><span className={`lg:group-hover:block ${!sidebarOpen && 'lg:hidden'}`}>StreamFlow</span></div>
        </div>
        <nav className="p-4 space-y-2 flex-1 overflow-y-auto">
          {[
            { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
            { id: 'analytics', icon: BarChart2, label: 'Analytics' }, // Moved Analytics here
            { id: 'videos', icon: VideoIcon, label: 'Videos' },
            { id: 'player-settings', icon: MonitorPlay, label: 'Player' },
            { id: 'ad-manager', icon: Megaphone, label: 'Ad Manager' },
            { id: 'smtp', icon: Mail, label: 'SMTP Config' },
            { id: 'settings', icon: SettingsIcon, label: 'Settings' },
          ].map((item) => (
            <button key={item.id} onClick={() => setCurrentPage(item.id as Page)} className={`w-full flex items-center gap-4 px-4 py-3 rounded-lg transition-colors ${currentPage === item.id ? 'bg-red-600 text-white' : theme === 'dark' ? 'text-neutral-400 hover:bg-neutral-800 hover:text-white' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'}`}>
              <item.icon size={20} /><span className={`lg:group-hover:block ${!sidebarOpen && 'lg:hidden'}`}>{item.label}</span>
            </button>
          ))}
        </nav>
        <div className={`p-4 border-t shrink-0 ${theme === 'dark' ? 'border-neutral-800' : 'border-gray-200'}`}>
           <button onClick={handleLogout} className={`w-full flex items-center gap-4 px-4 py-3 rounded-lg transition-colors ${theme === 'dark' ? 'text-neutral-400 hover:bg-neutral-800 hover:text-white' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'}`}>
             <LogOut size={20} /><span className={`lg:group-hover:block ${!sidebarOpen && 'lg:hidden'}`}>Sign Out</span>
           </button>
        </div>
      </aside>
      <main className={`flex-1 h-screen overflow-y-auto ${theme === 'dark' ? 'bg-[#0a0a0a]' : 'bg-gray-50'}`}>
        <header className={`h-16 backdrop-blur-md border-b sticky top-0 z-10 flex items-center justify-between px-6 ${theme === 'dark' ? 'bg-black/50 border-neutral-800' : 'bg-white/80 border-gray-200'}`}>
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="lg:hidden p-2 dark:text-white text-gray-900"><Menu size={24} /></button>
          <div className="flex-1"></div>
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className={`p-2 rounded-full transition-colors ${theme === 'dark' ? 'bg-neutral-800 text-yellow-400 hover:bg-neutral-700' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
              title="Toggle Theme"
            >
              {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <div className="text-right hidden md:block"><p className={`text-sm font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Admin User</p><p className="text-xs text-neutral-500">{user?.email}</p></div>
            <div className={`w-10 h-10 rounded-full flex items-center justify-center text-red-600 border ${theme === 'dark' ? 'bg-neutral-800 border-neutral-700' : 'bg-gray-200 border-gray-300'}`}><User size={20} /></div>
          </div>
        </header>
        <div className="p-6 md:p-8 max-w-7xl mx-auto">
          {currentPage === 'dashboard' && <DashboardPage />}
          {currentPage === 'videos' && <VideoListPage />}
          {currentPage === 'player-settings' && <PlayerSettingsPage />}
          {currentPage === 'ad-manager' && <AdManagerPage />}
          {currentPage === 'analytics' && <AnalyticsPage />} 
          {currentPage === 'edit-video' && <EditVideoPage />}
          {currentPage === 'add-video' && <AddVideoPage />}
          {currentPage === 'settings' && <SettingsPage />} 
          {currentPage === 'smtp' && <SMTPPage />}
        </div>
      </main>
      {showEmbedModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
          <div className="dark:bg-neutral-900 bg-white border dark:border-neutral-700 border-gray-200 p-6 rounded-lg max-w-lg w-full animate-fade-in shadow-xl">
            <div className="flex justify-between items-center mb-4"><h3 className="dark:text-white text-gray-900 font-bold text-lg">Embed Video</h3><button onClick={() => setShowEmbedModal(null)} className="dark:text-neutral-400 text-gray-500 hover:text-gray-900 dark:hover:text-white"><X size={20} /></button></div>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-2"><label className="text-sm dark:text-neutral-400 text-gray-600">Embed Code</label><button onClick={() => copyToClipboard(`<iframe src="https://player.streamflow.com/embed/${showEmbedModal.id}" width="100%" height="450" frameborder="0" allowfullscreen></iframe>`, 'iframe')} className="flex items-center gap-1 text-xs text-red-500 hover:text-red-400 transition">{copyFeedback === 'iframe' ? <><Check size={12}/> Copied</> : <><Copy size={12}/> Copy Code</>}</button></div>
                <textarea readOnly className="w-full h-24 dark:bg-black bg-gray-100 border dark:border-neutral-700 border-gray-300 rounded p-3 dark:text-neutral-300 text-gray-800 font-mono text-xs focus:border-red-600 outline-none resize-none" value={`<iframe src="https://player.streamflow.com/embed/${showEmbedModal.id}" width="100%" height="450" frameborder="0" allowfullscreen></iframe>`}/>
              </div>
              <p className="text-xs text-neutral-500"><span className="text-red-500">*</span> Includes {globalAdSettings.enabled ? 'Global + Manual' : 'Manual'} ads.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}