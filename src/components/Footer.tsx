export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="border-t border-white/5 py-12 mt-20">
      <div className="max-w-7xl mx-auto px-6 flex justify-center items-center">
        <p className="text-sm text-[#86868b]">
          &copy; {year} Aditiya Syaiful Ramadhan. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
