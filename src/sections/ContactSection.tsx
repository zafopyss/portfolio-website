import { contacts } from '@data/contacts';
import { Contacts } from '@enums/ContactsEnum';

export default function ContactSection() {
  return (
    <section
      id="contact"
      aria-label="Section contact"
    >
      <div className="mx-auto flex max-w-4xl flex-col gap-6 text-center">
        <a
          href={Contacts.EmailAdressWithTo}
          className="inline-block text-lg font-medium text-neutral-200 border border-red-500 hover:border-blue-400 hover:text-blue-400 transition-all duration-200 transform focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
          aria-label={`Envoyer un mail à ${Contacts.Email}`}
          style={{ height: '500px' }}
        >
            a contact me 
        </a>
        <div className="flex items-center justify-center gap-6">
          {Object.entries(contacts).map(([key, entry]) => (
            <a
              key={key}
              href={entry.url}
              target="_blank"
              rel="noreferrer"
              className="flex h-12 w-12 items-center justify-center rounded-full border border-white/10 bg-black/40 transition hover:border-blue-400"
            >
              {entry.icon ? (
                <img src={entry.icon} alt={`${key} icon`} className="h-6 w-6" />
              ) : (
                key
              )}
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
