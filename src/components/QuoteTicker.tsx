const quotes = [
  "Be the spark that ignites change",
  "Everyone is different, and that's our strength",
  "Ignite the spark within you",
  "Show the world what you can do",
  "Your uniqueness is your superpower",
  "Create your own constellation",
  "Let your light shine across the universe",
  "Every star has its own brilliance",
];

export const QuoteTicker = () => {
  // Duplicate quotes for seamless loop
  const duplicatedQuotes = [...quotes, ...quotes];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-card/50 backdrop-blur-sm border-t border-primary/30 overflow-hidden z-50">
      <div className="flex animate-ticker whitespace-nowrap py-2">
        {duplicatedQuotes.map((quote, index) => (
          <span
            key={index}
            className="inline-flex items-center mx-6 text-sm text-foreground font-medium"
          >
            <span className="text-primary mr-2 text-lg animate-glow">✦</span>
            {quote}
            <span className="text-secondary ml-2 text-lg animate-glow">✦</span>
          </span>
        ))}
      </div>
    </div>
  );
};
