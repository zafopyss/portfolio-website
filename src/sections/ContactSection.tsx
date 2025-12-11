import GradientText from '@components/design/GradientText/GradientText';
import { contacts } from '@data/contacts';
import { Contacts } from '@enums/ContactsEnum';

export default function ContactSection() {
  return (
    <section
      id="contact"
      aria-label="Section contact"
      className='scroll-mt-24 px-6 py-12 lg:px-15 lg:py-10'
    >
        <div  className="mb-15" style={{ height: '500px' }}></div>

      <div className="flex flex-col sm:gap-6 text-center border border-4 border-yellow-400 ">
            <GradientText as="a" text="Contact !" sizeClass="text-3xl font-bold mb-10" gradientStart="var(--color-silver)" gradientEnd="var(--color-blue-python)" className="text-left" />
        <a
          href={Contacts.EmailAdressWithTo}
          className="inline-block text-lg font-medium  transition-all duration-200 transform"
          aria-label={`Envoyer un mail à ${Contacts.Email}`}
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
