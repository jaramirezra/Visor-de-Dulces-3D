import type { SVGProps } from 'react'

type IconProps = SVGProps<SVGSVGElement>

const stroke = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.8,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
}

export function CandyMark(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...props}>
      <path
        d="M7 8.2h10l2.4-1.7v11l-2.4-1.7H7l-2.4 1.7v-11z"
        fill="currentColor"
        opacity=".92"
      />
      <path d="M5.2 7.2L3.6 6v12l1.6-1.2M18.8 7.2L20.4 6v12l-1.6-1.2" fill="currentColor" />
      <path
        d="M12 9.2l.8 1.7 1.9.3-1.4 1.3.4 1.9-1.7-.9-1.7.9.4-1.9-1.4-1.3 1.9-.3z"
        fill="#2a1a12"
      />
    </svg>
  )
}

export function DownloadIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...stroke} {...props}>
      <path d="M12 3.5v11" />
      <path d="M7.5 10l4.5 4.5 4.5-4.5" />
      <path d="M4.5 19.5h15" />
    </svg>
  )
}

export function ResetIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...stroke} {...props}>
      <path d="M4 5v5h5" />
      <path d="M4.7 10a7.8 7.8 0 1 1-1 6.4" />
    </svg>
  )
}

export function OrbitIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...stroke} {...props}>
      <ellipse cx="12" cy="12" rx="9" ry="4.2" transform="rotate(-24 12 12)" />
      <circle cx="12" cy="12" r="2.2" fill="currentColor" stroke="none" />
    </svg>
  )
}

export function FrontIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...stroke} {...props}>
      <rect x="5" y="6" width="14" height="12" rx="3.2" />
      <circle cx="12" cy="12" r="2.2" fill="currentColor" stroke="none" />
    </svg>
  )
}

export function QuarterIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...stroke} {...props}>
      <path d="M12 3.2l8 4.4v8.8l-8 4.4-8-4.4V7.6z" />
      <path d="M4 7.6l8 4.4 8-4.4M12 12v8.8" />
    </svg>
  )
}

export function TopIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...stroke} {...props}>
      <path d="M4 9l8-5 8 5-8 5z" />
      <path d="M4 14l8 5 8-5" opacity=".55" />
    </svg>
  )
}

export function PlayIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...props}>
      <path d="M8.5 5.8a1 1 0 0 1 1.5-.9l8 6.2a1 1 0 0 1 0 1.8l-8 6.2a1 1 0 0 1-1.5-.9z" fill="currentColor" />
    </svg>
  )
}

export function PauseIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...props}>
      <rect x="7" y="5" width="3.5" height="14" rx="1.4" fill="currentColor" />
      <rect x="13.5" y="5" width="3.5" height="14" rx="1.4" fill="currentColor" />
    </svg>
  )
}

export function PaletteIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...stroke} {...props}>
      <path d="M12 3a9 9 0 1 0 .2 18h1.1a2 2 0 0 0 1.5-3.3 1.8 1.8 0 0 1 1.4-3h1.9A3 3 0 0 0 21 11.7 8.9 8.9 0 0 0 12 3Z" />
      <circle cx="7.6" cy="10" r="1" fill="currentColor" stroke="none" />
      <circle cx="10" cy="6.8" r="1" fill="currentColor" stroke="none" />
      <circle cx="14.2" cy="6.4" r="1" fill="currentColor" stroke="none" />
      <circle cx="17.2" cy="9.2" r="1" fill="currentColor" stroke="none" />
    </svg>
  )
}

export function PatternIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...props}>
      <circle cx="6.5" cy="7" r="1.8" fill="currentColor" />
      <path d="M16.8 4.8l.9 2.1 2.1.9-2.1.9-.9 2.1-.9-2.1-2.1-.9 2.1-.9z" fill="currentColor" />
      <path d="M6.5 13.2l.8 1.9 1.9.8-1.9.8-.8 1.9-.8-1.9-1.9-.8 1.9-.8z" fill="currentColor" />
      <circle cx="17" cy="16.5" r="1.8" fill="currentColor" />
      <circle cx="17" cy="16.5" r="1.8" fill="none" stroke="currentColor" strokeWidth=".6" />
    </svg>
  )
}

