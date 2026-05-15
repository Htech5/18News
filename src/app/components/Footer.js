export default function Footer() {
  return (
    <div className="bg-[#262626] pb-24 md:pb-0">
      <footer className="relative w-full bg-[#262626] text-white pt-5 pb-2 md:pt-0 md:pb-4 h-[65px] md:h-auto">
        <div className="absolute top-0 left-0 w-full h-2 md:h-3 bg-[#DC2626] rounded-b-[20px]"></div>
        <div className="relative z-10 h-full flex flex-col justify-start pt-4 md:pt-0 px-6">
          <div className="relative flex md:hidden items-center justify-start py-0 h-[65px] w-full">
            <div className="absolute left-[-120px] top-[72%] -translate-y-1/2">
              <img src="/logo-18.png" alt="18" className="w-[290px] h-auto object-contain object-left" />
            </div>
            <div className="absolute left-[70px] top-[72%] -translate-y-1/2 w-[1px] h-[50px] bg-[#848587]"></div>
            <div className="absolute left-[100px] top-[72%] -translate-y-1/2 flex flex-col gap-2 justify-center">
              <div className="flex items-center gap-3">
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
                <span className="text-[11px] font-medium text-gray-300 whitespace-nowrap">18News_Official</span>
              </div>
              <div className="flex items-center gap-3">
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                <span className="text-[11px] font-medium text-gray-300 whitespace-nowrap">18news@gmail.com</span>
              </div>
              <div className="flex items-center gap-3">
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
                <span className="text-[11px] font-medium text-gray-300 whitespace-nowrap">18News_Official</span>
              </div>
            </div>
          </div>
        </div>
        <div className="hidden md:flex flex-col items-center gap-0 w-full">
          <img src="/logo-18.png" className="w-56 h-auto scale-150 -mb-3" alt="Logo" />
          <div className="w-full max-w-[350px] h-[1px] bg-[#848587]"></div>
          <div className="flex items-center gap-12 mt-3">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="hover:stroke-red-500 transition-colors cursor-pointer"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="hover:stroke-red-500 transition-colors cursor-pointer"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="hover:stroke-red-500 transition-colors cursor-pointer"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
          </div>
        </div>
      </footer>
    </div>
  );
}
