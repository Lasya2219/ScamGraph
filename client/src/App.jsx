import React, { useState, useEffect } from 'react';
import SearchBar from './components/SearchBar';
import GraphCanvas from './components/GraphCanvas';
import ScamDetails from './components/ScamDetails';
import AuthModal from './components/AuthModal';
import { LoadingState, ErrorState, EmptyState } from './components/StatusStateViews';
import { checkHealth, getInvestigationGraph, getSharedIndicatorOverlaps, getMe } from './services/api';
import { ShieldAlert, Info, ChevronDown, ChevronUp, UserCheck, LogOut } from 'lucide-react';

export default function App() {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  const [selectedEntity, setSelectedEntity] = useState(null);
  const [graphData, setGraphData] = useState({ nodes: [], links: [] });
  const [overlaps, setOverlaps] = useState([]);
  const [selectedNode, setSelectedNode] = useState(null);
  const [loading, setLoading] = useState(false);
  const [dbError, setDbError] = useState(null);
  const [showGuide, setShowGuide] = useState(true);

  // Check saved JWT session on load
  useEffect(() => {
    const initAuth = async () => {
      const savedToken = localStorage.getItem('scamgraph_token');
      if (savedToken) {
        try {
          const res = await getMe();
          setUser(res.user);
          setToken(savedToken);
        } catch (err) {
          console.warn('Session expired or invalid.');
          localStorage.removeItem('scamgraph_token');
          localStorage.removeItem('scamgraph_user');
        }
      }
      setAuthLoading(false);
    };

    const initHealth = async () => {
      try {
        await checkHealth();
        setDbError(null);
      } catch (err) {
        setDbError('Backend API or CognoDB Cloud unavailable.');
      }
    };

    initAuth();
    initHealth();
  }, []);

  const handleAuthSuccess = (userData, userToken) => {
    setUser(userData);
    setToken(userToken);
  };

  const handleLogout = () => {
    localStorage.removeItem('scamgraph_token');
    localStorage.removeItem('scamgraph_user');
    setUser(null);
    setToken(null);
    setSelectedEntity(null);
    setGraphData({ nodes: [], links: [] });
    setOverlaps([]);
  };

  const handleSelectEntity = async (entity) => {
    setSelectedEntity(entity);
    setSelectedNode({ id: entity.id, name: entity.name || entity.value, type: entity.type, details: entity });
    setLoading(true);
    try {
      const [graphPayload, overlapData] = await Promise.all([
        getInvestigationGraph(entity.id),
        getSharedIndicatorOverlaps(entity.id),
      ]);
      setGraphData(graphPayload);
      setOverlaps(overlapData.overlaps || []);
      setDbError(null);
    } catch (err) {
      setDbError('Failed to fetch investigation graph relationships.');
    } finally {
      setLoading(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // Render Auth Gateway exclusively when not logged in
  if (!token) {
    return <AuthModal onAuthSuccess={handleAuthSuccess} />;
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Top Header */}
      <header className="px-8 py-4 border-b border-slate-800/80 bg-slate-900/90 backdrop-blur-md flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 bg-emerald-950 border border-emerald-800 rounded-xl shadow-lg">
            <ShieldAlert className="w-6 h-6 text-emerald-400" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-xl font-extrabold text-slate-100 tracking-tight">ScamGraph</h1>
              <span className="text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 bg-emerald-950 text-emerald-400 border border-emerald-800 rounded-full">
                Intel Platform
              </span>
            </div>
            <p className="text-xs text-slate-400">Cyber Scam Intelligence & Mule Indicator Discovery Platform</p>
          </div>
        </div>

        {/* User Status / Logout Bar */}
        {user && (
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2.5 px-3.5 py-1.5 bg-slate-900 border border-slate-800 rounded-xl text-xs">
              <UserCheck className="w-4 h-4 text-emerald-400" />
              <span className="text-slate-400">Analyst:</span>
              <span className="font-semibold text-slate-100">{user.name}</span>
            </div>
            <button
              onClick={handleLogout}
              className="p-2 bg-slate-900 hover:bg-red-950/50 text-slate-400 hover:text-red-400 border border-slate-800 hover:border-red-800 rounded-xl transition"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        )}
      </header>

      {/* Main Container */}
      <main className="flex-1 p-6 md:p-8 max-w-7xl mx-auto w-full space-y-6">
        
        {/* Self-Explanatory Platform Guide Banner */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl overflow-hidden shadow-xl transition">
          <div
            onClick={() => setShowGuide(!showGuide)}
            className="px-6 py-3.5 bg-slate-900 hover:bg-slate-850 cursor-pointer flex justify-between items-center border-b border-slate-800/60"
          >
            <div className="flex items-center space-x-2 text-emerald-400 text-xs font-bold uppercase tracking-wider">
              <Info className="w-4 h-4" />
              <span>Platform Purpose & Investigation Workflow Guide</span>
            </div>
            <button className="text-slate-400 hover:text-slate-200 text-xs flex items-center gap-1">
              {showGuide ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
          </div>

          {showGuide && (
            <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-slate-300 bg-slate-950/40">
              <div className="p-3.5 bg-slate-900/80 border border-slate-800 rounded-xl space-y-1">
                <span className="font-bold text-emerald-400 text-sm">1. Search & Target</span>
                <p className="text-slate-400 text-[11px]">
                  Input a phone number (<code className="text-emerald-300">+91-90000-00001</code>), UPI handle (<code className="text-emerald-300">fastpay-mule@example.test</code>), or syndicate name.
                </p>
              </div>

              <div className="p-3.5 bg-slate-900/80 border border-slate-800 rounded-xl space-y-1">
                <span className="font-bold text-emerald-400 text-sm">2. Traverse Graph</span>
                <p className="text-slate-400 text-[11px]">
                  Graph automatically maps: <br />
                  <code className="text-slate-200 font-mono">Actor ➔ Campaign ➔ Indicator ➔ Incident ➔ Org</code>
                </p>
              </div>

              <div className="p-3.5 bg-slate-900/80 border border-slate-800 rounded-xl space-y-1">
                <span className="font-bold text-emerald-400 text-sm">3. Detect Shared Mules</span>
                <p className="text-slate-400 text-[11px]">
                  Uncover hidden links when multiple scam campaigns share the exact same payment indicator or phone number.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Search Section */}
        <div className="flex justify-center">
          <SearchBar onSelectEntity={handleSelectEntity} />
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-medium bg-slate-900/90 px-6 py-3 rounded-2xl border border-slate-800">
          <span className="flex items-center"><span className="w-2.5 h-2.5 rounded-full bg-red-500 mr-2 shadow-sm"></span> ScamActor</span>
          <span className="flex items-center"><span className="w-2.5 h-2.5 rounded-full bg-amber-500 mr-2 shadow-sm"></span> ScamCampaign</span>
          <span className="flex items-center"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500 mr-2 shadow-sm"></span> Indicator</span>
          <span className="flex items-center"><span className="w-2.5 h-2.5 rounded-full bg-purple-500 mr-2 shadow-sm"></span> ScamType</span>
          <span className="flex items-center"><span className="w-2.5 h-2.5 rounded-full bg-orange-500 mr-2 shadow-sm"></span> Incident</span>
          <span className="flex items-center"><span className="w-2.5 h-2.5 rounded-full bg-blue-500 mr-2 shadow-sm"></span> Organization</span>
        </div>

        {/* Status Error View */}
        {dbError && <ErrorState message={dbError} onRetry={() => window.location.reload()} />}

        {/* Graph & Details Grid */}
        {!dbError && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
            <div className="lg:col-span-2">
              {loading ? (
                <LoadingState />
              ) : graphData.nodes.length > 0 ? (
                <GraphCanvas graphData={graphData} onNodeSelect={(node) => setSelectedNode(node)} />
              ) : (
                <EmptyState />
              )}
            </div>

            <div>
              <ScamDetails selectedNode={selectedNode} overlaps={overlaps} />
            </div>
          </div>
        )}
      </main>
    </div>
  );
}