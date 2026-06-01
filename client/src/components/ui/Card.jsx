export default function Card({ children, className = '' }) {
  return (
    <div className={`bg-white border border-highlight/15 rounded-2xl p-6 ${className}`}>
      {children}
    </div>
  );
}
