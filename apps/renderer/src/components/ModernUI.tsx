import React from 'react';

interface ModernCardProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
  subtitle?: string;
  icon?: string;
  variant?: 'default' | 'gradient' | 'glass' | 'bordered';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  interactive?: boolean;
  loading?: boolean;
}

export const ModernCard: React.FC<ModernCardProps> = ({
  children,
  className = '',
  title,
  subtitle,
  icon,
  variant = 'default',
  size = 'md',
  interactive = false,
  loading = false
}) => {
  const baseClasses = "rounded-xl transition-all duration-300 ease-out";
  
  const variantClasses = {
    default: "bg-white shadow-lg border border-gray-100 hover:shadow-xl",
    gradient: "bg-gradient-to-br from-blue-50 via-white to-indigo-50 shadow-lg border border-blue-100 hover:shadow-xl hover:from-blue-100 hover:to-indigo-100",
    glass: "bg-white/80 backdrop-blur-sm shadow-2xl border border-white/20 hover:bg-white/90",
    bordered: "bg-white border-2 border-gray-200 hover:border-blue-300 hover:shadow-md"
  };

  const sizeClasses = {
    sm: "p-4",
    md: "p-6", 
    lg: "p-8",
    xl: "p-10"
  };

  const interactiveClasses = interactive 
    ? "cursor-pointer hover:scale-[1.02] active:scale-[0.98] hover:-translate-y-1" 
    : "";

  const loadingOverlay = loading && (
    <div className="absolute inset-0 bg-white/80 backdrop-blur-sm rounded-xl flex items-center justify-center z-10">
      <div className="flex items-center space-x-2">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="text-gray-600 font-medium">Laden...</span>
      </div>
    </div>
  );

  return (
    <div className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${interactiveClasses} ${className} relative`}>
      {loadingOverlay}
      
      {(title || subtitle || icon) && (
        <div className="mb-4 pb-4 border-b border-gray-100">
          <div className="flex items-start space-x-3">
            {icon && (
              <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <i className={`${icon} text-blue-600 text-lg`}></i>
              </div>
            )}
            <div className="flex-1 min-w-0">
              {title && (
                <h3 className="text-lg font-bold text-gray-900 mb-1">
                  {title}
                </h3>
              )}
              {subtitle && (
                <p className="text-sm text-gray-600 leading-relaxed">
                  {subtitle}
                </p>
              )}
            </div>
          </div>
        </div>
      )}
      
      <div className="relative z-0">
        {children}
      </div>
    </div>
  );
};

interface ModernButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  disabled?: boolean;
  loading?: boolean;
  icon?: string;
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
  className?: string;
}

export const ModernButton: React.FC<ModernButtonProps> = ({
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  icon,
  iconPosition = 'left',
  fullWidth = false,
  className = ''
}) => {
  const baseClasses = "relative inline-flex items-center justify-center font-semibold rounded-lg transition-all duration-200 ease-out focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";

  const variantClasses = {
    primary: "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg hover:from-blue-700 hover:to-indigo-700 hover:shadow-xl hover:-translate-y-0.5 focus:ring-blue-500 active:scale-95",
    secondary: "bg-gray-100 text-gray-900 hover:bg-gray-200 hover:shadow-md focus:ring-gray-500",
    success: "bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg hover:from-green-600 hover:to-emerald-600 hover:shadow-xl hover:-translate-y-0.5 focus:ring-green-500 active:scale-95",
    danger: "bg-gradient-to-r from-red-500 to-rose-500 text-white shadow-lg hover:from-red-600 hover:to-rose-600 hover:shadow-xl hover:-translate-y-0.5 focus:ring-red-500 active:scale-95",
    warning: "bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg hover:from-amber-600 hover:to-orange-600 hover:shadow-xl hover:-translate-y-0.5 focus:ring-amber-500 active:scale-95",
    outline: "border-2 border-blue-500 text-blue-600 hover:bg-blue-50 focus:ring-blue-500",
    ghost: "text-gray-600 hover:bg-gray-100 hover:text-gray-900 focus:ring-gray-500"
  };

  const sizeClasses = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-base",
    lg: "px-6 py-3 text-lg",
    xl: "px-8 py-4 text-xl"
  };

  const widthClasses = fullWidth ? "w-full" : "";

  const iconElement = icon && (
    <i className={`${icon} ${children ? (iconPosition === 'left' ? 'mr-2' : 'ml-2') : ''}`}></i>
  );

  const loadingSpinner = loading && (
    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2"></div>
  );

  return (
    <button
      onClick={onClick}
      disabled={disabled || loading}
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${widthClasses} ${className}`}
    >
      {loading && loadingSpinner}
      {icon && iconPosition === 'left' && iconElement}
      {children}
      {icon && iconPosition === 'right' && iconElement}
    </button>
  );
};

