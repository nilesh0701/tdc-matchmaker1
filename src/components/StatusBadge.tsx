type Status = 'active' | 'on_hold' | 'paused' | 'matched';

const statusStyles: Record<Status, string> = {
  active: 'bg-green-50 text-green-700 border-green-200',
  on_hold: 'bg-amber-50 text-amber-700 border-amber-200',
  paused: 'bg-gray-50 text-gray-600 border-gray-200',
  matched: 'bg-[var(--tdc-rose-light)] text-[var(--tdc-rose-dark)] border-[var(--tdc-border)]',
};

export default function StatusBadge({ status }: { status: Status }) {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium capitalize ${statusStyles[status]}`}
    >
      {status.replace('_', ' ')}
    </span>
  );
}
