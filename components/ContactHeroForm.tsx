'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import type { ContactContent } from '@/lib/schemas/contact';
import type { SiteContent } from '@/lib/schemas/site';

interface FormState {
  name: string;
  email: string;
  phone: string;
  company: string;
  projectTypes: string[];
  budget: string;
  timing: string;
  message: string;
  _hp: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  phone?: string;
  company?: string;
  projectTypes?: string;
  budget?: string;
  timing?: string;
  message?: string;
  general?: string;
}

interface ContactHeroFormProps {
  data: ContactContent;
  site: SiteContent;
}

export default function ContactHeroForm({ data, site }: ContactHeroFormProps) {
  const [formData, setFormData] = useState<FormState>({
    name: '',
    email: '',
    phone: '',
    company: '',
    projectTypes: [],
    budget: '',
    timing: '',
    message: '',
    _hp: '',
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Custom Select dropdown states
  const [budgetOpen, setBudgetOpen] = useState(false);
  const [timingOpen, setTimingOpen] = useState(false);

  // Animation refs
  const sectionRef = useRef<HTMLElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);
  const headlineInnerRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const paragraphRef = useRef<HTMLParagraphElement>(null);
  const formRowsRef = useRef<HTMLFormElement>(null);

  // Field refs for scrolling to first error
  const nameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const phoneRef = useRef<HTMLInputElement>(null);
  const projectTypesRef = useRef<HTMLDivElement>(null);
  const budgetRef = useRef<HTMLDivElement>(null);
  const timingRef = useRef<HTMLDivElement>(null);
  const descRef = useRef<HTMLTextAreaElement>(null);

  // Page load GSAP reveal animations
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let ctx: { revert: () => void } | null = null;

    const initAnim = async () => {
      const { gsap } = await import('gsap');

      if (!sectionRef.current) return;

      ctx = gsap.context(() => {
        const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

        // 1. Orange line draws left to right (0.5s)
        if (lineRef.current) {
          gsap.set(lineRef.current, { scaleX: 0, transformOrigin: 'left' });
          tl.to(lineRef.current, { scaleX: 1, duration: 0.5 }, 0.2);
        }

        // 2. Label fades in
        if (labelRef.current) {
          gsap.set(labelRef.current, { opacity: 0, x: -8 });
          tl.to(labelRef.current, { opacity: 1, x: 0, duration: 0.6 }, 0.35);
        }

        // 3. Headline lines slide up from mask line-by-line
        const validHeadlines = headlineInnerRefs.current.filter(Boolean);
        if (validHeadlines.length > 0) {
          gsap.set(validHeadlines, { yPercent: 105 });
          tl.to(
            validHeadlines,
            {
              yPercent: 0,
              duration: 1.1,
              stagger: 0.08,
              ease: 'power3.out',
            },
            0.3
          );
        }

        // 4. Paragraph fades up 20px
        if (paragraphRef.current) {
          gsap.set(paragraphRef.current, { opacity: 0, y: 20 });
          tl.to(paragraphRef.current, { opacity: 1, y: 0, duration: 0.8 }, 0.6);
        }

        // 5. Form rows fade up 20px
        if (formRowsRef.current) {
          const rows = formRowsRef.current.querySelectorAll('.form-animate-row');
          gsap.set(rows, { opacity: 0, y: 20 });
          tl.to(
            rows,
            {
              opacity: 1,
              y: 0,
              duration: 0.7,
              stagger: 0.05,
              ease: 'power2.out',
            },
            0.4
          );
        }
      }, sectionRef);
    };

    initAnim();

    return () => {
      ctx?.revert();
    };
  }, []);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('[data-select-budget]')) setBudgetOpen(false);
      if (!target.closest('[data-select-timing]')) setTimingOpen(false);
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Validation function based on contact.json config
  const validateForm = useCallback((): FormErrors => {
    const newErrors: FormErrors = {};

    if (data.fields.name.enabled && data.fields.name.required) {
      if (!formData.name.trim()) {
        newErrors.name = data.validation.nameRequired;
      }
    }

    if (data.fields.email.enabled) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (data.fields.email.required && !formData.email.trim()) {
        newErrors.email = data.validation.emailRequired;
      } else if (formData.email.trim() && !emailRegex.test(formData.email.trim())) {
        newErrors.email = data.validation.emailInvalid;
      }
    }

    if (data.fields.phone.enabled && data.fields.phone.required) {
      if (!formData.phone.trim()) {
        newErrors.phone = 'Phone number is required';
      }
    }

    if (data.fields.projectTypes.enabled && data.fields.projectTypes.required) {
      if (formData.projectTypes.length === 0) {
        newErrors.projectTypes = data.validation.projectTypeRequired;
      }
    }

    if (data.fields.budget.enabled && data.fields.budget.required) {
      if (!formData.budget) {
        newErrors.budget = data.validation.budgetRequired;
      }
    }

    if (data.fields.timing.enabled && data.fields.timing.required) {
      if (!formData.timing) {
        newErrors.timing = data.validation.timingRequired;
      }
    }

    if (data.fields.message.enabled && data.fields.message.required) {
      if (!formData.message.trim()) {
        newErrors.message = data.validation.messageRequired;
      } else if (formData.message.trim().length < 10) {
        newErrors.message = data.validation.messageMinLength;
      }
    }

    return newErrors;
  }, [formData, data]);

  const toggleProjectType = (typeId: string) => {
    setFormData((prev) => {
      const exists = prev.projectTypes.includes(typeId);
      const nextTypes = exists
        ? prev.projectTypes.filter((t) => t !== typeId)
        : [...prev.projectTypes, typeId];
      return { ...prev, projectTypes: nextTypes };
    });
    if (errors.projectTypes) {
      setErrors((prev) => ({ ...prev, projectTypes: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);

      // Scroll to the first error
      if (validationErrors.name && nameRef.current) {
        nameRef.current.focus();
        nameRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
      } else if (validationErrors.email && emailRef.current) {
        emailRef.current.focus();
        emailRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
      } else if (validationErrors.phone && phoneRef.current) {
        phoneRef.current.focus();
        phoneRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
      } else if (validationErrors.projectTypes && projectTypesRef.current) {
        projectTypesRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
      } else if (validationErrors.budget && budgetRef.current) {
        budgetRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
      } else if (validationErrors.timing && timingRef.current) {
        timingRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
      } else if (validationErrors.message && descRef.current) {
        descRef.current.focus();
        descRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }

    setIsSubmitting(true);
    setToastMessage(null);

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const resData = await res.json();

      if (!res.ok) {
        throw new Error(resData.error || 'Submission failed');
      }

      setIsSuccess(true);
    } catch {
      const emailSuffix = data.error.showEmail ? ` ${site.brand.email}` : '';
      setToastMessage(`${data.error.text}${emailSuffix}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetForm = () => {
    setFormData({
      name: '',
      email: '',
      phone: '',
      company: '',
      projectTypes: [],
      budget: '',
      timing: '',
      message: '',
      _hp: '',
    });
    setErrors({});
    setIsSuccess(false);
    setToastMessage(null);
  };

  const selectedBudgetLabel =
    data.fields.budget.options?.find((o) => o.value === formData.budget)?.label ||
    data.fields.budget.placeholder ||
    'Choose a range';

  const selectedTimingLabel =
    data.fields.timing.options?.find((o) => o.value === formData.timing)?.label ||
    data.fields.timing.placeholder ||
    'Choose timing';

  return (
    <section
      ref={sectionRef}
      className="bg-[#F4EFE4] text-[#1a1a1a] section-px pt-[clamp(80px,11vw,160px)] pb-[clamp(80px,10vw,140px)] min-h-[100svh]"
      aria-label="Contact Section"
    >
      <div className="flex flex-col lg:flex-row justify-between items-start gap-12 lg:gap-8">
        {/* ========================================================
            LEFT COLUMN: Label + Headline + Bottom Paragraph
            ======================================================== */}
        <div className="w-full lg:w-[36vw] flex flex-col justify-between min-h-full">
          <div>
            {/* Small label row: Orange line + START A PROJECT */}
            <div className="flex items-center gap-3">
              <div
                ref={lineRef}
                className="w-7 h-[1.5px] bg-[#FF3300]"
                aria-hidden="true"
              />
              <span
                ref={labelRef}
                className="font-mono text-[11px] uppercase tracking-[0.04em] text-[#1a1a1a]"
              >
                {data.hero.label}
              </span>
            </div>

            {/* Giant Tanker Headline */}
            <h1
              className="mt-[clamp(24px,4vw,60px)] font-tanker text-[clamp(44px,12vw,240px)] leading-[0.86] uppercase tracking-[-0.01em] text-[#1a1a1a]"
              aria-label={data.hero.headlineLines.join(' ')}
            >
              {data.hero.headlineLines.map((line, i) => (
                <span key={i} className="clip-line block overflow-hidden">
                  <span
                    ref={(el) => {
                      headlineInnerRefs.current[i] = el;
                    }}
                    className="block"
                  >
                    {line}
                  </span>
                </span>
              ))}
            </h1>
          </div>

          {/* Left Column Bottom Paragraph */}
          <div className="mt-[clamp(32px,6vw,80px)] lg:mt-auto pt-6">
            <p
              ref={paragraphRef}
              className="font-mono text-[13px] leading-[1.55] max-w-[380px] text-[#1a1a1a]"
              style={{ letterSpacing: '0.02em' }}
            >
              {data.hero.paragraph}
            </p>
          </div>
        </div>

        {/* ========================================================
            RIGHT COLUMN: The Form / Success State
            ======================================================== */}
        <div className="w-full lg:w-[48vw] xl:w-[42vw]">
          {isSuccess ? (
            /* Success confirmation card */
            <div className="bg-[#1a1a1a] text-[#F3EBDD] p-8 md:p-12 border border-[#1a1a1a]/20 animate-fadeIn flex flex-col items-start gap-4">
              <h2 className="font-tanker text-[clamp(36px,5vw,56px)] leading-none uppercase text-[#FF3300]">
                {data.success.heading}
              </h2>
              <p className="font-mono text-[13px] leading-[1.6] text-[#F3EBDD]/90 max-w-[420px]">
                {data.success.message}
              </p>
              <button
                type="button"
                onClick={handleResetForm}
                className="mt-4 px-6 py-3 bg-[#FF3300] hover:bg-[#e02e00] text-[#1a1a1a] font-mono text-[12px] uppercase tracking-wider transition-colors min-h-[44px]"
              >
                {data.success.resetButton}
              </button>
            </div>
          ) : (
            <form
              ref={formRowsRef}
              onSubmit={handleSubmit}
              noValidate
              className="flex flex-col gap-6"
              aria-label="Start a project enquiry form"
            >
              {/* Hidden honeypot field for bot suppression */}
              <input
                type="text"
                name="_hp"
                value={formData._hp}
                onChange={(e) => setFormData({ ...formData, _hp: e.target.value })}
                tabIndex={-1}
                autoComplete="off"
                className="hidden"
                aria-hidden="true"
              />

              {/* Toast Error Alert */}
              {toastMessage && (
                <div
                  role="alert"
                  className="p-4 bg-[#FF3300]/10 border border-[#FF3300] text-[#1a1a1a] font-mono text-[12px] leading-relaxed flex items-center justify-between"
                >
                  <span>{toastMessage}</span>
                  <button
                    type="button"
                    onClick={() => setToastMessage(null)}
                    className="ml-4 font-bold text-sm"
                    aria-label="Dismiss error notification"
                  >
                    ✕
                  </button>
                </div>
              )}

              {/* 1. Name & Email row */}
              <div className="form-animate-row grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* NAME */}
                {data.fields.name.enabled && (
                  <div className="flex flex-col">
                    <label
                      htmlFor="contact-name"
                      className="font-mono text-[11px] uppercase tracking-[0.04em] text-[#1a1a1a] mb-2"
                    >
                      {data.fields.name.label}{' '}
                      {data.fields.name.required ? '(REQUIRED)' : '(OPTIONAL)'}
                    </label>
                    <input
                      ref={nameRef}
                      id="contact-name"
                      type="text"
                      autoComplete="name"
                      placeholder={data.fields.name.placeholder}
                      value={formData.name}
                      onChange={(e) => {
                        setFormData({ ...formData, name: e.target.value });
                        if (errors.name) setErrors({ ...errors, name: undefined });
                      }}
                      className={`contact-input-base ${
                        errors.name ? 'contact-input-error' : ''
                      }`}
                      aria-required={data.fields.name.required}
                      aria-invalid={!!errors.name}
                      aria-describedby={errors.name ? 'contact-name-error' : undefined}
                    />
                    {errors.name && (
                      <span id="contact-name-error" className="contact-error-msg">
                        {errors.name}
                      </span>
                    )}
                  </div>
                )}

                {/* EMAIL */}
                {data.fields.email.enabled && (
                  <div className="flex flex-col">
                    <label
                      htmlFor="contact-email"
                      className="font-mono text-[11px] uppercase tracking-[0.04em] text-[#1a1a1a] mb-2"
                    >
                      {data.fields.email.label}{' '}
                      {data.fields.email.required ? '(REQUIRED)' : '(OPTIONAL)'}
                    </label>
                    <input
                      ref={emailRef}
                      id="contact-email"
                      type="email"
                      autoComplete="email"
                      placeholder={data.fields.email.placeholder}
                      value={formData.email}
                      onChange={(e) => {
                        setFormData({ ...formData, email: e.target.value });
                        if (errors.email) setErrors({ ...errors, email: undefined });
                      }}
                      className={`contact-input-base ${
                        errors.email ? 'contact-input-error' : ''
                      }`}
                      aria-required={data.fields.email.required}
                      aria-invalid={!!errors.email}
                      aria-describedby={errors.email ? 'contact-email-error' : undefined}
                    />
                    {errors.email && (
                      <span id="contact-email-error" className="contact-error-msg">
                        {errors.email}
                      </span>
                    )}
                  </div>
                )}
              </div>

              {/* PHONE (if enabled in contact.json) */}
              {data.fields.phone?.enabled && (
                <div className="form-animate-row flex flex-col">
                  <label
                    htmlFor="contact-phone"
                    className="font-mono text-[11px] uppercase tracking-[0.04em] text-[#1a1a1a] mb-2"
                  >
                    {data.fields.phone.label}{' '}
                    {data.fields.phone.required ? '(REQUIRED)' : '(OPTIONAL)'}
                  </label>
                  <input
                    ref={phoneRef}
                    id="contact-phone"
                    type="tel"
                    autoComplete="tel"
                    placeholder={data.fields.phone.placeholder}
                    value={formData.phone}
                    onChange={(e) => {
                      setFormData({ ...formData, phone: e.target.value });
                      if (errors.phone) setErrors({ ...errors, phone: undefined });
                    }}
                    className={`contact-input-base ${
                      errors.phone ? 'contact-input-error' : ''
                    }`}
                  />
                  {errors.phone && (
                    <span className="contact-error-msg">{errors.phone}</span>
                  )}
                </div>
              )}

              {/* COMPANY (if enabled) */}
              {data.fields.company.enabled && (
                <div className="form-animate-row flex flex-col">
                  <label
                    htmlFor="contact-company"
                    className="font-mono text-[11px] uppercase tracking-[0.04em] text-[#1a1a1a] mb-2"
                  >
                    {data.fields.company.label}{' '}
                    {data.fields.company.required ? '(REQUIRED)' : '(OPTIONAL)'}
                  </label>
                  <input
                    id="contact-company"
                    type="text"
                    autoComplete="organization"
                    placeholder={data.fields.company.placeholder}
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    className="contact-input-base"
                  />
                </div>
              )}

              {/* PROJECT TYPE (2x2 grid) */}
              {data.fields.projectTypes.enabled && (
                <div ref={projectTypesRef} className="form-animate-row flex flex-col">
                  <span
                    id="project-type-label"
                    className="font-mono text-[11px] uppercase tracking-[0.04em] text-[#1a1a1a] mb-2"
                  >
                    {data.fields.projectTypes.label}{' '}
                    {data.fields.projectTypes.required ? '(REQUIRED)' : '(OPTIONAL)'}
                  </span>
                  <div
                    role="group"
                    aria-labelledby="project-type-label"
                    className="grid grid-cols-1 sm:grid-cols-2 gap-3"
                  >
                    {data.fields.projectTypes.options.map((option) => {
                      const isSelected = formData.projectTypes.includes(option.id);
                      return (
                        <div
                          key={option.id}
                          role="checkbox"
                          tabIndex={0}
                          aria-checked={isSelected}
                          onClick={() => toggleProjectType(option.id)}
                          onKeyDown={(e) => {
                            if (e.key === ' ' || e.key === 'Enter') {
                              e.preventDefault();
                              toggleProjectType(option.id);
                            }
                          }}
                          className={`contact-option-box cursor-pointer select-none transition-all min-h-[56px] flex items-center px-4 ${
                            isSelected
                              ? 'border-[#1a1a1a] bg-[#1a1a1a]/[0.04]'
                              : 'border-[rgba(26,26,26,0.35)] hover:border-[#1a1a1a]'
                          }`}
                        >
                          <div
                            className={`w-3.5 h-3.5 rounded-full border border-[#1a1a1a] mr-3 flex items-center justify-center transition-colors flex-shrink-0 ${
                              isSelected ? 'bg-[#1a1a1a]' : 'bg-transparent'
                            }`}
                          >
                            {isSelected && (
                              <div className="w-1.5 h-1.5 rounded-full bg-[#F4EFE4]" />
                            )}
                          </div>
                          <span className="font-mono text-[12px] md:text-[13px] text-[#1a1a1a]">
                            {option.label}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                  {errors.projectTypes && (
                    <span className="contact-error-msg mt-2">
                      {errors.projectTypes}
                    </span>
                  )}
                </div>
              )}

              {/* BUDGET & TIMING row */}
              <div className="form-animate-row grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* APPROXIMATE BUDGET */}
                {data.fields.budget.enabled && (
                  <div ref={budgetRef} data-select-budget className="relative flex flex-col">
                    <label
                      htmlFor="contact-budget-select"
                      className="font-mono text-[11px] uppercase tracking-[0.04em] text-[#1a1a1a] mb-2"
                    >
                      {data.fields.budget.label}{' '}
                      {data.fields.budget.required ? '(REQUIRED)' : '(OPTIONAL)'}
                    </label>

                    {/* Native select on mobile */}
                    <select
                      id="contact-budget-select"
                      value={formData.budget}
                      onChange={(e) => {
                        setFormData({ ...formData, budget: e.target.value });
                        if (errors.budget) setErrors({ ...errors, budget: undefined });
                      }}
                      className="md:hidden absolute inset-0 w-full h-[56px] opacity-0 z-10 cursor-pointer"
                      aria-required={data.fields.budget.required}
                    >
                      <option value="">{data.fields.budget.placeholder}</option>
                      {data.fields.budget.options?.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>

                    {/* Desktop custom select trigger */}
                    <button
                      type="button"
                      onClick={() => setBudgetOpen((prev) => !prev)}
                      className={`contact-select-trigger ${
                        errors.budget ? 'contact-input-error' : ''
                      }`}
                      aria-expanded={budgetOpen}
                      aria-haspopup="listbox"
                    >
                      <span className={formData.budget ? 'text-[#1a1a1a]' : 'text-[#1a1a1a]/50'}>
                        {selectedBudgetLabel}
                      </span>
                      <span
                        className={`text-[10px] transition-transform ${
                          budgetOpen ? 'rotate-180 text-[#FF3300]' : 'text-[#1a1a1a]/60'
                        }`}
                      >
                        ▼
                      </span>
                    </button>

                    {/* Desktop dropdown list */}
                    {budgetOpen && (
                      <div
                        role="listbox"
                        className="hidden md:block absolute top-[calc(100%+4px)] left-0 w-full bg-[#F4EFE4] border border-[#1a1a1a] z-50 shadow-lg py-1 max-h-[220px] overflow-y-auto"
                      >
                        {data.fields.budget.options?.map((option) => (
                          <div
                            key={option.value}
                            role="option"
                            tabIndex={0}
                            aria-selected={formData.budget === option.value}
                            onClick={() => {
                              setFormData({ ...formData, budget: option.value });
                              setBudgetOpen(false);
                              if (errors.budget) setErrors({ ...errors, budget: undefined });
                            }}
                            className="px-4 py-3 font-mono text-[13px] text-[#1a1a1a] hover:bg-[#1a1a1a] hover:text-[#F3EBDD] cursor-pointer transition-colors"
                          >
                            {option.label}
                          </div>
                        ))}
                      </div>
                    )}
                    {errors.budget && (
                      <span className="contact-error-msg">{errors.budget}</span>
                    )}
                  </div>
                )}

                {/* TIMING */}
                {data.fields.timing.enabled && (
                  <div ref={timingRef} data-select-timing className="relative flex flex-col">
                    <label
                      htmlFor="contact-timing-select"
                      className="font-mono text-[11px] uppercase tracking-[0.04em] text-[#1a1a1a] mb-2"
                    >
                      {data.fields.timing.label}{' '}
                      {data.fields.timing.required ? '(REQUIRED)' : '(OPTIONAL)'}
                    </label>

                    {/* Native select on mobile */}
                    <select
                      id="contact-timing-select"
                      value={formData.timing}
                      onChange={(e) => {
                        setFormData({ ...formData, timing: e.target.value });
                        if (errors.timing) setErrors({ ...errors, timing: undefined });
                      }}
                      className="md:hidden absolute inset-0 w-full h-[56px] opacity-0 z-10 cursor-pointer"
                      aria-required={data.fields.timing.required}
                    >
                      <option value="">{data.fields.timing.placeholder}</option>
                      {data.fields.timing.options?.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>

                    {/* Desktop custom select trigger */}
                    <button
                      type="button"
                      onClick={() => setTimingOpen((prev) => !prev)}
                      className={`contact-select-trigger ${
                        errors.timing ? 'contact-input-error' : ''
                      }`}
                      aria-expanded={timingOpen}
                      aria-haspopup="listbox"
                    >
                      <span className={formData.timing ? 'text-[#1a1a1a]' : 'text-[#1a1a1a]/50'}>
                        {selectedTimingLabel}
                      </span>
                      <span
                        className={`text-[10px] transition-transform ${
                          timingOpen ? 'rotate-180 text-[#FF3300]' : 'text-[#1a1a1a]/60'
                        }`}
                      >
                        ▼
                      </span>
                    </button>

                    {/* Desktop dropdown list */}
                    {timingOpen && (
                      <div
                        role="listbox"
                        className="hidden md:block absolute top-[calc(100%+4px)] left-0 w-full bg-[#F4EFE4] border border-[#1a1a1a] z-50 shadow-lg py-1 max-h-[220px] overflow-y-auto"
                      >
                        {data.fields.timing.options?.map((option) => (
                          <div
                            key={option.value}
                            role="option"
                            tabIndex={0}
                            aria-selected={formData.timing === option.value}
                            onClick={() => {
                              setFormData({ ...formData, timing: option.value });
                              setTimingOpen(false);
                              if (errors.timing) setErrors({ ...errors, timing: undefined });
                            }}
                            className="px-4 py-3 font-mono text-[13px] text-[#1a1a1a] hover:bg-[#1a1a1a] hover:text-[#F3EBDD] cursor-pointer transition-colors"
                          >
                            {option.label}
                          </div>
                        ))}
                      </div>
                    )}
                    {errors.timing && (
                      <span className="contact-error-msg">{errors.timing}</span>
                    )}
                  </div>
                )}
              </div>

              {/* MESSAGE / DESCRIPTION */}
              {data.fields.message.enabled && (
                <div className="form-animate-row flex flex-col">
                  <div className="flex flex-col mb-2">
                    <label
                      htmlFor="contact-message"
                      className="font-mono text-[11px] uppercase tracking-[0.04em] text-[#1a1a1a]"
                    >
                      {data.fields.message.label}{' '}
                      {data.fields.message.required ? '(REQUIRED)' : '(OPTIONAL)'}
                    </label>
                    {data.fields.message.helper && (
                      <span className="font-mono text-[10px] text-[#1a1a1a]/60 mt-0.5 normal-case">
                        {data.fields.message.helper}
                      </span>
                    )}
                  </div>
                  <textarea
                    ref={descRef}
                    id="contact-message"
                    rows={4}
                    placeholder={data.fields.message.placeholder}
                    value={formData.message}
                    onChange={(e) => {
                      setFormData({ ...formData, message: e.target.value });
                      if (errors.message) setErrors({ ...errors, message: undefined });
                    }}
                    className={`contact-input-base resize-none ${
                      errors.message ? 'contact-input-error' : ''
                    }`}
                    aria-required={data.fields.message.required}
                    aria-invalid={!!errors.message}
                    aria-describedby={errors.message ? 'contact-message-error' : undefined}
                  />
                  {errors.message && (
                    <span id="contact-message-error" className="contact-error-msg">
                      {errors.message}
                    </span>
                  )}
                </div>
              )}

              {/* SUBMIT BUTTON + PRIVACY NOTE */}
              <div className="form-animate-row flex flex-col gap-3 mt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-[#FF3300] hover:bg-[#e02e00] text-[#1a1a1a] font-mono text-[12px] uppercase tracking-[0.08em] font-bold py-4 min-h-[56px] flex items-center justify-center transition-all duration-300 disabled:opacity-50 cursor-pointer"
                >
                  {isSubmitting ? data.submit.sending : data.submit.label}
                </button>
                {data.privacyNote && (
                  <p className="font-mono text-[10px] text-[#1a1a1a]/50 text-center">
                    {data.privacyNote}
                  </p>
                )}
              </div>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
