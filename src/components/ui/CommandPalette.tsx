'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Command } from 'cmdk';
import { Search, Pill, Shield, Bone, Box, Activity, Phone, Sparkles, FileText, ArrowRight } from 'lucide-react';

interface CommandPaletteProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export default function CommandPalette({ open: externalOpen, onOpenChange }: CommandPaletteProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const router = useRouter();

  const isOpen = externalOpen !== undefined ? externalOpen : internalOpen;
  const setIsOpen = onOpenChange || setInternalOpen;

  // Toggle with ⌘K / Ctrl+K
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setIsOpen(!isOpen);
      }
    };

    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, [isOpen, setIsOpen]);

  const runCommand = (command: () => void) => {
    setIsOpen(false);
    command();
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-150"
      onClick={() => setIsOpen(false)}
    >
      <div 
        onClick={(e) => e.stopPropagation()} 
        className="w-full max-w-xl animate-in zoom-in-95 duration-150"
      >
        <Command label="Global Veterinary Search">
          <div className="flex items-center px-4 border-b border-secondary-alt/30">
            <Search className="w-5 h-5 text-brand-blue mr-3 shrink-0" />
            <Command.Input placeholder="Search medicines, food, supplements, or presciptions..." />
            <kbd className="hidden sm:inline-block px-2 py-0.5 text-[10px] font-mono font-semibold bg-secondary/80 text-muted rounded border border-secondary-alt">
              ESC
            </kbd>
          </div>

          <Command.List>
            <Command.Empty>No clinical or pet wellness results found.</Command.Empty>

            <Command.Group heading="Top Veterinary Pharmacy">
              <Command.Item
                onSelect={() => runCommand(() => router.push('/products?search=catron'))}
              >
                <div className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600">
                  <Activity className="w-4 h-4" />
                </div>
                <div className="flex-1">
                  <span className="font-medium text-text">Catron Wound Spray</span>
                  <span className="ml-2 text-xs text-muted">Maggot & fly repellent antiseptic</span>
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 bg-emerald-100/60 px-2 py-0.5 rounded-full">
                  Vet Trusted
                </span>
              </Command.Item>

              <Command.Item
                onSelect={() => runCommand(() => router.push('/products?search=fluralaner'))}
              >
                <div className="p-1.5 rounded-lg bg-blue-50 text-brand-blue">
                  <Shield className="w-4 h-4" />
                </div>
                <div className="flex-1">
                  <span className="font-medium text-text">Fluralaner Tick & Flea Chewable</span>
                  <span className="ml-2 text-xs text-muted">3-month extended protection</span>
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-brand-blue bg-blue-100/60 px-2 py-0.5 rounded-full">
                  High Demand
                </span>
              </Command.Item>

              <Command.Item
                onSelect={() => runCommand(() => router.push('/products?category=parasite-tick-control'))}
              >
                <div className="p-1.5 rounded-lg bg-amber-50 text-amber-600">
                  <Pill className="w-4 h-4" />
                </div>
                <div className="flex-1">
                  <span className="font-medium text-text">Dewormers & Parasite Defense</span>
                  <span className="ml-2 text-xs text-muted">Broad-spectrum clinical dosing</span>
                </div>
              </Command.Item>
            </Command.Group>

            <Command.Group heading="Browse Categories">
              <Command.Item
                onSelect={() => runCommand(() => router.push('/products?category=dry-wet-pet-food'))}
              >
                <Bone className="w-4 h-4 text-accent" />
                <span>Dry & Wet Pet Food (Royal Canin, Hill's, Pedigree)</span>
              </Command.Item>
              <Command.Item
                onSelect={() => runCommand(() => router.push('/products?category=medicated-shampoos-grooming'))}
              >
                <Sparkles className="w-4 h-4 text-purple-500" />
                <span>Medicated Shampoos & Dermatological Grooming</span>
              </Command.Item>
              <Command.Item
                onSelect={() => runCommand(() => router.push('/products?category=cat-litter-hygiene'))}
              >
                <Box className="w-4 h-4 text-muted" />
                <span>Cat Litter & Hygiene Solutions</span>
              </Command.Item>
            </Command.Group>

            <Command.Group heading="Direct Actions & Support">
              <Command.Item
                onSelect={() => runCommand(() => router.push('/checkout'))}
              >
                <FileText className="w-4 h-4 text-brand-blue" />
                <span>Upload Doctor's Prescription</span>
              </Command.Item>
              <Command.Item
                onSelect={() => runCommand(() => window.open('https://wa.me/94771234567', '_blank'))}
              >
                <Phone className="w-4 h-4 text-emerald-600" />
                <span>Emergency Vet Advice Hotline</span>
              </Command.Item>
            </Command.Group>
          </Command.List>

          <div className="p-3 bg-secondary/40 border-t border-secondary-alt/30 flex items-center justify-between text-xs text-muted">
            <span className="flex items-center gap-1.5">
              Press <kbd className="px-1.5 py-0.5 font-mono text-[10px] bg-white rounded border border-secondary-alt">↑</kbd> <kbd className="px-1.5 py-0.5 font-mono text-[10px] bg-white rounded border border-secondary-alt">↓</kbd> to navigate
            </span>
            <span className="flex items-center gap-1 text-brand-blue font-medium">
              PetSolutions Apothecary <ArrowRight className="w-3 h-3" />
            </span>
          </div>
        </Command>
      </div>
    </div>
  );
}
