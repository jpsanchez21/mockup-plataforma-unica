import React, { useState } from 'react';
import TopBar from './components/TopBar';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import InterventionsPage from './components/InterventionsPage';
import PlatformHome from './components/PlatformHome';
import LoginPage from './components/LoginPage';
import { useSkanviewData, useRigsMeta, TimeWindow } from './hooks/useSkanviewData';
import SkanMonitorInterventionsPage from './components/SkanMonitorInterventionsPage';
import SkanMonitorDashboard from './components/SkanMonitorDashboard';
import SkanMonitorActiveDashboard from './components/SkanMonitorActiveDashboard';
import VisualizacionPremiumTopBar from './components/VisualizacionPremiumTopBar';
import VisualizacionPremium from './components/VisualizacionPremium';
import VisualizacionPremiumInterventionsPage from './components/VisualizacionPremiumInterventionsPage';
import VisualizacionMediumTopBar from './components/VisualizacionMediumTopBar';
import VisualizacionMedium from './components/VisualizacionMedium';
import VisualizacionMediumInterventionsPage from './components/VisualizacionMediumInterventionsPage';
import VisualizacionBasicTopBar from './components/VisualizacionBasicTopBar';
import VisualizacionBasic from './components/VisualizacionBasic';
import VisualizacionBasicInterventionsPage from './components/VisualizacionBasicInterventionsPage';
import PruebaA from './components/PruebaA';
import PruebaB from './components/PruebaB';

export type PageView =
  | 'login' | 'platform'
  | 'interventions' | 'dashboard'
  | 'skanmonitor-interventions' | 'skanmonitor-dashboard'
  | 'vizpremium-interventions' | 'vizpremium-dashboard'
  | 'vizmedium-interventions' | 'vizmedium-dashboard'
  | 'vizbasic-interventions' | 'vizbasic-dashboard'
  | 'pruebaA-dashboard' | 'pruebaB-dashboard';

const queryParams = new URLSearchParams(window.location.search);
const initialApp = queryParams.get('app');