export function ImageIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...stroke} {...props}>
      <rect x="3.5" y="4.5" width="17" height="15" rx="3" />
      <circle cx="8.7" cy="9.5" r="1.7" />
      <path d="M4.5 17l5-5 4 4 3-3 4 4" />
    </svg>
  )
}

export function SparkleIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...stroke} {...props}>
      <path d="M11 3l1.8 5.2L18 10l-5.2 1.8L11 17l-1.8-5.2L4 10l5.2-1.8z" />
      <path d="M19 15l.8 2.2L22 18l-2.2.8L19 21l-.8-2.2L16 18l2.2-.8z" />
    </svg>
  )
}

export function UploadIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...stroke} {...props}>
      <path d="M4 16v3a1.5 1.5 0 0 0 1.5 1.5h13A1.5 1.5 0 0 0 20 19v-3" />
      <path d="M12 4v10" />
      <path d="M7.5 8.5L12 4l4.5 4.5" />
    </svg>
  )
}

export function TrashIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...stroke} {...props}>
      <path d="M4 7h16M9 7V4.5h6V7M6.5 7l.8 12.2a1.5 1.5 0 0 0 1.5 1.3h6.4a1.5 1.5 0 0 0 1.5-1.3L17.5 7" />
      <path d="M10 10.5v6M14 10.5v6" opacity=".55" />
    </svg>
  )
}

export function CheckIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...stroke} {...props}>
      <path d="M5 12.5l4.5 4.5L19 7.5" />
    </svg>
  )
}

export function CloseIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...stroke} {...props}>
      <path d="M6 6l12 12M18 6L6 18" />
    </svg>
  )
}

export function InfoIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...stroke} {...props}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 10.8v5.4" />
      <circle cx="12" cy="7.8" r=".9" fill="currentColor" stroke="none" />
    </svg>
  )
}

export function SpinnerIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...stroke} {...props}>
      <path d="M21 12a9 9 0 1 1-6.2-8.6" />
    </svg>
  )
}

export function HeartIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...props}>
      <path
        d="M12 20.2c-1.7-1.1-8.4-5.5-8.4-11A4.6 4.6 0 0 1 12 6.7a4.6 4.6 0 0 1 8.4 2.5c0 5.5-6.7 9.9-8.4 11z"
        fill="currentColor"
      />
    </svg>
  )
}

export function StarIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...props}>
      <path d="M12 3.2l2.7 5.6 6.1.9-4.4 4.3 1 6.1-5.4-2.9-5.4 2.9 1-6.1-4.4-4.3 6.1-.9z" fill="currentColor" />
    </svg>
  )
}

export function DotIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...props}>
      <circle cx="12" cy="12" r="5.2" fill="currentColor" />
    </svg>
  )
}

export function StripeIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...props}>
      <rect x="3" y="5" width="4.2" height="14" rx="1.4" fill="currentColor" />
      <rect x="9.9" y="5" width="4.2" height="14" rx="1.4" fill="currentColor" />
      <rect x="16.8" y="5" width="4.2" height="14" rx="1.4" fill="currentColor" />
    </svg>
  )
}

export function ConfettiIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...props}>
      <path d="M7 4.5l1.2 2.8 2.8 1.2-2.8 1.2L7 12.5 5.8 9.7 3 8.5l2.8-1.2z" fill="currentColor" />
      <circle cx="16.5" cy="7" r="2" fill="currentColor" />
      <path d="M15.5 15.5l1 2.2 2.2 1-2.2 1-1 2.2-1-2.2-2.2-1 2.2-1z" fill="currentColor" />
      <circle cx="6.5" cy="18" r="1.6" fill="currentColor" />
    </svg>
  )
}

