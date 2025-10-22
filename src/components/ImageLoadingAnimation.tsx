export const ImageLoadingAnimation = () => {
  return (
    <div className="relative w-full max-w-md mx-auto py-8">
      <div className="relative h-64 rounded-2xl bg-gradient-to-br from-primary/10 to-secondary/10 border-2 border-dashed border-primary/30 overflow-hidden">
        {/* Animated grid background */}
        <div className="absolute inset-0 opacity-20">
          <div className="grid grid-cols-8 grid-rows-8 h-full w-full">
            {Array.from({ length: 64 }).map((_, i) => (
              <div
                key={i}
                className="border border-primary/20 animate-pulse"
                style={{
                  animationDelay: `${i * 0.05}s`,
                  animationDuration: "2s"
                }}
              />
            ))}
          </div>
        </div>

        {/* Floating particles */}
        <div className="absolute inset-0">
          {Array.from({ length: 12 }).map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 rounded-full bg-primary/40 animate-float"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${i * 0.3}s`,
                animationDuration: `${3 + Math.random() * 2}s`
              }}
            />
          ))}
        </div>

        {/* Center icon with pulse */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative">
            <div className="absolute inset-0 bg-primary/20 rounded-full animate-ping" />
            <div className="relative w-20 h-20 bg-gradient-to-br from-primary to-secondary rounded-2xl flex items-center justify-center animate-bounce">
              <svg
                className="w-10 h-10 text-background"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
          </div>
        </div>

        {/* Scanning line effect */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent animate-scan" />
        </div>
      </div>

      {/* Fun loading text */}
      <div className="text-center mt-6">
        <p className="text-lg font-medium bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent animate-pulse">
          Creating your masterpiece...
        </p>
        <div className="flex justify-center gap-1 mt-2">
          <span className="animate-bounce" style={{ animationDelay: "0s" }}>✨</span>
          <span className="animate-bounce" style={{ animationDelay: "0.1s" }}>🎨</span>
          <span className="animate-bounce" style={{ animationDelay: "0.2s" }}>🚀</span>
        </div>
      </div>
    </div>
  );
};