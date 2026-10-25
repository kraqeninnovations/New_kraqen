'use client';

import React, { useState } from 'react';
import type { SiteContent } from '@/lib/schemas/site';
import PhoneInput from './PhoneInput';
import Button from './Button';
import { isValidPhoneNumber } from 'libphonenumber-js';

interface InquiryFormProps {
  site: SiteContent;
  fieldSet?: 'inquiry' | 'contact';
  placement?: 'footer' | 'about' | 'contact';
  className?: string;
  submitButtonClassName?: string;
}

export default function InquiryForm({
  site,
  fieldSet = 'inquiry',
  placement = 'footer',
  className = '',
  submitButtonClassName = '',
}: InquiryFormProps) {
  const fields = site.forms.fieldSets[fieldSet] || site.forms.fieldSets.inquiry || [];
  const serviceOptions = site.serviceOptions || [];

  const [formData, setFormData] = useState<Record<string, string>>({
    name: '',
    email: '',
    phone: '',
    phoneCountry: 'IN',
    dialCode: '+91',
    phoneE164: '',
    brand: '',
    service: '',
    _hp: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [serverError, setServerError] = useState('');

  const submitLabel =
    site.forms.submit[placement] ||
    (placement === 'about'
      ? site.forms.submit.about
      : placement === 'contact'
      ? site.forms.submit.contact
      : site.forms.submit.footer);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  };

  const handlePhoneChange = (data: { country: string; dialCode: string; nationalNumber: string; e164: string; isValid: boolean }) => {
    setFormData((prev) => ({
      ...prev,
      phone: data.nationalNumber,
      phoneCountry: data.country,
      dialCode: data.dialCode,
      phoneE164: data.e164,
    }));
    if (errors.phone) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next.phone;
        return next;
      });
    }
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};

    fields.forEach((field) => {
      const val = (formData[field.id] || '').trim();
      if (field.required && !val) {
        newErrors[field.id] = site.forms.validation.required;
      } else if (field.id === 'email' && val) {
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) {
          newErrors.email = site.forms.validation.email;
        }
      } else if (field.id === 'phone' && val) {
        const fullPhone = formData.phoneE164 || `${formData.dialCode || '+91'}${val.replace(/\D/g, '')}`;
        try {
          if (!isValidPhoneNumber(fullPhone)) {
            newErrors.phone = site.forms.validation.phone;
          }
        } catch {
          newErrors.phone = site.forms.validation.phone;
        }
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError('');

    if (!validate()) return;

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          fieldSet,
          source: placement,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        if (data.fieldErrors) {
          setErrors(data.fieldErrors);
        }
        setServerError(data.error || site.forms.error);
        setIsSubmitting(false);
        return;
      }

      setIsSuccess(true);
      setFormData({
        name: '',
        email: '',
        phone: '',
        phoneCountry: 'IN',
        dialCode: '+91',
        phoneE164: '',
        brand: '',
        service: '',
        _hp: '',
      });
    } catch {
      setServerError(site.forms.error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className={`p-6 rounded-2xl bg-[#151515] border border-white/10 text-white ${className}`}>
        <h3 className="font-tanker text-3xl md:text-4xl uppercase tracking-wide text-white mb-3">
          {site.forms.success.title}
        </h3>
        <p className="font-mono text-sm text-white/70 leading-relaxed mb-6">
          {site.forms.success.text}
        </p>
        <button
          type="button"
          onClick={() => setIsSuccess(false)}
          className="btn"
        >
          SEND ANOTHER MESSAGE
        </button>
      </div>
    );
  }

  const rowContactFields = fields.filter((f) => f.row === 'contact');
  const otherFieldsBeforeRow = fields.filter((f) => !f.row && f.id === 'name');
  const otherFieldsAfterRow = fields.filter((f) => !f.row && f.id !== 'name');

  return (
    <form onSubmit={handleSubmit} className={`flex flex-col gap-4 text-white ${className}`} noValidate>
      {/* Honeypot field for bot protection */}
      <input
        type="text"
        name="_hp"
        value={formData._hp}
        onChange={handleChange}
        style={{ display: 'none' }}
        tabIndex={-1}
        autoComplete="off"
      />

      {/* Name */}
      {otherFieldsBeforeRow.map((field) => (
        <div key={field.id} className="flex flex-col gap-1.5">
          <label htmlFor={`form-${placement}-${field.id}`} className="font-mono text-[11px] uppercase tracking-wider text-white/70 flex justify-between">
            <span>{field.label}</span>
            <span className="text-[10px] text-white/40">
              {field.required ? site.forms.labels.required : site.forms.labels.optional}
            </span>
          </label>
          <input
            id={`form-${placement}-${field.id}`}
            type={field.type}
            name={field.id}
            value={formData[field.id] || ''}
            onChange={handleChange}
            placeholder={field.placeholder}
            className={`w-full min-h-[52px] px-4 rounded-lg bg-[#151515] border font-mono text-sm text-white placeholder-white/30 focus:outline-none focus:border-white transition-colors ${
              errors[field.id] ? 'border-red-400' : 'border-white/20 hover:border-white/40'
            }`}
          />
          {errors[field.id] && (
            <span className="font-mono text-[11px] text-red-400">{errors[field.id]}</span>
          )}
        </div>
      ))}

      {/* Contact Row (Email + Phone) */}
      {rowContactFields.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {rowContactFields.map((field) => (
            <div key={field.id} className="flex flex-col gap-1.5">
              <label htmlFor={`form-${placement}-${field.id}`} className="font-mono text-[11px] uppercase tracking-wider text-white/70 flex justify-between">
                <span>{field.label}</span>
                <span className="text-[10px] text-white/40">
                  {field.required ? site.forms.labels.required : site.forms.labels.optional}
                </span>
              </label>

              {field.id === 'phone' || field.type === 'tel' ? (
                <PhoneInput
                  id={`form-${placement}-${field.id}`}
                  name={field.id}
                  placeholder={field.placeholder || '89396 51621'}
                  required={field.required}
                  value={formData.phone}
                  onChange={handlePhoneChange}
                  className={`rounded-lg ${errors[field.id] ? '!border-red-400' : ''}`}
                />
              ) : (
                <input
                  id={`form-${placement}-${field.id}`}
                  type={field.type}
                  name={field.id}
                  value={formData[field.id] || ''}
                  onChange={handleChange}
                  placeholder={field.placeholder}
                  className={`w-full min-h-[52px] px-4 rounded-lg bg-[#151515] border font-mono text-sm text-white placeholder-white/30 focus:outline-none focus:border-white transition-colors ${
                    errors[field.id] ? 'border-red-400' : 'border-white/20 hover:border-white/40'
                  }`}
                />
              )}

              {errors[field.id] && (
                <span className="font-mono text-[11px] text-red-400">{errors[field.id]}</span>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Other Fields (Brand / Service) */}
      {otherFieldsAfterRow.map((field) => (
        <div key={field.id} className="flex flex-col gap-1.5">
          <label htmlFor={`form-${placement}-${field.id}`} className="font-mono text-[11px] uppercase tracking-wider text-white/70 flex justify-between">
            <span>{field.label}</span>
            <span className="text-[10px] text-white/40">
              {field.required ? site.forms.labels.required : site.forms.labels.optional}
            </span>
          </label>
          {field.type === 'select' ? (
            <select
              id={`form-${placement}-${field.id}`}
              name={field.id}
              value={formData[field.id] || ''}
              onChange={handleChange}
              className={`w-full min-h-[52px] px-4 rounded-lg bg-[#151515] border font-mono text-sm text-white focus:outline-none focus:border-white transition-colors cursor-pointer ${
                errors[field.id] ? 'border-red-400' : 'border-white/20 hover:border-white/40'
              }`}
            >
              <option value="" disabled className="bg-[#1a1a1a] text-white/50">
                {field.placeholder || 'Choose a service'}
              </option>
              {serviceOptions.map((opt) => (
                <option key={opt} value={opt} className="bg-[#1a1a1a] text-white">
                  {opt}
                </option>
              ))}
            </select>
          ) : (
            <input
              id={`form-${placement}-${field.id}`}
              type={field.type}
              name={field.id}
              value={formData[field.id] || ''}
              onChange={handleChange}
              placeholder={field.placeholder}
              className={`w-full min-h-[52px] px-4 rounded-lg bg-[#151515] border font-mono text-sm text-white placeholder-white/30 focus:outline-none focus:border-white transition-colors ${
                errors[field.id] ? 'border-red-400' : 'border-white/20 hover:border-white/40'
              }`}
            />
          )}
          {errors[field.id] && (
            <span className="font-mono text-[11px] text-red-400">{errors[field.id]}</span>
          )}
        </div>
      ))}

      {serverError && (
        <div className="p-3 rounded bg-red-950/50 border border-red-500/50 text-red-200 font-mono text-xs">
          {serverError}
        </div>
      )}

      {/* Global styled submit button */}
      <Button
        type="submit"
        disabled={isSubmitting}
        className={`w-full !h-[52px] mt-2 ${submitButtonClassName}`}
      >
        {isSubmitting ? site.forms.submit.sending : submitLabel}
      </Button>
    </form>
  );
}
