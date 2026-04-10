export interface OperationalData {
  timestamp: string;
  depth: number;
  weightOnBit: number; // Klb
  hookLoad: number; // Klb
  flowRate: number; // Bbl/min
  pumpPressure: number; // psi
  rotaryRPM: number;
  rotaryTorque: number; // lb-ft
  rop: number; // ft/min
  strokesPerMinute: number;
  blockPosition: number; // ft
  blockVelocity: number; // ft/min
  bitPosition: number; // ft
  tubesCounter: number;
}

export const generateSimulationData = (hours: number = 24): OperationalData[] => {
  const data: OperationalData[] = [];
  const now = new Date();
  
  for (let i = 0; i < hours * 60; i++) { // every minute
    const time = new Date(now.getTime() - (hours * 60 - i) * 60000);
    
    // Some noise/oscillation functions
    const noise = (amplitude: number) => (Math.random() - 0.5) * amplitude;
    const baseValue = (v: number, amp: number, freq: number) => v + Math.sin(i * freq) * amp;

    data.push({
      timestamp: time.toISOString(),
      depth: 5000 + i * 0.5,
      weightOnBit: Math.max(0, baseValue(20, 5, 0.05) + noise(2)),
      hookLoad: Math.max(0, baseValue(180, 20, 0.02) + noise(5)),
      flowRate: Math.max(0, baseValue(8, 2, 0.01) + noise(0.5)),
      pumpPressure: Math.max(0, baseValue(1500, 200, 0.01) + noise(50)),
      rotaryRPM: Math.max(0, baseValue(80, 10, 0.03) + noise(5)),
      rotaryTorque: Math.max(0, baseValue(12000, 1000, 0.02) + noise(500)),
      rop: Math.max(0, baseValue(45, 10, 0.05) + noise(5)),
      strokesPerMinute: Math.max(0, baseValue(90, 5, 0.01) + noise(2)),
      blockPosition: Math.max(0, baseValue(40, 30, 0.1) + noise(1)),
      blockVelocity: Math.max(0, baseValue(0.5, 0.5, 0.1) + noise(0.1)),
      bitPosition: 4980 + i * 0.5,
      tubesCounter: Math.floor(i / 30) // one tube every 30 mins
    });
  }
  
  return data;
};

export const MOCK_OPERATIONAL_STATS = {
  torre: "INDEP-23",
  intervencion: "WORKOVER",
  duracionIntervencion: "9 días 15 horas",
  actividad: "Cementación Remedial (SQZ)",
  duracionActividad: "12 días 19 horas",
  estadoOperativo: "Operativo",
  duracionEstado: "3 días 19 horas",
};

export const MOCK_CHART_DATA = [
  { name: 'Cementación Remedial (SQZ)', value: 34.4, color: '#0ea5e9' },
  { name: 'Corrida registro pozo (E-Line)', value: 30.7, color: '#f59e0b' },
  { name: 'SCO', value: 91.5, color: '#ef4444' },
];
