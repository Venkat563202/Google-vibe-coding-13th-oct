import React, { useState } from 'react';
import { X, Plus, Sparkles, Code2, AlertTriangle, Check, Car, Navigation } from 'lucide-react';
import { RestaurantSpot } from '../types';
import { HYDERABADI_PARKING_ALERTS, HYDERABADI_TRAFFIC_ALERTS } from '../data/restaurants';

interface AddSpotModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddSpot: (spot: Omit<RestaurantSpot, 'id' | 'votes'>) => void;
  onBulkAddSpots: (spots: Omit<RestaurantSpot, 'id' | 'votes'>[]) => void;
}

export const AddSpotModal: React.FC<AddSpotModalProps> = ({
  isOpen,
  onClose,
  onAddSpot,
  onBulkAddSpots,
}) => {
  const [activeTab, setActiveTab] = useState<'form' | 'json' | 'code'>('form');

  // Form State
  const [name, setName] = useState('');
  const [area, setArea] = useState('');
  const [distanceKm, setDistanceKm] = useState('3.5');
  const [specialty, setSpecialty] = useState('Special Zafrani Mutton Dum Biryani');
  const [parkingAlert, setParkingAlert] = useState(HYDERABADI_PARKING_ALERTS[0]);
  const [trafficAlert, setTrafficAlert] = useState(HYDERABADI_TRAFFIC_ALERTS[0]);
  const [spiceLevel, setSpiceLevel] = useState<'Medium' | 'Kirrak Teekha' | 'Fire 🔥'>('Kirrak Teekha');

  // JSON State
  const [jsonText, setJsonText] = useState('');
  const [jsonError, setJsonError] = useState<string | null>(null);
  const [successToast, setSuccessToast] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !area.trim()) return;

    onAddSpot({
      name: name.trim(),
      area: area.trim(),
      distanceKm: parseFloat(distanceKm) || 3.0,
      specialty: specialty.trim(),
      parkingAlert,
      trafficAlert,
      spiceLevel,
    });

    setName('');
    setArea('');
    setSuccessToast(`Added "${name}" to your arena spots!`);
    setTimeout(() => {
      setSuccessToast(null);
      onClose();
    }, 700);
  };

  const handleJsonSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setJsonError(null);
    try {
      const parsed = JSON.parse(jsonText);
      if (!Array.isArray(parsed)) {
        throw new Error('JSON must be an array of spot objects!');
      }
      const validSpots: Omit<RestaurantSpot, 'id' | 'votes'>[] = parsed.map((item, index) => {
        if (!item.name || !item.area) {
          throw new Error(`Spot at index ${index} must have "name" and "area"`);
        }
        return {
          name: String(item.name),
          area: String(item.area),
          distanceKm: Number(item.distanceKm) || 4.0,
          specialty: item.specialty || 'Hyderabadi Dum Biryani',
          parkingAlert: item.parkingAlert || HYDERABADI_PARKING_ALERTS[0],
          trafficAlert: item.trafficAlert || HYDERABADI_TRAFFIC_ALERTS[0],
          spiceLevel: item.spiceLevel || 'Kirrak Teekha',
        };
      });

      onBulkAddSpots(validSpots);
      setSuccessToast(`Successfully added ${validSpots.length} spots!`);
      setTimeout(() => {
        setSuccessToast(null);
        onClose();
      }, 700);
    } catch (err: any) {
      setJsonError(err.message || 'Invalid JSON format. Check brackets and quotes.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[#171722] border border-[#2B2B3E] rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="p-4 md:p-5 border-b border-[#262638] flex items-center justify-between">
          <div>
            <h3 className="font-display font-bold text-lg md:text-xl text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-400" />
              <span>Add Secret Hyderabad Spot</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Populate real biryani spots into the battle pool
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-[#252536] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-[#262638] px-4 pt-2 gap-2 text-xs font-semibold">
          <button
            type="button"
            onClick={() => setActiveTab('form')}
            className={`pb-2.5 px-3 border-b-2 transition-colors cursor-pointer ${
              activeTab === 'form'
                ? 'border-amber-400 text-amber-300'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Form Input
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('json')}
            className={`pb-2.5 px-3 border-b-2 transition-colors cursor-pointer ${
              activeTab === 'json'
                ? 'border-amber-400 text-amber-300'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Paste JSON Array
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('code')}
            className={`pb-2.5 px-3 border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'code'
                ? 'border-amber-400 text-amber-300'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Code2 className="w-3.5 h-3.5" />
            <span>Code File Guide</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 md:p-6 overflow-y-auto space-y-4">
          {successToast && (
            <div className="p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{successToast}</span>
            </div>
          )}

          {activeTab === 'form' && (
            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-300 mb-1">
                    Restaurant Name *
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Cafe Bahar, Shadab, etc."
                    className="w-full px-3 py-2.5 bg-[#101017] border border-[#28283B] rounded-xl text-white text-sm focus:border-amber-500 focus:outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-300 mb-1">
                    Area / Landmark *
                  </label>
                  <input
                    type="text"
                    value={area}
                    onChange={(e) => setArea(e.target.value)}
                    placeholder="e.g. Basheerbagh, Charminar, etc."
                    className="w-full px-3 py-2.5 bg-[#101017] border border-[#28283B] rounded-xl text-white text-sm focus:border-amber-500 focus:outline-none"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-300 mb-1">
                    Approx Distance (km) *
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="0.1"
                    max="50"
                    value={distanceKm}
                    onChange={(e) => setDistanceKm(e.target.value)}
                    className="w-full px-3 py-2.5 bg-[#101017] border border-[#28283B] rounded-xl text-white text-sm focus:border-amber-500 focus:outline-none tabular-nums"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-300 mb-1">
                    Spice Level
                  </label>
                  <select
                    value={spiceLevel}
                    onChange={(e) => setSpiceLevel(e.target.value as any)}
                    className="w-full px-3 py-2.5 bg-[#101017] border border-[#28283B] rounded-xl text-white text-sm focus:border-amber-500 focus:outline-none"
                  >
                    <option value="Medium">Medium</option>
                    <option value="Kirrak Teekha">Kirrak Teekha</option>
                    <option value="Fire 🔥">Fire 🔥</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-300 mb-1">
                  Specialty Dish
                </label>
                <input
                  type="text"
                  value={specialty}
                  onChange={(e) => setSpecialty(e.target.value)}
                  placeholder="e.g. Special Zafrani Mutton Dum Biryani"
                  className="w-full px-3 py-2.5 bg-[#101017] border border-[#28283B] rounded-xl text-white text-sm focus:border-amber-500 focus:outline-none"
                />
              </div>

              {/* Parking Warning */}
              <div>
                <label className="block text-xs font-bold uppercase text-slate-300 mb-1 flex items-center gap-1.5">
                  <Car className="w-3.5 h-3.5 text-amber-400" />
                  <span>Hyderabad Parking Warning</span>
                </label>
                <select
                  value={parkingAlert}
                  onChange={(e) => setParkingAlert(e.target.value)}
                  className="w-full px-3 py-2.5 bg-[#101017] border border-[#28283B] rounded-xl text-white text-xs focus:border-amber-500 focus:outline-none"
                >
                  {HYDERABADI_PARKING_ALERTS.map((alert, idx) => (
                    <option key={idx} value={alert}>
                      {alert}
                    </option>
                  ))}
                </select>
              </div>

              {/* Traffic Warning */}
              <div>
                <label className="block text-xs font-bold uppercase text-slate-300 mb-1 flex items-center gap-1.5">
                  <Navigation className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Hyderabad Traffic Warning</span>
                </label>
                <select
                  value={trafficAlert}
                  onChange={(e) => setTrafficAlert(e.target.value)}
                  className="w-full px-3 py-2.5 bg-[#101017] border border-[#28283B] rounded-xl text-white text-xs focus:border-amber-500 focus:outline-none"
                >
                  {HYDERABADI_TRAFFIC_ALERTS.map((alert, idx) => (
                    <option key={idx} value={alert}>
                      {alert}
                    </option>
                  ))}
                </select>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-bold text-sm tracking-wide shadow-lg shadow-orange-500/20 active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Add Spot to Arena</span>
              </button>
            </form>
          )}

          {activeTab === 'json' && (
            <form onSubmit={handleJsonSubmit} className="space-y-4">
              <p className="text-xs text-slate-300 leading-relaxed">
                Paste an array of restaurant objects below to bulk import your Hyderabad spots:
              </p>
              <textarea
                value={jsonText}
                onChange={(e) => setJsonText(e.target.value)}
                rows={8}
                placeholder={`[\n  {\n    "name": "Cafe Bahar",\n    "area": "Basheerbagh",\n    "distanceKm": 3.8,\n    "specialty": "Special Mutton Dum Biryani"\n  }\n]`}
                className="w-full px-3 py-2.5 bg-[#101017] border border-[#28283B] rounded-xl text-white text-xs font-mono focus:border-amber-500 focus:outline-none"
              />
              {jsonError && (
                <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 shrink-0 text-rose-400" />
                  <span>{jsonError}</span>
                </div>
              )}
              <button
                type="submit"
                className="w-full py-3.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-sm tracking-wide transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Import JSON Spots</span>
              </button>
            </form>
          )}

          {activeTab === 'code' && (
            <div className="space-y-3 text-xs text-slate-300">
              <div className="p-3 rounded-xl bg-[#101017] border border-[#2A2A3D] space-y-2">
                <p className="font-semibold text-amber-300">
                  📁 File Path: <code className="text-white font-mono">/src/data/restaurants.ts</code>
                </p>
                <p className="text-slate-400">
                  Per the challenge instructions, the <code className="text-amber-300">SECRET_LOCAL_SPOTS</code> array is kept empty for you to populate directly.
                </p>
              </div>
              <pre className="p-3 rounded-xl bg-[#0C0C12] border border-[#222233] text-[11px] font-mono text-emerald-300 overflow-x-auto leading-relaxed">
{`export const SECRET_LOCAL_SPOTS: RestaurantSpot[] = [
  {
    id: 'spot-1',
    name: 'Hotel Shadab',
    area: 'Ghansi Bazaar, Near Charminar',
    distanceKm: 2.3,
    votes: 0,
    specialty: 'Special Mutton Dum Biryani',
    parkingAlert: 'Arey bhai, parking ich nahi miling wahan, auto leko jao!',
    trafficAlert: 'Charminar galliyan mein full jam rehta ustaad!',
    spiceLevel: 'Kirrak Teekha'
  }
];`}
              </pre>
              <p className="text-slate-400">
                Any spots added in this modal are stored in your browser's <code className="text-amber-300">localStorage</code> and merged automatically.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