function App() {
  React.useEffect(() => {
    if (initialApp) {
      const ping = () => {
        const activeApps = JSON.parse(localStorage.getItem('skanhawk_active_apps_ping') || '{}');
        activeApps[initialApp] = Date.now();
        localStorage.setItem('skanhawk_active_apps_ping', JSON.stringify(activeApps));
      };
      const removePing = () => {
        const activeApps = JSON.parse(localStorage.getItem('skanhawk_active_apps_ping') || '{}');
        delete activeApps[initialApp];
        localStorage.setItem('skanhawk_active_apps_ping', JSON.stringify(activeApps));
      };
      ping();
      const heartbeat = setInterval(ping, 1000);
      window.addEventListener('beforeunload', removePing);
      window.addEventListener('pagehide', removePing);
      return () => {
        clearInterval(heartbeat);
        window.removeEventListener('beforeunload', removePing);
        window.removeEventListener('pagehide', removePing);
        removePing();
      };
    }
  }, []);

  const [currentPage, setCurrentPage] = useState<PageView>(
    initialApp === 'vizpremium'  ? 'vizpremium-interventions' :
    initialApp === 'vizmedium'   ? 'vizmedium-interventions' :
    initialApp === 'vizbasic'    ? 'vizbasic-interventions' :
    initialApp === 'skanview'    ? 'interventions' :
    initialApp === 'skanmonitor' ? 'skanmonitor-interventions' :
    initialApp === 'pruebaA'     ? 'pruebaA-dashboard' :
    initialApp === 'pruebaB'     ? 'pruebaB-dashboard' :
    'login'
  );

  const [userRole, setUserRole] = useState<'internal' | 'external'>('external');

  const [skanMonitorMode, setSkanMonitorMode] = useState<'activas' | 'historicas'>('activas');
  const [skanMonitorIsOffline, setSkanMonitorIsOffline] = useState(false);

  const [vizPremiumMode, setVizPremiumMode] = useState<'activas' | 'historicas'>('activas');
  const [vizMediumMode, setVizMediumMode] = useState<'activas' | 'historicas'>('activas');
  const [vizBasicMode, setVizBasicMode] = useState<'activas' | 'historicas'>('activas');

  const { rigs } = useRigsMeta();
  const [selectedRig, setSelectedRig] = useState<string>('mock-rig');
  React.useEffect(() => {
    if (rigs.length > 0 && !rigs.some(r => r.device_id === selectedRig)) {
      setSelectedRig(rigs[0].device_id);
    }
  }, [rigs]);

  const [timeRange, setTimeRange] = useState<TimeWindow>('2h');
  const { data, latestPoint, loading, meta } = useSkanviewData(timeRange, selectedRig);
  const { data: data2h } = useSkanviewData('2h', selectedRig);
  const { data: dataAll } = useSkanviewData('1d', selectedRig);

  const handleSelectApp = (appId: string) => {
    if (['skanview', 'skanmonitor', 'vizpremium', 'vizmedium', 'vizbasic', 'pruebaA', 'pruebaB'].includes(appId)) {
      window.open(window.location.origin + '?app=' + appId, '_blank');
    } else {
      alert('App no implementada en esta demo.');
    }
  };

  return (
    <div className="flex flex-col h-screen w-full overflow-hidden bg-[var(--bg-main)]">

      {currentPage === 'login' ? (
        <LoginPage onLogin={(role) => { setUserRole(role); setCurrentPage('platform'); }} />
      ) : currentPage === 'platform' ? (
        <PlatformHome
          onSelectApp={handleSelectApp}
          isInternalUser={userRole === 'internal'}
          onLogout={() => { setCurrentPage('login'); setUserRole('external'); }}
        />
      ) : (
        <>
          {/* ── SkanView TopBar ── */}
          {(currentPage === 'interventions' || currentPage === 'dashboard') && (
            <TopBar
              currentPage={currentPage}
              onGoToInterventions={() => setCurrentPage('interventions')}
              onGoHome={() => { if (initialApp) window.close(); else setCurrentPage('platform'); }}
              onLogout={() => { if (initialApp) window.close(); else { setCurrentPage('login'); setUserRole('external'); } }}
              rigs={rigs}
              selectedRig={selectedRig}
              onSelectRig={setSelectedRig}
            />
          )}

          {/* ── Premium TopBar ── */}
          {(currentPage === 'vizpremium-interventions' || (currentPage === 'vizpremium-dashboard' && vizPremiumMode !== 'historicas')) && (
            <VisualizacionPremiumTopBar
              currentPage={currentPage === 'vizpremium-interventions' ? 'interventions' : 'dashboard'}
              onGoToInterventions={() => setCurrentPage('vizpremium-interventions')}
              onGoHome={() => window.close()}
              onLogout={() => window.close()}
            />
          )}

          {/* ── Medium TopBar ── */}
          {(currentPage === 'vizmedium-interventions' || (currentPage === 'vizmedium-dashboard' && vizMediumMode !== 'historicas')) && (
            <VisualizacionMediumTopBar
              currentPage={currentPage === 'vizmedium-interventions' ? 'interventions' : 'dashboard'}
              onGoToInterventions={() => setCurrentPage('vizmedium-interventions')}
              onGoHome={() => window.close()}
              onLogout={() => window.close()}
            />
          )}

          {/* ── Basic TopBar ── */}
          {(currentPage === 'vizbasic-interventions' || (currentPage === 'vizbasic-dashboard' && vizBasicMode !== 'historicas')) && (
            <VisualizacionBasicTopBar
              currentPage={currentPage === 'vizbasic-interventions' ? 'interventions' : 'dashboard'}
              onGoToInterventions={() => setCurrentPage('vizbasic-interventions')}
              onGoHome={() => window.close()}
              onLogout={() => window.close()}
            />
          )}

          {/* ── Pages ── */}
          {currentPage === 'interventions' ? (
            <InterventionsPage onOpenDashboard={() => setCurrentPage('dashboard')} />

          ) : currentPage === 'dashboard' ? (
            <div className="flex flex-1 mt-[50px] h-[calc(100vh-50px)] overflow-hidden p-2 gap-2">
              <Sidebar />
              <main className="flex-1 overflow-hidden flex flex-col relative">
                <Dashboard
                  data={data}
                  data2h={data2h}
                  latestPoint={latestPoint}
                  loading={loading}
                  meta={meta}
                  timeRange={timeRange}
                  onTimeRangeChange={setTimeRange}
                />
              </main>
            </div>

          ) : currentPage === 'vizpremium-interventions' ? (
            <VisualizacionPremiumInterventionsPage
              initialTab={vizPremiumMode}
              onBack={() => { if (initialApp) window.close(); else setCurrentPage('platform'); }}
              onOpenIntervention={(mode, isOffline) => {
                setVizPremiumMode(mode);
                setCurrentPage(isOffline ? 'vizpremium-interventions' : 'vizpremium-dashboard');
              }}
            />

          ) : currentPage === 'vizpremium-dashboard' ? (
            vizPremiumMode === 'historicas' ? (
              <div className="flex flex-col flex-1 h-screen overflow-hidden">
                <SkanMonitorDashboard mockData={data} isHistorical={true} onBack={() => setCurrentPage('vizpremium-interventions')} />
              </div>
            ) : (
              <div className="flex flex-1 mt-[50px] h-[calc(100vh-50px)] overflow-hidden p-2 gap-2">
                <main className="flex-1 overflow-hidden flex flex-col relative">
                  <VisualizacionPremium
                    data={data} data2h={data2h} allData={dataAll}
                    latestPoint={latestPoint} loading={loading} meta={meta}
                    timeRange={timeRange} onTimeRangeChange={setTimeRange}
                    isHistorical={false}
                  />
                </main>
              </div>
            )

          ) : currentPage === 'vizmedium-interventions' ? (
            <VisualizacionMediumInterventionsPage
              initialTab={vizMediumMode}
              onBack={() => { if (initialApp) window.close(); else setCurrentPage('platform'); }}
              onOpenIntervention={(mode, isOffline) => {
                setVizMediumMode(mode);
                setCurrentPage(isOffline ? 'vizmedium-interventions' : 'vizmedium-dashboard');
              }}
            />

          ) : currentPage === 'vizmedium-dashboard' ? (
            vizMediumMode === 'historicas' ? (
              <div className="flex flex-col flex-1 h-screen overflow-hidden">
                <SkanMonitorDashboard mockData={data} isHistorical={true} onBack={() => setCurrentPage('vizmedium-interventions')} />
              </div>
            ) : (
              <div className="flex flex-1 mt-[50px] h-[calc(100vh-50px)] overflow-hidden p-2 gap-2">
                <main className="flex-1 overflow-hidden flex flex-col relative">
                  <VisualizacionMedium
                    data={data} data2h={data2h} allData={dataAll}
                    latestPoint={latestPoint} loading={loading} meta={meta}
                    timeRange={timeRange} onTimeRangeChange={setTimeRange}
                    isHistorical={false}
                  />
                </main>
              </div>
            )

          ) : currentPage === 'vizbasic-interventions' ? (
            <VisualizacionBasicInterventionsPage
              initialTab={vizBasicMode}
              onBack={() => { if (initialApp) window.close(); else setCurrentPage('platform'); }}
              onOpenIntervention={(mode, isOffline) => {
                setVizBasicMode(mode);
                setCurrentPage(isOffline ? 'vizbasic-interventions' : 'vizbasic-dashboard');
              }}
            />

          ) : currentPage === 'vizbasic-dashboard' ? (
            vizBasicMode === 'historicas' ? (
              <div className="flex flex-col flex-1 h-screen overflow-hidden">
                <SkanMonitorDashboard mockData={data} isHistorical={true} onBack={() => setCurrentPage('vizbasic-interventions')} />
              </div>
            ) : (
              <div className="flex flex-1 mt-[50px] h-[calc(100vh-50px)] overflow-hidden p-2 gap-2">
                <main className="flex-1 overflow-hidden flex flex-col relative">
                  <VisualizacionBasic
                    data={data} data2h={data2h} allData={dataAll}
                    latestPoint={latestPoint} loading={loading} meta={meta}
                    timeRange={timeRange} onTimeRangeChange={setTimeRange}
                    isHistorical={false}
                  />
                </main>
              </div>
            )

          ) : currentPage === 'pruebaA-dashboard' ? (
            <div className="flex flex-1 h-screen overflow-hidden">
              <main className="flex-1 overflow-hidden flex flex-col relative">
                <PruebaA
                  data={data} data2h={data2h} allData={dataAll}
                  latestPoint={latestPoint} loading={loading} meta={meta}
                  timeRange={timeRange} onTimeRangeChange={setTimeRange}
                  isHistorical={false}
                />
              </main>
            </div>

          ) : currentPage === 'pruebaB-dashboard' ? (
            <div className="flex flex-1 h-screen overflow-hidden">
              <main className="flex-1 overflow-hidden flex flex-col relative">
                <PruebaB
                  data={data} data2h={data2h} allData={dataAll}
                  latestPoint={latestPoint} loading={loading} meta={meta}
                  timeRange={timeRange} onTimeRangeChange={setTimeRange}
                  isHistorical={false}
                />
              </main>
            </div>

          ) : currentPage === 'skanmonitor-interventions' ? (
            <div className="flex flex-col flex-1 h-screen overflow-hidden">
              <SkanMonitorInterventionsPage
                onBack={() => setCurrentPage('platform')}
                initialTab={skanMonitorMode}
                onOpenIntervention={(mode, isOffline) => {
                  setSkanMonitorMode(mode);
                  setSkanMonitorIsOffline(!!isOffline);
                  setCurrentPage('skanmonitor-dashboard');
                }}
              />
            </div>

          ) : currentPage === 'skanmonitor-dashboard' ? (
            <div className="flex flex-col flex-1 h-screen overflow-hidden">
              {skanMonitorMode === 'historicas' ? (
                <SkanMonitorDashboard mockData={data} isHistorical={true} onBack={() => setCurrentPage('skanmonitor-interventions')} />
              ) : (
                <SkanMonitorActiveDashboard mockData={data} isOffline={skanMonitorIsOffline} onBack={() => setCurrentPage('skanmonitor-interventions')} />
              )}
            </div>

          ) : null}
        </>
      )}
    </div>
  );
}

export default App;
