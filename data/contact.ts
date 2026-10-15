// ============================================================
// KRAQEN INNOVATIONS LLP — CONTACT PAGE DATA
// Single source of truth for /contact page copy and options
// ============================================================

export interface ProjectTypeOption {
  id: string;
  label: string;
}

export interface ContactData {
  meta: {
    title: string;
    description: string;
  };
  hero: {
    label: string;
    headline: string[];
    paragraph: string;
  };
  form: {
    nameLabel: string;
    namePlaceholder: string;
    emailLabel: string;
    emailPlaceholder: string;
    companyLabel: string;
    companyPlaceholder: string;
    projectTypeLabel: string;
    projectTypes: ProjectTypeOption[];
    budgetLabel: string;
    budgetPlaceholder: string;
    budgetOptions: string[];
    timingLabel: string;
    timingPlaceholder: string;
    timingOptions: string[];
    descriptionLabel: string;
    descriptionHelper: string;
    descriptionPlaceholder: string;
    submitLabel: string;
    submittingLabel: string;
    privacyNote: string;
    success: {
      heading: string;
      message: string;
      resetButton: string;
    };
    error: {
      toast: string;
      studioEmail: string;
    };
  };
}

export const contactData: ContactData = {
  meta: {
    title: 'Kraqen Innovations LLP',
    description: "Start a project with Kraqen Innovations LLP. Let's give your story a point of view.",
  },
  hero: {
    label: 'START A PROJECT',
    headline: ['BRING', 'US INTO', 'THE', 'PICTURE'],
    paragraph:
      "Have a story to tell, a feeling to capture, or a moment worth holding onto? Let's give it a point of view.",
  },
  form: {
    nameLabel: 'NAME (REQUIRED)',
    namePlaceholder: 'Jane Doe',
    emailLabel: 'EMAIL (REQUIRED)',
    emailPlaceholder: 'jane@example.com',
    companyLabel: 'COMPANY (OPTIONAL)',
    companyPlaceholder: 'Acme Studio',
    projectTypeLabel: 'PROJECT TYPE (CHOOSE ALL THAT APPLY, REQUIRED)',
    projectTypes: [
      { id: 'video', label: 'Video Production' },
      { id: 'photo', label: 'Photography' },
      { id: 'social', label: 'Social Media' },
      { id: 'creative', label: 'Creative Direction' },
    ],
    budgetLabel: 'APPROXIMATE BUDGET (REQUIRED)',
    budgetPlaceholder: 'Choose a range',
    budgetOptions: [
      'Under $5,000',
      '$5,000 - $10,000',
      '$10,000 - $25,000',
      '$25,000 - $50,000',
      '$50,000+',
      'Not sure yet',
    ],
    timingLabel: 'TIMING (REQUIRED)',
    timingPlaceholder: 'Choose timing',
    timingOptions: [
      'ASAP',
      'Within 1 month',
      '1 - 3 months',
      '3+ months',
      'Flexible',
    ],
    descriptionLabel: 'TELL US ABOUT THE PROJECT (REQUIRED)',
    descriptionHelper:
      'What are you making, who is it for, and what should the work accomplish?',
    descriptionPlaceholder:
      'Tell us about your brand, campaign goals, key deliverables, and desired vision...',
    submitLabel: 'SEND ENQUIRY',
    submittingLabel: 'SENDING...',
    privacyNote: 'By sending, you agree to our Privacy Policy.',
    success: {
      heading: 'THANK YOU.',
      message: 'We got your enquiry and will reply within 1 to 2 business days.',
      resetButton: 'SEND ANOTHER',
    },
    error: {
      toast: 'Something went wrong. Please try again or email us directly.',
      studioEmail: 'support@kraqeninc.com',
    },
  },
};

