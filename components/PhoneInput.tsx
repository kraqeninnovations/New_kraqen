'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  CountryCode,
  getCountries,
  getCountryCallingCode,
  isValidPhoneNumber,
  parsePhoneNumberFromString,
} from 'libphonenumber-js';

// Popular countries prioritized at top
const POPULAR_COUNTRIES: CountryCode[] = ['IN', 'US', 'GB', 'AE', 'SG', 'AU', 'CA', 'DE', 'MY', 'SA'];

interface PhoneData {
  country: CountryCode;
  dialCode: string;
  nationalNumber: string;
  e164: string;
  isValid: boolean;
}

interface PhoneInputProps {
  id?: string;
  name?: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
  value?: string;
  onChange?: (data: PhoneData) => void;
  onRawChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function PhoneInput({
  id = 'phone',
  name = 'phone',
  placeholder = '89396 51621',
  required = false,
  disabled = false,
  className = '',
  value = '',
  onChange,
  onRawChange,
}: PhoneInputProps) {
  const [country, setCountry] = useState<CountryCode>('IN');
  const [dialCode, setDialCode] = useState<string>('+91');
  const [nationalNumber, setNationalNumber] = useState<string>(value);
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Build sorted country list with popular on top
  const allCountries = getCountries();
  const restCountries = allCountries.filter((c) => !POPULAR_COUNTRIES.includes(c));
  const countryList: CountryCode[] = [...POPULAR_COUNTRIES, ...restCountries];

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleCountrySelect = (newCountry: CountryCode) => {
    setCountry(newCountry);
    const code = `+${getCountryCallingCode(newCountry)}`;
    setDialCode(code);
    setIsOpen(false);
    setSearch('');
    updatePhone(newCountry, code, nationalNumber);
  };

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/[^\d\s-]/g, '');
    setNationalNumber(val);
    updatePhone(country, dialCode, val);
    if (onRawChange) {
      onRawChange(e);
    }
  };

  const updatePhone = (c: CountryCode, code: string, number: string) => {
    const cleanNum = number.replace(/\D/g, '');
    const full = `${code}${cleanNum}`;
    let valid = false;
    let e164 = full;

    try {
      if (cleanNum.length > 3) {
        valid = isValidPhoneNumber(full, c);
        const parsed = parsePhoneNumberFromString(full, c);
        if (parsed) {
          e164 = parsed.number;
          valid = parsed.isValid();
        }
      }
    } catch {
      valid = false;
    }

    if (onChange) {
      onChange({
        country: c,
        dialCode: code,
        nationalNumber: number,
        e164,
        isValid: valid,
      });
    }
  };

  const filteredCountries = countryList.filter((c) => {
    const code = getCountryCallingCode(c);
    const q = search.toLowerCase();
    return c.toLowerCase().includes(q) || code.includes(q);
  });

  return (
    <div className={`relative flex items-center h-[52px] bg-[#151515] border border-[rgba(255,255,255,0.18)] focus-within:border-white transition-colors duration-200 ${className}`}>
      {/* Hidden inputs for form submissions */}
      <input type="hidden" name="phoneCountry" value={country} />
      <input type="hidden" name="dialCode" value={dialCode} />
      <input type="hidden" name="phoneE164" value={`${dialCode}${nationalNumber.replace(/\D/g, '')}`} />

      {/* Country Select Button */}
      <div ref={dropdownRef} className="relative h-full shrink-0">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          disabled={disabled}
          className="h-full px-3.5 flex items-center gap-2 border-r border-[rgba(255,255,255,0.14)] hover:bg-[rgba(255,255,255,0.05)] transition-colors text-white font-mono text-[12px] tracking-wider outline-none cursor-pointer"
          aria-label={`Select country code, currently ${country} ${dialCode}`}
        >
          <span className="font-bold">{country}</span>
          <span className="text-[var(--text-muted)]">{dialCode}</span>
          <svg
            className={`w-3 h-3 text-[var(--text-muted)] transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </button>

        {/* Dropdown Menu */}
        {isOpen && (
          <div className="absolute top-[calc(100%+4px)] left-0 z-50 w-64 max-h-64 overflow-y-auto bg-[#1c1c1c] border border-[rgba(255,255,255,0.2)] shadow-2xl py-2">
            <div className="px-3 pb-2 border-b border-[rgba(255,255,255,0.1)]">
              <input
                type="text"
                placeholder="Search country / code..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                autoFocus
                className="w-full bg-[#111] text-white text-[11px] font-mono px-2 py-1.5 border border-[rgba(255,255,255,0.15)] outline-none focus:border-white"
              />
            </div>
            <div className="py-1">
              {filteredCountries.map((c) => {
                const code = `+${getCountryCallingCode(c)}`;
                const isSelected = c === country;
                return (
                  <button
                    key={c}
                    type="button"
                    onClick={() => handleCountrySelect(c)}
                    className={`w-full px-3 py-2 flex items-center justify-between text-left text-[11px] font-mono hover:bg-[rgba(255,255,255,0.08)] transition-colors cursor-pointer ${
                      isSelected ? 'text-white bg-[rgba(255,255,255,0.1)] font-bold' : 'text-[rgba(255,255,255,0.7)]'
                    }`}
                  >
                    <span>{c}</span>
                    <span className="text-[var(--text-muted)]">{code}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Number Input */}
      <input
        id={id}
        name={name}
        type="tel"
        inputMode="tel"
        autoComplete="tel-national"
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        value={nationalNumber}
        onChange={handleNumberChange}
        className="w-full h-full px-4 bg-transparent text-white font-mono text-[13px] placeholder:text-[var(--text-muted)] outline-none border-none"
      />
    </div>
  );
}

