/**
 * Inline SVG icons.
 *
 * The original markup used FontAwesome class names without ever loading the
 * library, so nothing rendered. These need no network request and inherit
 * `currentColor`, so they follow the theme.
 */

const base = {
    width: 20,
    height: 20,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.6,
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
    'aria-hidden': true,
    focusable: false
};

export const MenuIcon = (props) => (
    <svg {...base} {...props}>
        <path d="M4 7h16M4 12h16M4 17h16" />
    </svg>
);

export const CloseIcon = (props) => (
    <svg {...base} {...props}>
        <path d="M6 6l12 12M18 6L6 18" />
    </svg>
);

export const BagIcon = (props) => (
    <svg {...base} {...props}>
        <path d="M6 8h12l-1 12H7L6 8Z" />
        <path d="M9 8V6a3 3 0 0 1 6 0v2" />
    </svg>
);

export const UserIcon = (props) => (
    <svg {...base} width={16} height={16} {...props}>
        <circle cx="12" cy="8" r="3.2" />
        <path d="M5 20c.9-3.4 3.5-5 7-5s6.1 1.6 7 5" />
    </svg>
);

export const TrashIcon = (props) => (
    <svg {...base} width={16} height={16} {...props}>
        <path d="M4 7h16M10 7V5h4v2M6 7l1 13h10l1-13" />
    </svg>
);

export const EditIcon = (props) => (
    <svg {...base} width={16} height={16} {...props}>
        <path d="M4 20h4L19 9a2.1 2.1 0 0 0-3-3L5 17v3Z" />
    </svg>
);

export const PlusIcon = (props) => (
    <svg {...base} width={16} height={16} {...props}>
        <path d="M12 5v14M5 12h14" />
    </svg>
);

export const MinusIcon = (props) => (
    <svg {...base} width={16} height={16} {...props}>
        <path d="M5 12h14" />
    </svg>
);

export const CheckIcon = (props) => (
    <svg {...base} {...props}>
        <path d="M5 13l4 4L19 7" />
    </svg>
);

export const AlertIcon = (props) => (
    <svg {...base} {...props}>
        <circle cx="12" cy="12" r="8.5" />
        <path d="M12 8v5M12 16.2v.1" />
    </svg>
);

export const InfoIcon = (props) => (
    <svg {...base} {...props}>
        <circle cx="12" cy="12" r="8.5" />
        <path d="M12 11v5M12 7.8v.1" />
    </svg>
);

export const ArrowRightIcon = (props) => (
    <svg {...base} width={16} height={16} {...props}>
        <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
);

export const LockIcon = (props) => (
    <svg {...base} width={14} height={14} {...props}>
        <rect x="5" y="11" width="14" height="9" rx="2" />
        <path d="M8.5 11V8a3.5 3.5 0 0 1 7 0v3" />
    </svg>
);

export const SunIcon = (props) => (
    <svg {...base} width={18} height={18} {...props}>
        <circle cx="12" cy="12" r="4" />
        <path d="M12 3v2M12 19v2M5.6 5.6l1.4 1.4M17 17l1.4 1.4M3 12h2M19 12h2M5.6 18.4 7 17M17 7l1.4-1.4" />
    </svg>
);

export const MoonIcon = (props) => (
    <svg {...base} width={18} height={18} {...props}>
        <path d="M20 14.2A8.2 8.2 0 0 1 9.8 4a8.4 8.4 0 1 0 10.2 10.2Z" />
    </svg>
);
