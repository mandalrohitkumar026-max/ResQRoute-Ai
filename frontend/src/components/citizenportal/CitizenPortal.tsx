import React, { useState, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { IncidentType, PriorityLevel } from '../../types';
import { 
  Camera, 
  MapPin, 
  Send, 
  AlertTriangle, 
  ShieldAlert, 
  PhoneCall, 
  Navigation, 
  CheckCircle2, 
  Sparkles, 
  UploadCloud, 
  Car, 
  Droplets, 
  HelpCircle,
  Clock,
  LocateFixed
} from 'lucide-react';
import { analyzeIncidentImage } from '../../services/visionDetection';

export const CitizenPortal: React.FC = () => {
  const { facilities, addIncident, incidents, setFocusedCoordinates } = useApp();

  const [incidentType, setIncidentType] = useState<IncidentType>('accident');
  const [severity, setSeverity] = useState<PriorityLevel>('HIGH');
  const [locationName, setLocationName] = useState<string>('Mahatma Gandhi Marg, Near Sector 4');
  const [coordinates, setCoordinates] = useState({ lat: 28.6250, lng: 77.2150 });
  const [description, setDescription] = useState<string>('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isScanningAI, setIsScanningAI] = useState<boolean>(false);
  const [aiAnalysisResult, setAiAnalysisResult] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async () => {
      const src = reader.result as string;
      setSelectedImage(src);
      setIsScanningAI(true);
      
      const result = await analyzeIncidentImage(src, file.name);
      setIsScanningAI(false);
      setIncidentType(result.hazardType);
      setSeverity(result.severity);
      setAiAnalysisResult(`AI Vision Confirmed: ${result.label} (${result.confidence}% confidence). Recommended: ${result.recommendedActions[0]}`);
    };
    reader.readAsDataURL(file);
  };

  const handleGetLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setCoordinates({ lat: pos.coords.latitude, lng: pos.coords.longitude });
          setLocationName(`GPS Pinpoint: ${pos.coords.latitude.toFixed(4)}, ${pos.coords.longitude.toFixed(4)}`);
        },
        () => {
          // Fallback to Metro City preset
          setCoordinates({ lat: 28.6275, lng: 77.2220 });
          setLocationName('Barakhamba Road Junction (Sector 2)');
        }
      );
    } else {
      setCoordinates({ lat: 28.6275, lng: 77.2220 });
      setLocationName('Barakhamba Road Junction (Sector 2)');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!locationName) return;

    let title = 'Accident Reported by Citizen';
    if (incidentType === 'pothole') title = 'Severe Pothole Hazard';
    else if (incidentType === 'road_blockage') title = 'Road Obstruction & Blockage';
    else if (incidentType === 'flooded_road') title = 'Waterlogged Subway / Roadway';
    else if (incidentType === 'traffic_congestion') title = 'Heavy Congestion Chokepoint';
    else if (incidentType === 'vehicle_breakdown') title = 'Stationary Vehicle Breakdown';

    addIncident({
      title,
      type: incidentType,
      severity,
      location: coordinates,
      locationName,
      distanceKm: 2.1,
      reporter: 'CITIZEN',
      confidenceScore: aiAnalysisResult ? 94 : 88,
      description: description || 'Reported via Citizen Emergency Hazard Portal.',
      status: 'REPORTED',
      recommendedActions: [
        'Alert traffic control room',
        'Recalculate incoming emergency routes',
        'Dispatch local patrol unit'
      ],
      affectedRoadIds: ['rd-2']
    });

    setIsSubmitted(true);
    setTimeout(() => {
      setIsSubmitted(false);
      setDescription('');
      setSelectedImage(null);
      setAiAnalysisResult(null);
    }, 4000);
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      
      {/* Citizen Portal Header Banner */}
      <div className="bg-gradient-to-r from-blue-950/80 via-slate-900/90 to-emerald-950/80 border border-blue-500/30 rounded-3xl p-6 shadow-2xl backdrop-blur-xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2 text-center md:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold font-mono">
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>Citizen Smart City Emergency Response Portal</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white">
            Report Road Hazards & Save Critical Lives
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl">
            Your instant hazard reports are processed by AI vision models and immediately fed into the ResQRoute AI traffic optimizer to divert ambulances away from gridlock.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={handleGetLocation}
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-bold flex items-center gap-2 transition-all shadow-lg"
          >
            <LocateFixed className="w-4 h-4 text-cyan-400" />
            <span>Pinpoint GPS</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Side: Report Form (7 cols) */}
        <div className="lg:col-span-7 bg-slate-900/90 backdrop-blur-xl border border-slate-800 rounded-3xl p-6 shadow-2xl">
          
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-400" />
              <span>Submit Hazard / Emergency Incident</span>
            </h3>
            <span className="text-[11px] text-slate-400">AI-Verified Dispatch</span>
          </div>

          {isSubmitted ? (
            <div className="py-12 flex flex-col items-center justify-center text-center space-y-3">
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/50 flex items-center justify-center text-emerald-400 shadow-[0_0_30px_#10b981]">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h4 className="text-lg font-bold text-white">Report Successfully Broadcasted!</h4>
              <p className="text-xs text-slate-300 max-w-md">
                Traffic Control and nearby emergency vehicles have been alerted. AI has dynamically adjusted route scores across the city grid.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="mt-5 space-y-4 text-xs">
              
              {/* Hazard Type Selector */}
              <div>
                <label className="block text-slate-300 font-bold mb-2">Select Hazard Type:</label>
                <div className="grid grid-cols-3 sm:grid-cols-3 gap-2">
                  {[
                    { type: 'accident' as const, emoji: '🚨', label: 'Accident' },
                    { type: 'road_blockage' as const, emoji: '⛔', label: 'Roadblock' },
                    { type: 'pothole' as const, emoji: '⚠️', label: 'Pothole' },
                    { type: 'traffic_congestion' as const, emoji: '🚗', label: 'Gridlock' },
                    { type: 'flooded_road' as const, emoji: '🌊', label: 'Flood / Rain' },
                    { type: 'vehicle_breakdown' as const, emoji: '🔧', label: 'Breakdown' }
                  ].map(item => (
                    <button
                      type="button"
                      key={item.type}
                      onClick={() => setIncidentType(item.type)}
                      className={`p-2.5 rounded-xl border text-left flex items-center gap-2 transition-all ${
                        incidentType === item.type
                          ? 'bg-slate-950 border-emerald-500 text-white shadow-[0_0_12px_rgba(16,185,129,0.3)]'
                          : 'bg-slate-950/50 border-slate-800 text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      <span className="text-base">{item.emoji}</span>
                      <span className="font-semibold text-xs">{item.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Severity Level */}
              <div>
                <label className="block text-slate-300 font-bold mb-1.5">Severity Level:</label>
                <div className="flex items-center gap-2">
                  {(['CRITICAL', 'HIGH', 'MEDIUM', 'LOW'] as const).map(sev => (
                    <button
                      type="button"
                      key={sev}
                      onClick={() => setSeverity(sev)}
                      className={`flex-1 py-2 rounded-xl font-bold text-xs transition-all ${
                        severity === sev
                          ? sev === 'CRITICAL' ? 'bg-rose-600 text-white shadow-[0_0_15px_#e11d48]' :
                            sev === 'HIGH' ? 'bg-amber-600 text-white shadow-[0_0_15px_#d97706]' :
                            'bg-blue-600 text-white shadow-[0_0_15px_#2563eb]'
                          : 'bg-slate-950 text-slate-400 border border-slate-800'
                      }`}
                    >
                      {sev}
                    </button>
                  ))}
                </div>
              </div>

              {/* Location Input */}
              <div>
                <label className="block text-slate-300 font-bold mb-1.5">Location / Intersection:</label>
                <div className="flex items-center gap-2">
                  <div className="relative flex-1">
                    <MapPin className="w-4 h-4 text-rose-400 absolute left-3 top-3" />
                    <input
                      type="text"
                      value={locationName}
                      onChange={(e) => setLocationName(e.target.value)}
                      placeholder="e.g. Ring Road Underpass, Sector 4"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2.5 text-xs text-white placeholder-slate-500 outline-none focus:border-emerald-500 transition-all"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={handleGetLocation}
                    className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700"
                    title="Auto-detect current GPS"
                  >
                    <LocateFixed className="w-4 h-4 text-cyan-400" />
                  </button>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-slate-300 font-bold mb-1.5">Description & Details (Optional):</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe number of vehicles involved, lane blockages, or hazardous materials..."
                  rows={2}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white placeholder-slate-500 outline-none focus:border-emerald-500 transition-all resize-none"
                />
              </div>

              {/* Image Upload & AI Analysis Preview */}
              <div>
                <label className="block text-slate-300 font-bold mb-1.5">
                  Upload Photo for Computer Vision Verification:
                </label>
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-slate-800 hover:border-emerald-500/50 rounded-2xl p-4 text-center cursor-pointer transition-all bg-slate-950/60 flex flex-col items-center justify-center space-y-2"
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                  <UploadCloud className="w-7 h-7 text-slate-400" />
                  <div className="text-xs text-slate-300">
                    <span className="text-emerald-400 font-bold">Click to upload photo</span> or drag and drop
                  </div>
                  <div className="text-[10px] text-slate-500">
                    AI will instantly scan for collisions, blockages, or road defects
                  </div>
                </div>

                {/* Scanning Spinner / Result */}
                {isScanningAI && (
                  <div className="mt-2 p-3 rounded-xl bg-slate-950 border border-cyan-500/40 flex items-center gap-2 text-xs text-cyan-300">
                    <Sparkles className="w-4 h-4 animate-spin text-cyan-400" />
                    <span>Neural AI analyzing image bounding boxes & hazard severity...</span>
                  </div>
                )}

                {aiAnalysisResult && (
                  <div className="mt-2 p-3 rounded-xl bg-emerald-950/80 border border-emerald-500/40 flex items-start gap-2 text-xs text-emerald-300">
                    <Sparkles className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{aiAnalysisResult}</span>
                  </div>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-sm shadow-[0_0_20px_rgba(16,185,129,0.3)] transition-all flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" />
                <span>Submit Emergency Report to Traffic Grid</span>
              </button>

            </form>
          )}

        </div>

        {/* Right Side: Nearby Emergency Services & Emergency Hotline (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          
          {/* Emergency Hotlines Card */}
          <div className="bg-slate-900/90 backdrop-blur-xl border border-slate-800 rounded-3xl p-5 shadow-2xl">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-2">
              <PhoneCall className="w-4 h-4 text-rose-400" />
              <span>Direct Emergency Helpline Numbers</span>
            </h3>

            <div className="grid grid-cols-3 gap-2 text-center text-xs">
              <div className="p-3 rounded-xl bg-rose-950/60 border border-rose-800/50">
                <div className="text-lg">🚑</div>
                <div className="font-mono font-black text-rose-400 text-base mt-1">102 / 108</div>
                <div className="text-[10px] text-slate-400">Ambulance</div>
              </div>

              <div className="p-3 rounded-xl bg-blue-950/60 border border-blue-800/50">
                <div className="text-lg">🚓</div>
                <div className="font-mono font-black text-blue-400 text-base mt-1">112</div>
                <div className="text-[10px] text-slate-400">Police</div>
              </div>

              <div className="p-3 rounded-xl bg-amber-950/60 border border-amber-800/50">
                <div className="text-lg">🚒</div>
                <div className="font-mono font-black text-amber-400 text-base mt-1">101</div>
                <div className="text-[10px] text-slate-400">Fire Brigade</div>
              </div>
            </div>
          </div>

          {/* Nearby Facilities Directory */}
          <div className="bg-slate-900/90 backdrop-blur-xl border border-slate-800 rounded-3xl p-5 shadow-2xl">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center justify-between">
              <span>Nearby Emergency Facilities</span>
              <span className="text-[10px] text-emerald-400 font-mono">Live Bed Tracking</span>
            </h3>

            <div className="space-y-2.5 max-h-[350px] overflow-y-auto pr-1">
              {facilities.map(fac => (
                <div
                  key={fac.id}
                  onClick={() => setFocusedCoordinates(fac.location)}
                  className="p-3 rounded-2xl bg-slate-950/70 border border-slate-800 hover:border-cyan-500/50 transition-all cursor-pointer group text-xs"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="text-base">{fac.type === 'hospital' ? '🏥' : (fac.type === 'fire_station' ? '🚒' : '🚓')}</span>
                      <div>
                        <h4 className="font-bold text-white group-hover:text-cyan-300 transition-colors">
                          {fac.name}
                        </h4>
                        <div className="text-[10px] text-slate-400">{fac.address}</div>
                      </div>
                    </div>

                    <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${
                      fac.capacityStatus === 'AVAILABLE' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-amber-500/20 text-amber-300'
                    }`}>
                      {fac.capacityStatus}
                    </span>
                  </div>

                  <div className="mt-2 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-400">
                    <div>
                      {fac.icuBedsAvailable !== undefined && (
                        <span>ICU Beds: <span className="font-mono font-bold text-cyan-400">{fac.icuBedsAvailable}</span></span>
                      )}
                    </div>

                    <a
                      href={`tel:${fac.contactNumber}`}
                      className="px-2 py-0.5 rounded bg-slate-800 hover:bg-emerald-950 text-slate-300 hover:text-emerald-300 border border-slate-700 transition-all"
                    >
                      Call {fac.contactNumber}
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
