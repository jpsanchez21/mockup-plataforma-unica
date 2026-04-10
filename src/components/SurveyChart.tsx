// src/components/SurveyChart.tsx
import React from 'react';
import { useSkanviewData } from '../hooks/useSkanviewData';

const SurveyChart: React.FC = () => {
  const { latestPoint } = useSkanviewData('2h');
  const currentDepth = latestPoint?.depth || 1994; 
  const maxDepthVisible = 8000;

  // S-Curve points roughly matching the visual mockup
  const surveyPath = [
    { x: 0,    y: 0 },
    { x: 20,   y: 1000 },
    { x: 100,  y: 2000 },
    { x: 500,  y: 4000 },
    { x: 1000, y: 5500 },
    { x: 1500, y: 7000 },
    { x: 1994, y: 8000 },
  ];

  // Make mapping smaller vertically so we are 100% sure the text under the graph is not hidden
  const mapX = (x: number) => (x / 1994) * 140 + 35;
  const mapY = (y: number) => (y / 8000) * 165 + 30; // Increased height to 165

  const points = surveyPath.map(p => `${mapX(p.x)},${mapY(p.y)}`).join(' ');

  const getInterpolatedPoint = (depth: number) => {
    const d = Math.min(depth, 8000);
    for (let i = 0; i < surveyPath.length - 1; i++) {
      if (d >= surveyPath[i].y && d <= surveyPath[i+1].y) {
        const t = (d - surveyPath[i].y) / (surveyPath[i+1].y - surveyPath[i].y);
        return {
          x: surveyPath[i].x + t * (surveyPath[i+1].x - surveyPath[i].x),
          y: d
        };
      }
    }
    return surveyPath[surveyPath.length - 1];
  };

  const currentPt = getInterpolatedPoint(currentDepth);
  const currentPathIdx = surveyPath.findIndex(p => p.y >= currentDepth);
  const visibleSegments = currentPathIdx <= 0 ? [surveyPath[0]] : surveyPath.slice(0, currentPathIdx);
  const bluePoints = [...visibleSegments, currentPt].map(p => `${mapX(p.x)},${mapY(p.y)}`).join(' ');

  return (
    <div className="flex flex-col h-full w-full bg-transparent p-1 select-none overflow-hidden">
      {/* Title */}
      <div className="text-center pt-2">
        <span className="text-[12px] font-black text-white uppercase tracking-widest leading-none">SURVEY</span>
      </div>

      <div className="flex-1 flex relative items-center justify-center p-2">
        {/* Main Trajectory Area */}
        <div className="flex-1 h-full relative border-r border-transparent">
          <svg viewBox="0 0 240 250" className="absolute top-0 left-0 w-full h-full" preserveAspectRatio="xMidYMid meet">
            {/* Trajectory Background (The "S" tube) */}
            <polyline 
              points={points} 
              fill="none" 
              stroke="#666" 
              strokeWidth="9" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            />
            {/* Dots inside the tube */}
            {surveyPath.map((p, i) => (
              <circle key={i} cx={mapX(p.x)} cy={mapY(p.y)} r="1.2" fill="white" />
            ))}

            {/* Current Path Progress (Blue indicator) */}
            <polyline 
              points={bluePoints} 
              fill="none" 
              stroke="#00A3FF" 
              strokeWidth="3.5" 
              strokeLinecap="round" 
              strokeLinejoin="round"
              className="drop-shadow-[0_0_5px_#00A3FF]"
            />
            {/* Blue dots on progress */}
            {surveyPath.filter(p => p.y <= currentDepth).map((p, i) => (
              <circle key={i} cx={mapX(p.x)} cy={mapY(p.y)} r="1.5" fill="white" stroke="#00A3FF" strokeWidth="0.8" />
            ))}
            <circle cx={mapX(currentPt.x)} cy={mapY(currentPt.y)} r="2.2" fill="white" stroke="#00A3FF" strokeWidth="1.2" />

            {/* Horizontal Axis (V Sec) */}
            {/* Fixed base at Y=215 so there are 35 SVG units beneath it for text */}
            <line x1="35" y1="215" x2="175" y2="215" stroke="white" strokeWidth="0.8" />
            <text x="15" y="228" fill="white" fontSize="8" textAnchor="middle">-200</text>
            <text x="35" y="228" fill="white" fontSize="8" textAnchor="middle">0</text>
            <text x="70" y="228" fill="white" fontSize="8" textAnchor="middle">500</text>
            <text x="105" y="228" fill="white" fontSize="8" textAnchor="middle">1000</text>
            <text x="140" y="228" fill="white" fontSize="8" textAnchor="middle">1500</text>
            <text x="175" y="228" fill="white" fontSize="8" textAnchor="middle">1994</text>
            <text x="105" y="243" fill="white" fontSize="10" fontWeight="bold" textAnchor="middle">V Sec. (ft)</text>

            {/* Vertical Axis (Depth) - Multi-labels */}
            {[0, 2000, 4000, 6000, 8000].map(d => (
              <g key={d}>
                <line x1="190" y1={mapY(d)} x2="198" y2={mapY(d)} stroke="white" strokeWidth="0.8" />
                <text x="185" y={mapY(d) + 3} fill="white" fontSize="8" textAnchor="end">{d} ft</text>
              </g>
            ))}
          </svg>
        </div>

        {/* Depth Bar (Right side) */}
        <div className="w-8 flex flex-col items-center h-[85%] relative z-10 pt-4">
           {/* Limit the bar height mathematically relative to the container */}
           <div className="w-5 bg-[#8BC34A] rounded shadow-[0_0_8px_rgba(139,195,74,0.3)] border border-white/10" style={{ height: 'calc(100% - 16px)' }} />
           {/* Current depth indicator arrow on the bar */}
           <div 
             className="absolute w-0 h-0 border-t-[4px] border-t-transparent border-b-[4px] border-b-transparent border-r-[6px] border-r-white -left-1"
             style={{ top: `calc(${4 + (currentDepth / 8000) * 88}%)` }}
           />
        </div>
      </div>
    </div>
  );
};

export default SurveyChart;
