import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { CCTV_FEED_PRESETS } from '../../data/mockCityData';
import { analyzeIncidentImage } from '../../services/visionDetection';
import { VisionDetectionResult } from '../../types';
import { 
  Scan, 
  ShieldAlert, 
  Sparkles, 
  CheckCircle2, 
  AlertOctagon, 
  Upload, 
  ArrowRight, 
  Video, 
  Cpu, 
  Zap, 
  RotateCw,
  Eye
} from 'lucide-react';

export const AIDetectionModule: React.FC = () => {
  const { addIncident, setCurrentView } = useApp();

  const [selectedPresetIndex, setSelectedPresetIndex] = useState<number>(0);
  const [customImage, setCustomImage] = useState<string | null>(null);
  const [customFileName, setCustomFileName] = useState<string>('');
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [detectionResult, setDetectionResult] = useState<VisionDetectionResult | null>(null);
  const [injectedSuccess, setInjectedSuccess] = useState<boolean>(false);

  const activePreset = CCTV_FEED_PRESETS[selectedPresetIndex];
  const activeImage = customImage || activePreset.defaultImage;

  const runAnalysis = async (imgSrc: string, name?: string) => {
    setIsScanning(true);
    setInjectedSuccess(false);
    const res = await analyzeIncidentImage(imgSrc, name);
    setDetectionResult(res);
    setIsScanning(false);
  };

  // Run analysis when preset changes
  React.useEffect(() => {
    runAnalysis(activePreset.defaultImage, activePreset.hazardType);
  }, [selectedPresetIndex]);

  const handleCustomUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const src = reader.result as string;
      setCustomImage(src);
      setCustomFileName(file.name);
      runAnalysis(src, file.name);
    };
    reader.readAsDataURL(file);
  };

  const handleInjectToMap = () => {
    if (!detectionResult) return;

    addIncident({
      title: `AI Vision: ${detectionResult.label}`,
      type: detectionResult.hazardType,
      severity: detectionResult.severity,
      location: activePreset.location,
      locationName: activePreset.junctionName,
      distanceKm: 2.8,
      reporter: 'AI_VISION',
      confidenceScore: detectionResult.confidence,
      description: `Neural hazard detection: ${detectionResult.label}. Bounding box verification confirmed.`,
      status: 'DISPATCHED',
      recommendedActions: detectionResult.recommendedActions,
      affectedRoadIds: ['rd-blocked-1']
    });

    setInjectedSuccess(true);
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      
      {/* AI Header Banner */}
      <div className="bg-gradient-to-r from-cyan-950/80 via-slate-900/90 to-purple-950/80 border border-cyan-500/30 rounded-3xl p-6 shadow-2xl backdrop-blur-xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2 text-center md:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-bold font-mono">
            <Cpu className="w-3.5 h-3.5" />
            <span>YOLOv8 + Edge Vision Neural Classifier</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white">
            Real-Time AI Incident & Hazard Detection
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl">
            Autonomous computer vision pipeline analyzing CCTV traffic feeds and citizen uploads for accidents, blockages, flooding, and potholes with sub-second inference.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <label className="px-4 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center gap-2 cursor-pointer shadow-[0_0_20px_rgba(6,182,212,0.4)] transition-all">
            <Upload className="w-4 h-4" />
            <span>Upload Image Frame</span>
            <input type="file" accept="image/*" onChange={handleCustomUpload} className="hidden" />
          </label>
        </div>
      </div>

      {/* Preset CCTV Feeds Picker */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-slate-800">
        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider shrink-0 pr-2">
          Live CCTV Streams:
        </span>
        {CCTV_FEED_PRESETS.map((preset, idx) => (
          <button
            key={preset.id}
            onClick={() => {
              setCustomImage(null);
              setSelectedPresetIndex(idx);
            }}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-2 ${
              !customImage && selectedPresetIndex === idx
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/60 shadow-[0_0_15px_rgba(6,182,212,0.25)]'
                : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-slate-200'
            }`}
          >
            <Video className="w-3.5 h-3.5 text-cyan-400" />
            <span>{preset.name}</span>
          </button>
        ))}
      </div>

      {/* Main Vision Interface Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left: Interactive Image Canvas with Bounding Boxes Overlay (7 cols) */}
        <div className="lg:col-span-7 bg-slate-900/90 backdrop-blur-xl border border-slate-800 rounded-3xl p-5 shadow-2xl flex flex-col justify-between">
          
          <div className="flex items-center justify-between pb-3 border-b border-slate-800 text-xs">
            <div className="flex items-center gap-2">
              <Eye className="w-4 h-4 text-cyan-400" />
              <span className="font-bold text-white">
                {customImage ? `User Image: ${customFileName}` : activePreset.name}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-ping"></span>
              <span className="font-mono text-[10px] text-red-400 font-bold uppercase">LIVE FEED ANALYZED</span>
            </div>
          </div>

          {/* Bounding Box Image Overlay Container */}
          <div className="relative mt-4 w-full h-[360px] sm:h-[400px] rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 flex items-center justify-center">
            <img
              src={activeImage}
              alt="CCTV Traffic Feed"
              className="w-full h-full object-cover"
            />

            {/* Neural Scanner Overlay Line */}
            {isScanning && (
              <div className="absolute inset-0 bg-cyan-950/40 flex items-center justify-center">
                <div className="flex flex-col items-center gap-3 text-cyan-300">
                  <Scan className="w-12 h-12 text-cyan-400 animate-pulse" />
                  <span className="font-mono font-bold text-xs uppercase tracking-wider">
                    Running Tensor Convolution...
                  </span>
                </div>
              </div>
            )}

            {/* Bounding Boxes */}
            {!isScanning && detectionResult && detectionResult.boundingBoxes.map((box, idx) => (
              <div
                key={idx}
                className="absolute border-2 border-emerald-400 bg-emerald-500/15 rounded shadow-[0_0_15px_#10b981] transition-all"
                style={{
                  left: `${box.x}%`,
                  top: `${box.y}%`,
                  width: `${box.width}%`,
                  height: `${box.height}%`
                }}
              >
                <div className="absolute -top-6 left-0 bg-slate-950/90 text-[10px] font-mono font-bold text-emerald-300 px-1.5 py-0.5 rounded border border-emerald-500/50 whitespace-nowrap shadow-md">
                  {box.label} ({(box.confidence * 100).toFixed(0)}%)
                </div>
              </div>
            ))}
          </div>

          <div className="mt-3 flex items-center justify-between text-[11px] text-slate-400">
            <span>Model: ResQNet-V4 Urban Defect / Collision Model</span>
            <span>FPS: 30.2 | Latency: 14ms</span>
          </div>

        </div>

        {/* Right: AI Detection Report & Action Recommendations (5 cols) */}
        <div className="lg:col-span-5 bg-slate-900/90 backdrop-blur-xl border border-slate-800 rounded-3xl p-6 shadow-2xl flex flex-col justify-between space-y-4">
          
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-400" />
                <span>AI Incident Diagnostics</span>
              </h3>
              {detectionResult && (
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                  detectionResult.severity === 'CRITICAL' ? 'bg-rose-500 text-white animate-pulse' :
                  detectionResult.severity === 'HIGH' ? 'bg-amber-500 text-black' : 'bg-blue-600 text-white'
                }`}>
                  {detectionResult.severity}
                </span>
              )}
            </div>

            {detectionResult ? (
              <div className="mt-4 space-y-4 text-xs">
                
                {/* Detected Hazard Banner */}
                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800">
                  <div className="text-[10px] uppercase font-bold text-slate-400">Detected Condition</div>
                  <div className="text-lg font-black text-white mt-0.5">
                    🚨 {detectionResult.label}
                  </div>
                  <div className="mt-2 flex items-center justify-between pt-2 border-t border-slate-800/80 text-[11px]">
                    <span className="text-slate-400">Confidence Score:</span>
                    <span className="font-mono font-black text-emerald-400 text-sm">
                      {detectionResult.confidence}%
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-slate-400 mt-1">
                    <span>Estimated Delay Impact:</span>
                    <span className="font-mono text-amber-400 font-bold">
                      +{detectionResult.estimatedDelayMinutes} mins without rerouting
                    </span>
                  </div>
                </div>

                {/* Recommended Immediate Actions */}
                <div className="space-y-2">
                  <div className="text-[11px] uppercase font-bold text-slate-400">
                    Recommended AI Mitigation:
                  </div>
                  <div className="space-y-1.5">
                    {detectionResult.recommendedActions.map((action, i) => (
                      <div key={i} className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800/80 flex items-start gap-2 text-slate-200">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                        <span className="text-[11px]">{action}</span>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            ) : (
              <div className="py-12 text-center text-xs text-slate-500">
                Awaiting image frame processing...
              </div>
            )}
          </div>

          {/* Action Trigger Buttons */}
          <div className="space-y-2 pt-4 border-t border-slate-800">
            {injectedSuccess ? (
              <div className="p-3 rounded-xl bg-emerald-950 border border-emerald-500/50 text-emerald-300 text-xs font-bold text-center flex items-center justify-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Incident Injected to City Map & Routes Recalculated!</span>
              </div>
            ) : (
              <button
                onClick={handleInjectToMap}
                disabled={!detectionResult}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-rose-600 via-red-600 to-rose-600 hover:from-rose-500 hover:to-red-500 text-white font-black text-xs uppercase tracking-wider shadow-[0_0_20px_rgba(225,29,72,0.35)] transition-all flex items-center justify-center gap-2"
              >
                <Zap className="w-4 h-4 fill-current" />
                <span>Broadcast Incident & Trigger Emergency Reroute</span>
              </button>
            )}

            <button
              onClick={() => setCurrentView('command_center')}
              className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold border border-slate-700 transition-all flex items-center justify-center gap-1.5"
            >
              <span>View On Command Center Map</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>

      </div>

    </div>
  );
};
