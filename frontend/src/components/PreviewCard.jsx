import { useState } from "react";

export default function PreviewCard({ result }) {
  if (!result) {
    return (
      <div className="bg-white border border-gray-200 rounded-xl flex-1 flex flex-col items-center justify-center py-20 text-center px-6">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
          <svg width="28" height="28" fill="none" viewBox="0 0 24 24">
            <rect x="3" y="3" width="18" height="18" rx="3" stroke="#D1D5DB" strokeWidth="2"/>
            <circle cx="12" cy="10" r="3" stroke="#D1D5DB" strokeWidth="2"/>
            <path d="M6 20c0-3.314 2.686-5 6-5s6 1.686 6 5" stroke="#D1D5DB" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </div>
        <p className="text-sm font-medium text-gray-400">Your processed photo will appear here</p>
        <p className="text-xs text-gray-300 mt-1">Upload a photo and click Generate</p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4 flex flex-col gap-4">

      {/* Single Photo */}
      <div className="flex flex-col items-center">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Single Photo</p>
        <img
          src={result.single_photo_url.replace("/upload/", "/upload/f_auto,q_auto/")}
          alt="Passport"
          crossOrigin="anonymous"
          className="w-full rounded-lg border border-gray-100 object-contain max-h-48"
        />
        <p className="text-xs text-gray-400 mt-2">2×2 inch • 300 DPI • Ready to print</p>
      </div>

      <hr className="border-gray-100" />

      {/* Print Layout */}
      <div className="flex flex-col items-center">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Print Layout (A4)</p>
        <img
          src={result.print_layout_url.replace("/upload/", "/upload/f_auto,q_auto/")}
          alt="Print Layout"
          crossOrigin="anonymous"
          className="w-full rounded-lg border border-gray-100 object-contain max-h-48"
        />
        <p className="text-xs text-gray-400 mt-2">A4 sheet • Multiple copies • Cut along dashed lines</p>
      </div>

    </div>
  );
}