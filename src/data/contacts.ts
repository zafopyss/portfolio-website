import { Contacts } from '@enums/ContactsEnum';
import LinkedinLogo from '../assets/OthersIcons/linkedin-logo.svg';
import GithubLogo from '../assets/TechIcons/github-logo.svg';


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
