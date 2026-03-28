type LoadingCardProps = {
  lines?: number;
};

export function LoadingCard({ lines = 3 }: LoadingCardProps) {
  return (
    <div className="card loading-card">
      <div className="loading-block loading-block--title" />
      <div className="loading-stack">
        {Array.from({ length: lines }).map((_, index) => (
          <div key={index} className="loading-block" />
        ))}
      </div>
    </div>
  );
}