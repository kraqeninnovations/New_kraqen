import { SiteContent, siteSchema } from '../schemas/site';
import { HomeContent, homeSchema } from '../schemas/home';
import { AboutContent, aboutSchema } from '../schemas/about';
import { WorkContent, workSchema } from '../schemas/work';
import { ContactContent, contactSchema } from '../schemas/contact';

import siteJson from '../../content/site.json';
import homeJson from '../../content/home.json';
import aboutJson from '../../content/about.json';
import workJson from '../../content/work.json';
import contactJson from '../../content/contact.json';

export const defaultSite: SiteContent = siteSchema.parse(siteJson);
export const defaultHome: HomeContent = homeSchema.parse(homeJson);
export const defaultAbout: AboutContent = aboutSchema.parse(aboutJson);
export const defaultWork: WorkContent = workSchema.parse(workJson);
export const defaultContact: ContactContent = contactSchema.parse(contactJson);

export const defaultContentMap = {
  site: defaultSite,
  home: defaultHome,
  about: defaultAbout,
  work: defaultWork,
  contact: defaultContact,
} as const;
