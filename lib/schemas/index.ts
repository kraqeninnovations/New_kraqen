import { siteSchema } from './site';
import { homeSchema } from './home';
import { aboutSchema } from './about';
import { workSchema } from './work';
import { contactSchema } from './contact';

export * from './site';
export * from './home';
export * from './about';
export * from './work';
export * from './contact';

export const contentSchemas = {
  site: siteSchema,
  home: homeSchema,
  about: aboutSchema,
  work: workSchema,
  contact: contactSchema,
} as const;

export type ContentName = keyof typeof contentSchemas;

