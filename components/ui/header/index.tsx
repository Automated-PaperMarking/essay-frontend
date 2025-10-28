import Image from "next/image";

const Header = () => {
  return (
    <header className="w-full border-b border-gray-100 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center space-x-4">
          <div className="relative w-40 h-30 flex-shrink-0">
            <Image
              src="/logo.png"
              alt="Yahoo Auction Logo"
              fill
              className="object-contain"
              priority
            />
          </div>
          <div className="flex flex-col">
            <h1 className="text-3xl font-light text-gray-900 tracking-tight">
              Photo Upload
            </h1>
            <span className="text-sm text-gray-500 font-normal">
              Yahoo Auction
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;