export function ShapePillow(props: IconProps) {
  return (
    <svg viewBox="0 0 64 44" aria-hidden="true" {...props}>
      <path
        d="M17 11h30c3 0 4 2 4 5v12c0 3-1 5-4 5H17c-3 0-4-2-4-5V16c0-3 1-5 4-5Z"
        fill="currentColor"
        opacity=".14"
      />
      <path
        d="M17 11h30c3 0 4 2 4 5v12c0 3-1 5-4 5H17c-3 0-4-2-4-5V16c0-3 1-5 4-5Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <path
        d="M14 12l-3 2 3 2-3 2 3 2-3 2 3 2-3 2 3 2-3 2 3 2M50 12l3 2-3 2 3 2-3 2 3 2-3 2 3 2-3 2 3 2-3 2"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinejoin="round"
      />
      <path d="M19 16c5-2 21-2 26 0M19 28c5 2 21 2 26 0" fill="none" stroke="currentColor" strokeWidth="1" opacity=".35" />
    </svg>
  )
}

export function ShapeLollipop(props: IconProps) {
  return (
    <svg viewBox="0 0 64 44" aria-hidden="true" {...props}>
      <rect x="23" y="5" width="18" height="19" rx="5.5" fill="currentColor" opacity=".14" />
      <rect x="23" y="5" width="18" height="19" rx="5.5" fill="none" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M23 7l-2.4 1.6 2.4 1.6-2.4 1.6 2.4 1.6-2.4 1.6 2.4 1.6-2.4 1.6 2.4 1.6M41 7l2.4 1.6-2.4 1.6 2.4 1.6-2.4 1.6 2.4 1.6-2.4 1.6 2.4 1.6-2.4 1.6"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinejoin="round"
      />
      <path d="M32 24v15" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

export function ShapeTwist(props: IconProps) {
  return (
    <svg viewBox="0 0 64 44" aria-hidden="true" {...props}>
      <rect x="24" y="14" width="16" height="16" rx="5" fill="currentColor" opacity=".14" />
      <rect x="24" y="14" width="16" height="16" rx="5" fill="none" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M24 19C20 18 16 15 11 11c5 0 9 2 13 7ZM24 25c-4 1-8 4-13 8 5 0 9-2 13-7Z"
        fill="currentColor"
        opacity=".14"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
      <path
        d="M40 19c4-1 8-4 13-8-5 0-9 2-13 7ZM40 25c4 1 8 4 13 8-5 0-9-2-13-7Z"
        fill="currentColor"
        opacity=".14"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
      <path d="M13 13l4 5M17 15l3 4M51 13l-4 5M47 15l-3 4" fill="none" stroke="currentColor" strokeWidth="1" opacity=".5" />
    </svg>
  )
}

export function ShapeOval(props: IconProps) {
  return (
    <svg viewBox="0 0 64 44" aria-hidden="true" {...props}>
      <ellipse cx="32" cy="22" rx="11" ry="8" fill="currentColor" opacity=".14" />
      <ellipse cx="32" cy="22" rx="11" ry="8" fill="none" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M21 18C17 17 13 14 9 11c5 0 9 2 13 7ZM21 26c-4 1-8 4-12 7 5 0 9-2 13-7Z"
        fill="currentColor"
        opacity=".14"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
      <path
        d="M43 18c4-1 8-4 12-7-5 0-9 2-13 7ZM43 26c4 1 8 4 12 7-5 0-9-2-13-7Z"
        fill="currentColor"
        opacity=".14"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function ShapeVertical(props: IconProps) {
  return (
    <svg viewBox="0 0 64 44" aria-hidden="true" {...props}>
      <path
        d="M21 20c0-5 5-8 11-8s11 3 11 8c3 5 3 12 0 17-3 4-7 5-11 5s-8-1-11-5c-3-5-3-12 0-17Z"
        fill="currentColor"
        opacity=".14"
      />
      <path
        d="M21 20c0-5 5-8 11-8s11 3 11 8c3 5 3 12 0 17-3 4-7 5-11 5s-8-1-11-5c-3-5-3-12 0-17Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <path
        d="M20 14C22 8 27 4 32 4s10 4 12 10c-4-2-8-3-12-3s-8 1-12 3Z"
        fill="currentColor"
        opacity=".14"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
      <path d="M26 12l2-6M32 11V4M38 12l-2-6" fill="none" stroke="currentColor" strokeWidth="1" opacity=".5" />
    </svg>
  )
}