interface ModernInputProps {
  label?: string;
  placeholder?: string;
  value: string | number;
  onChange: (value: string) => void;
  type?: 'text' | 'email' | 'number' | 'password' | 'tel' | 'url';
  disabled?: boolean;
  error?: string;
  icon?: string;
  iconPosition?: 'left' | 'right';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  className?: string;
}

export const ModernInput: React.FC<ModernInputProps> = ({
  label,
  placeholder,
  value,
  onChange,
  type = 'text',
  disabled = false,
  error,
  icon,
  iconPosition = 'left',
  size = 'md',
  fullWidth = false,
  className = ''
}) => {
  const inputId = `input-${Math.random().toString(36).substr(2, 9)}`;

  const baseClasses = "border rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 disabled:cursor-not-allowed";
  
  const sizeClasses = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-base",
    lg: "px-5 py-3 text-lg"
  };

  const errorClasses = error 
    ? "border-red-300 focus:border-red-500 focus:ring-red-500" 
    : "border-gray-300 hover:border-gray-400";

  const iconClasses = icon ? (iconPosition === 'left' ? 'pl-10' : 'pr-10') : '';
  const widthClasses = fullWidth ? "w-full" : "";

  return (
    <div className={`${fullWidth ? 'w-full' : ''} ${className}`}>
      {label && (
        <label htmlFor={inputId} className="block text-sm font-semibold text-gray-700 mb-2">
          {label}
        </label>
      )}
      
      <div className="relative">
        {icon && (
          <div className={`absolute inset-y-0 ${iconPosition === 'left' ? 'left-0 pl-3' : 'right-0 pr-3'} flex items-center pointer-events-none`}>
            <i className={`${icon} text-gray-400`}></i>
          </div>
        )}
        
        <input
          id={inputId}
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          disabled={disabled}
          className={`${baseClasses} ${sizeClasses[size]} ${errorClasses} ${iconClasses} ${widthClasses}`}
        />
      </div>
      
      {error && (
        <p className="mt-1 text-sm text-red-600 flex items-center">
          <i className="pi pi-exclamation-triangle mr-1"></i>
          {error}
        </p>
      )}
    </div>
  );
};

interface ModernSelectProps {
  label?: string;
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
  placeholder?: string;
  disabled?: boolean;
  error?: string;
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  className?: string;
}

export const ModernSelect: React.FC<ModernSelectProps> = ({
  label,
  value,
  onChange,
  options,
  placeholder = "Bitte wählen...",
  disabled = false,
  error,
  size = 'md',
  fullWidth = false,
  className = ''
}) => {
  const selectId = `select-${Math.random().toString(36).substr(2, 9)}`;

  const baseClasses = "border rounded-lg bg-white transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 disabled:cursor-not-allowed";
  
  const sizeClasses = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-base", 
    lg: "px-5 py-3 text-lg"
  };

  const errorClasses = error 
    ? "border-red-300 focus:border-red-500 focus:ring-red-500" 
    : "border-gray-300 hover:border-gray-400";

  const widthClasses = fullWidth ? "w-full" : "";

  return (
    <div className={`${fullWidth ? 'w-full' : ''} ${className}`}>
      {label && (
        <label htmlFor={selectId} className="block text-sm font-semibold text-gray-700 mb-2">
          {label}
        </label>
      )}
      
      <select
        id={selectId}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        className={`${baseClasses} ${sizeClasses[size]} ${errorClasses} ${widthClasses}`}
      >
        <option value="">{placeholder}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      
      {error && (
        <p className="mt-1 text-sm text-red-600 flex items-center">
          <i className="pi pi-exclamation-triangle mr-1"></i>
          {error}
        </p>
      )}
    </div>
  );
};

export default { ModernCard, ModernButton, ModernInput, ModernSelect };
