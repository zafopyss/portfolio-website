import { Contacts } from '@enums/ContactsEnum';
import GithubLogo from '../assets/github-logo.svg';
import LinkedinLogo from '../assets/linkedin-logo.svg';


type ContactEntry = {
    url: string;
    icon?: string;
};


export const contacts: Record<'linkedin' | 'github', ContactEntry> = {
    linkedin: {
        url: Contacts.LinkedIn,
        icon: LinkedinLogo,
    },
    github: {
        url: Contacts.GitHub,
        icon: GithubLogo,
    },
};
