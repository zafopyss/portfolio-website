export interface ContactBubbleProps {
  contact: {
    url: string;
    icon?: string;
  };
  label: string;
}

export default function ContactBubble({ contact, label }: ContactBubbleProps) {
  return (
    <a
        className="group relative inline-flex items-center justify-center p-3 rounded-full border-2 border-white/20 bg-transparent text-gray-400 transition duration-300 hover:text-white hover:bg-white/10"
        href={contact.url}
        aria-label={label}
        target="_blank"
        rel="noreferrer"
        title={label}
    >
        {contact.icon ? (
          <img
            src={contact.icon}
            alt={`${label} logo`}
            className="w-4 h-4 transition duration-300 group-hover:scale-105"
            aria-hidden="true"
          />
        ) : (
          <span className="text-xs font-semibold uppercase tracking-[0.3em]" aria-hidden="true">
            {label[0]}
          </span>
        )}
    </a>
  );
}
