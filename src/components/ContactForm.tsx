import { ContactPageContent } from './site/KraqenContactContent';
import { useSiteData } from '@/lib/site-data';

export function ContactForm() {
  const data = useSiteData();
  return <ContactPageContent />;
}

export default ContactForm;
