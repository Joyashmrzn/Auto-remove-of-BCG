export default function DownloadButtons({ result }) {
  if (!result) return null;

  const handleDownload = async (url, filename) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}${url}`);
      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      URL.revokeObjectURL(blobUrl);
    } catch (err) {
      console.error("Download failed:", err);
    }
  };

  return (
    <div className="grid grid-cols-2 gap-3">
      <button
        onClick={() => handleDownload(result.single_photo_url, "passport_single.png")}
        className="py-3 px-4 rounded-xl border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50 active:scale-95 transition-all flex items-center justify-center gap-2"
      >
        <svg width="16" height="16" fill="none" viewBox="0 0 24 24">
          <path d="M12 16l-4-4h3V4h2v8h3l-4 4z" fill="currentColor"/>
          <path d="M4 20h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        </svg>
        Single Photo
      </button>
      <button
        onClick={() => handleDownload(result.print_layout_url, "passport_print_a4.png")}
        className="py-3 px-4 rounded-xl bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 active:scale-95 transition-all flex items-center justify-center gap-2"
      >
        <svg width="16" height="16" fill="none" viewBox="0 0 24 24">
          <path d="M12 16l-4-4h3V4h2v8h3l-4 4z" fill="currentColor"/>
          <path d="M4 20h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        </svg>
        Print Layout
      </button>
    </div>
  );
}