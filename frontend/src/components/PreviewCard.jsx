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
    <>
      {/* Single Photo Preview */}
      <div className="bg-white border border-gray-200 rounded-xl p-4">
        <p className="text-sm font-medium text-gray-700 mb-3">Single Photo Preview</p>
        <img
          src={`http://127.0.0.1:8000${result.single_photo_url}`}
          alt="Passport"
          className="w-full rounded-lg border border-gray-100 object-contain max-h-64"
        />
      </div>

      {/* Print Layout Preview */}
      <div className="bg-white border border-gray-200 rounded-xl p-4">
        <p className="text-sm font-medium text-gray-700 mb-3">Print Layout (A4)</p>
        <img
          src={`http://127.0.0.1:8000${result.print_layout_url}`}
          alt="Print Layout"
          className="w-full rounded-lg border border-gray-100 object-contain max-h-64"
        />
      </div>
    </>
  );
}