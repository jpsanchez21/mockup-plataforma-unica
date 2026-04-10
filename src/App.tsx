import React, { useState } from 'react';
import TopBar from './components/TopBar';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import InterventionsPage from './components/InterventionsPage';
import { useSkanviewData, TimeWindow } from './hooks/useSkanviewData';

export type PageView = 'interventions' | 'dashboard';

function App() {
  const [currentPage, setCurrentPage] = useState<PageView>('interventions');
  
  const [timeRange, setTimeRange] = useState<TimeWindow>('2h');
  const { data, latestPoint, loading, meta } = useSkanviewData(timeRange);
  const { data: data2h } = useSkanviewData('2h');

  return (
    <div className="flex flex-col h-screen w-full overflow-hidden bg-[var(--bg-main)]">
      <TopBar 
         currentPage={currentPage}
         onGoToInterventions={() => setCurrentPage('interventions')} 
      />
      
      {currentPage === 'interventions' ? (
         <InterventionsPage onOpenDashboard={() => setCurrentPage('dashboard')} />
      ) : (
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
      )}
    </div>
  );
}

export default App;
