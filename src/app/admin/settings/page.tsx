'use client';

import { useState, useEffect } from 'react';
import { Settings, Save, RefreshCw, AlertTriangle, ToggleLeft, ToggleRight } from 'lucide-react';
import { createBrowserClient } from '@/lib/supabase/client';

interface SettingItem {
  key: string;
  value: string;
  is_enabled: boolean;
}

export default function AdminSettingsPage() {
  const [tagline, setTagline] = useState('Premium Pet Store');
  const [isTaglineEnabled, setIsTaglineEnabled] = useState(true);

  const [hotline, setHotline] = useState('+94 77 123 4567');
  const [isHotlineEnabled, setIsHotlineEnabled] = useState(true);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const fetchSettings = async () => {
    setLoading(true);
    setError(null);
    try {
      const supabase = createBrowserClient();
      const { data, error } = await supabase
        .from('store_settings')
        .select('*');

      if (error) throw error;

      if (data) {
        data.forEach((item: SettingItem) => {
          if (item.key === 'tagline') {
            setTagline(item.value);
            setIsTaglineEnabled(item.is_enabled);
          } else if (item.key === 'hotline') {
            setHotline(item.value);
            setIsHotlineEnabled(item.is_enabled);
          }
        });
      }
    } catch (err: any) {
      console.error('Error fetching settings:', err);
      setError(err.message || 'Error loading store settings.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    setSuccess(false);

    try {
      const supabase = createBrowserClient();
      
      const updates = [
        { key: 'promo_text', value: '', is_enabled: false, updated_at: new Date().toISOString() },
        { key: 'tagline', value: tagline, is_enabled: isTaglineEnabled, updated_at: new Date().toISOString() },
        { key: 'hotline', value: hotline, is_enabled: isHotlineEnabled, updated_at: new Date().toISOString() }
      ];

      const { error } = await supabase
        .from('store_settings')
        .upsert(updates, { onConflict: 'key' });

      if (error) throw error;

      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) {
      console.error('Error saving settings:', err);
      setError(err.message || 'Error saving store settings.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="font-heading font-extrabold text-2xl text-text flex items-center gap-2">
            <Settings className="text-accent" /> Store & Header Settings
          </h1>
          <p className="text-xs text-text-muted mt-1">
            Configure header tagline details and hotlines displayed on the storefront.
          </p>
        </div>
        <button
          onClick={fetchSettings}
          disabled={loading || saving}
          className="btn btn-outline btn-sm flex items-center gap-1.5"
        >
          <RefreshCw size={14} className={loading ? 'animate-spin' : ''} /> Reload
        </button>
      </div>

      {loading ? (
        <div className="flex flex-col gap-6">
          {[1, 2].map((i) => (
            <div key={i} className="glass p-6 rounded-2xl h-36 animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="max-w-2xl space-y-6">
          {error && (
            <div className="p-4 bg-error-light/50 border border-error/20 text-error rounded-xl text-xs flex items-center gap-2">
              <AlertTriangle size={16} />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="p-4 bg-success-light/50 border border-success/20 text-success rounded-xl text-xs font-bold animate-fade-in">
              Settings updated successfully! Changes will reflect in the header immediately.
            </div>
          )}

          {/* Setting 2: Brand Tagline */}
          <div className="glass p-6 rounded-[24px] border border-white/50 space-y-4 shadow-sm bg-white/40">
            <div className="flex justify-between items-center pb-2 border-b border-secondary-alt/25">
              <div>
                <h3 className="font-heading font-bold text-xs text-text">Header Tagline Text</h3>
                <p className="text-[10px] text-text-muted mt-0.5">Small tagline printed directly below the PetSolutions logo.</p>
              </div>
              <button
                onClick={() => setIsTaglineEnabled(!isTaglineEnabled)}
                className="flex items-center gap-1 text-xs font-bold text-text-muted hover:text-text transition-colors"
              >
                {isTaglineEnabled ? (
                  <div className="flex items-center gap-1.5 text-accent">
                    <ToggleRight size={28} />
                    <span>Enabled</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-1.5 text-text-muted">
                    <ToggleLeft size={28} />
                    <span>Disabled</span>
                  </div>
                )}
              </button>
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-text-muted block uppercase">Tagline Value</label>
              <input
                type="text"
                value={tagline}
                onChange={(e) => setTagline(e.target.value)}
                disabled={!isTaglineEnabled}
                className="w-full bg-white/80 border border-secondary-alt/40 focus:border-accent text-text text-xs rounded-xl p-3 outline-none transition-all disabled:opacity-50 disabled:bg-secondary-alt/10"
                placeholder="e.g. Premium Pet Store"
              />
            </div>
          </div>

          {/* Setting 3: Hotline Number */}
          <div className="glass p-6 rounded-[24px] border border-white/50 space-y-4 shadow-sm bg-white/40">
            <div className="flex justify-between items-center pb-2 border-b border-secondary-alt/25">
              <div>
                <h3 className="font-heading font-bold text-xs text-text">Hotline Contact Number</h3>
                <p className="text-[10px] text-text-muted mt-0.5">Contact details displayed inside the middle actions row.</p>
              </div>
              <button
                onClick={() => setIsHotlineEnabled(!isHotlineEnabled)}
                className="flex items-center gap-1 text-xs font-bold text-text-muted hover:text-text transition-colors"
              >
                {isHotlineEnabled ? (
                  <div className="flex items-center gap-1.5 text-accent">
                    <ToggleRight size={28} />
                    <span>Enabled</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-1.5 text-text-muted">
                    <ToggleLeft size={28} />
                    <span>Disabled</span>
                  </div>
                )}
              </button>
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-text-muted block uppercase">Hotline Number</label>
              <input
                type="text"
                value={hotline}
                onChange={(e) => setHotline(e.target.value)}
                disabled={!isHotlineEnabled}
                className="w-full bg-white/80 border border-secondary-alt/40 focus:border-accent text-text text-xs rounded-xl p-3 outline-none transition-all disabled:opacity-50 disabled:bg-secondary-alt/10"
                placeholder="e.g. +94 77 123 4567"
              />
            </div>
          </div>

          {/* Save Action */}
          <div className="pt-2">
            <button
              onClick={handleSave}
              disabled={saving}
              className="btn btn-primary px-8 py-3 rounded-xl flex items-center gap-2 text-xs font-bold shadow-lg shadow-accent/25 hover:shadow-accent/40 transition-all hover:scale-105"
            >
              <Save size={16} /> {saving ? 'Saving...' : 'Save Settings'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
