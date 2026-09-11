export default function Arrow({ down = false, className = '' }: { down?: boolean; className?: string }) {
  return (
    <span aria-hidden="true" className={className}>
      {down ? '↓' : '↗'}
    </span>
  );
}
