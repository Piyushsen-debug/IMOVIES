import React from 'react';
import { Film, ShieldCheck, Heart, Sparkles, HelpCircle } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-[#070A11] border-t border-slate-800/80 mt-auto text-xs text-slate-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8 pb-8 border-b border-slate-800/80">
          {/* Brand Info */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-rose-600 flex items-center justify-center text-white font-mono font-bold">
                <Film className="w-4 h-4" />
              </div>
              <span className="text-base font-extrabold text-white font-mono tracking-wider">
                IMOVIES
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              India's premier movie ticketing network inspired by BookMyShow and District. Experience high-octane IMAX, 4DX, and Dolby Atmos shows.
            </p>
          </div>

          {/* Supported Formats */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">
              Cinema Experiences
            </h4>
            <ul className="space-y-1.5 text-slate-400 text-xs">
              <li>IMAX 3D Laser Precision</li>
              <li>4DX Dynamic Motion & Environmental FX</li>
              <li>Dolby Atmos 64-Channel Spatial Audio</li>
              <li>Director's Cut Luxury Lounges</li>
              <li>ScreenX 270° Panoramic View</li>
            </ul>
          </div>

          {/* Cinema Chains */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">
              Partner Multiplexes
            </h4>
            <ul className="space-y-1.5 text-slate-400 text-xs">
              <li>PVR INOX Multiplex Chain</li>
              <li>Cinepolis Megaplex & Macro XE</li>
              <li>Miraj Entertainment Theaters</li>
              <li>MovieMax Cinemas</li>
              <li>Mirage Luxury Cinemas</li>
            </ul>
          </div>

          {/* Trust & Guarantee */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">
              Safety & Support
            </h4>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-slate-300">
                <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>100% Guaranteed Seat Lock (10 Min Hold)</span>
              </div>
              <div className="flex items-center gap-2 text-slate-300">
                <Sparkles className="w-4 h-4 text-rose-400 flex-shrink-0" />
                <span>Digital M-Ticket QR Code at Turnstiles</span>
              </div>
              <div className="flex items-center gap-2 text-slate-300">
                <HelpCircle className="w-4 h-4 text-blue-400 flex-shrink-0" />
                <span>Instant Cancellation & Refunds</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-400">
          <p>© {new Date().getFullYear()} IMovies Entertainment Ltd. All rights reserved.</p>
          <div className="flex items-center gap-4 text-slate-400">
            <span>Privacy Policy</span>
            <span aria-hidden="true">·</span>
            <span>Terms of Admission</span>
            <span aria-hidden="true">·</span>
            <span>Security</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
