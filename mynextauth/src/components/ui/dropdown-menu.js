// src/components/ui/dropdown-menu.js

import React from 'react';

// DropdownMenu components
export const DropdownMenu = ({ children }) => (
  <div className="dropdown-menu">{children}</div>
);

export const DropdownMenuTrigger = ({ children, ...props }) => (
  <span {...props} className="dropdown-menu-trigger">
    {children}
  </span>
);

export const DropdownMenuContent = ({ children }) => (
  <div className="dropdown-menu-content">{children}</div>
);

export const DropdownMenuItem = ({ children }) => (
  <div className="dropdown-menu-item">{children}</div>
);

export const DropdownMenuCheckboxItem = ({ children }) => (
  <div className="dropdown-menu-checkbox-item">{children}</div>
);

export const DropdownMenuRadioItem = ({ children }) => (
  <div className="dropdown-menu-radio-item">{children}</div>
);

export const DropdownMenuLabel = ({ children }) => (
  <div className="dropdown-menu-label">{children}</div>
);

export const DropdownMenuSeparator = () => <div className="dropdown-menu-separator" />;
