'use client';

import Image from 'next/image';

type JsiLogoProps = {
  /** Full logo with tagline, or circular emblem only */
  variant?: 'full' | 'icon';
  className?: string;
  alt?: string;
  priority?: boolean;
};

export default function JsiLogo({
  variant = 'full',
  className = '',
  alt = 'Japanese Super Immersion',
  priority = false,
}: JsiLogoProps) {
  if (variant === 'icon') {
    return (
      <span className={`inline-flex items-center flex-shrink-0 ${className}`}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/jsi-logo-icon.png"
          alt={alt}
          className="h-full w-auto max-w-[5.25rem] object-contain object-left"
          decoding="async"
        />
      </span>
    );
  }

  return (
    <span className={`inline-block flex-shrink-0 ${className}`}>
      <Image
        src="/jsi-logo.png"
        alt={alt}
        width={915}
        height={681}
        priority={priority}
        className="h-full w-full object-contain object-center"
      />
    </span>
  );
}
