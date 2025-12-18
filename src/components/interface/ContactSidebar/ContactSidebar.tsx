import { Contacts } from '@enums/ContactsEnum';
import { useEffect, useRef, useState } from 'react';

const contactActions = [
  {
    label: 'Git',
    url: Contacts.GitHub,
    ariaLabel: 'Ouvrir mon profil GitHub',
  },
  {
    label: 'In',
    url: Contacts.LinkedIn,
    ariaLabel: 'Visiter mon profil LinkedIn',
  },
  {
    label: 'Mail',
    url: Contacts.EmailAdressWithTo,
    ariaLabel: 'Envoyer un mail à Walter Eliot',
  },
];

export default function ContactSidebar() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [indicatorTop, setIndicatorTop] = useState(0);
  const actionRefs = useRef<Array<HTMLAnchorElement | null>>([]);
  const INDICATOR_SIZE = 6;

  useEffect(() => {
    const element = actionRefs.current[activeIndex];
    if (!element) {
      return;
    }
    // center the dot vertically next to the hovered label
    setIndicatorTop(element.offsetTop + element.offsetHeight / 2 - INDICATOR_SIZE / 2);
  }, [activeIndex]);

  return (
    <aside className="hidden lg:block">
      <div className="fixed right-4 top-[45%] flex flex-col items-end">
        <div className="relative pr-6">
          <span
            className="pointer-events-none absolute -left-4 h-1.5 w-1.5 rounded-full bg-white transition-all duration-600 ease-in-out"
            style={{ top: indicatorTop }}
          />
          <div className="flex flex-col gap-3">
            {contactActions.map((action, index) => (
              <a
                key={action.label}
                ref={(el) => (actionRefs.current[index] = el)}
                href={action.url}
                target="_blank"
                rel="noreferrer"
                aria-label={action.ariaLabel}
                onMouseEnter={() => setActiveIndex(index)}
                className="text-md font-semibold text-white transition-colors duration-200 hover:text-blue-python"
              >
                {action.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </aside>
  );
}
