import ContactBubble from '@components/design/ContactBubble/ContactBubble';
import CursorSpotlight from '@components/design/CursorSpotlight/CursorSpotlight';
import GradientText from '@components/design/GradientText/GradientText';
import { contacts } from '@data/contacts';
import { Contacts } from '@enums/ContactsEnum';

export default function ContactSection() {
  return (
    <section
      id="contact"
      aria-label="Contact"
      className="scroll mt-6 px-3 sm:py-12 lg:px-15 lg:py-15"
    >
      <CursorSpotlight size={52} opacity={0.25} borderRadius="rounded-3xl" className="mx-auto max-w-3xl">
        <div className="relative mx-auto space-y-4 rounded-3xl border border-white/10 bg-black-particule/85 p-4 sm:p-8 text-white">
        <GradientText
          as="h2"
          text="Contact !"
          gradientStart="var(--color-silver)"
          gradientEnd="var(--color-blue-python)"
          sizeClass="text-3xl font-bold"
        />
        <p className="text-sm text-white/70 sm:mt-4">
          N’hésitez pas à me contacter pour travailler sur un projet, poser une question ou simplement échanger.
        </p>
          <a
            href={Contacts.EmailAdressWithTo}
            className="inline-flex flex-col items-center"
          >
            <span className="text-md font-semibold lowercase text-blue-200">
              {Contacts.Email}
            </span>
            <span className="block w-full h-px bg-blue-200 mt-0.5"></span>
          </a>

        <div className="flex gap-4 text-white/60">
          {Object.entries(contacts).map(([key, entry]) => (
            <ContactBubble key={key} contact={entry} label={key} />
          ))}
        </div>
        </div>
      </CursorSpotlight>
    </section>
  );
}
