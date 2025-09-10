import React from 'react';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { ProgressBar } from 'primereact/progressbar';
import { Skeleton } from 'primereact/skeleton';
import { Badge } from 'primereact/badge';
import { Panel } from 'primereact/panel';
import { Message } from 'primereact/message';
import 'primeicons/primeicons.css';
import 'primereact/resources/themes/lara-light-blue/theme.css';
import 'primereact/resources/primereact.min.css';

// ModernCard mit PrimeReact Card als Basis
interface ModernCardProps {
  children: React.ReactNode;
  variant?: 'default' | 'elevated' | 'outlined' | 'subtle';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  title?: string;
  subtitle?: string;
  header?: React.ReactNode;
  footer?: React.ReactNode;
  loading?: boolean;
  hoverable?: boolean;
}

export const ModernCard: React.FC<ModernCardProps> = ({
  children,
  variant = 'default',
  size = 'md',
  className = '',
  title,
  subtitle,
  header,
  footer,
  loading = false,
  hoverable = true
}) => {
  const getCardClassName = () => {
    let classes = 'modern-card';
    
    if (hoverable) {
      classes += ' transition-all duration-300 hover:shadow-4';
    }
    
    switch (variant) {
      case 'elevated':
        classes += ' shadow-4';
        break;
      case 'outlined':
        classes += ' surface-border border-1';
        break;
      case 'subtle':
        classes += ' surface-50';
        break;
      default:
        classes += ' surface-card';
    }

    switch (size) {
      case 'sm':
        classes += ' p-2';
        break;
      case 'lg':
        classes += ' p-4';
        break;
      default:
        classes += ' p-3';
    }

    return `${classes} ${className}`;
  };

  if (loading) {
    return (
      <Card className={getCardClassName()}>
        <div className="space-y-2">
          <Skeleton width="100%" height="2rem" />
          <Skeleton width="80%" height="1rem" />
          <Skeleton width="60%" height="1rem" />
        </div>
      </Card>
    );
  }

  return (
    <Card
      title={title}
      subTitle={subtitle}
      header={header}
      footer={footer}
      className={getCardClassName()}
    >
      {children}
    </Card>
  );
};

// ModernButton mit PrimeReact Button als Basis
interface ModernButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'success' | 'info' | 'warning' | 'help' | 'danger';
  size?: 'small' | 'large';
  severity?: 'secondary' | 'success' | 'info' | 'warning' | 'help' | 'danger';
  outlined?: boolean;
  text?: boolean;
  raised?: boolean;
  rounded?: boolean;
  icon?: string;
  iconPos?: 'left' | 'right' | 'top' | 'bottom';
  loading?: boolean;
  disabled?: boolean;
  className?: string;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
}

export const ModernButton: React.FC<ModernButtonProps> = ({
  children,
  variant = 'primary',
  size,
  severity,
  outlined = false,
  text = false,
  raised = false,
  rounded = false,
  icon,
  iconPos = 'left',
  loading = false,
  disabled = false,
  className = '',
  onClick,
  type = 'button'
}) => {
  return (
    <Button
      label={typeof children === 'string' ? children : undefined}
      severity={severity || (variant !== 'primary' ? variant as any : undefined)}
      size={size}
      outlined={outlined}
      text={text}
      raised={raised}
      rounded={rounded}
      icon={icon}
      iconPos={iconPos}
      loading={loading}
      disabled={disabled}
      className={`modern-button ${className}`}
      onClick={onClick}
      type={type}
    >
      {typeof children !== 'string' ? children : undefined}
    </Button>
  );
};

// ModernInput mit PrimeReact InputText als Basis
interface ModernInputProps {
  value?: string;
  placeholder?: string;
  type?: 'text' | 'password' | 'email' | 'number' | 'tel' | 'url';
  size?: 'small' | 'large';
  disabled?: boolean;
  invalid?: boolean;
  className?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  onFocus?: (e: React.FocusEvent<HTMLInputElement>) => void;
  label?: string;
  helpText?: string;
  errorText?: string;
  icon?: string;
  iconPosition?: 'left' | 'right';
}

export const ModernInput: React.FC<ModernInputProps> = ({
  value,
  placeholder,
  type = 'text',
  size,
  disabled = false,
  invalid = false,
  className = '',
  onChange,
  onBlur,
  onFocus,
  label,
  helpText,
  errorText,
  icon,
  iconPosition = 'left'
}) => {
  const inputId = React.useId();
  
  const InputComponent = (
    <InputText
      id={inputId}
      value={value}
      placeholder={placeholder}
      type={type}
      size={size}
      disabled={disabled}
      invalid={invalid || !!errorText}
      className={`modern-input w-full ${className}`}
      onChange={onChange}
      onBlur={onBlur}
      onFocus={onFocus}
    />
  );

  return (
    <div className="field">
      {label && (
        <label htmlFor={inputId} className="block text-900 font-medium mb-2">
          {label}
        </label>
      )}
      
      {icon ? (
        <div className={`p-inputgroup ${iconPosition === 'right' ? 'flex-row-reverse' : ''}`}>
          <span className="p-inputgroup-addon">
            <i className={icon}></i>
          </span>
          {InputComponent}
        </div>
      ) : (
        InputComponent
      )}
      
      {helpText && !errorText && (
        <small className="block text-600 mt-1">{helpText}</small>
      )}
      
      {errorText && (
        <small className="block text-red-500 mt-1">{errorText}</small>
      )}
    </div>
  );
};

// ModernSelect mit PrimeReact Dropdown als Basis
interface ModernSelectOption {
  label: string;
  value: any;
  icon?: string;
  disabled?: boolean;
}

interface ModernSelectProps {
  value?: any;
  options: ModernSelectOption[];
  placeholder?: string;
  disabled?: boolean;
  filter?: boolean;
  showClear?: boolean;
  invalid?: boolean;
  className?: string;
  onChange?: (e: { value: any }) => void;
  label?: string;
  helpText?: string;
  errorText?: string;
  emptyMessage?: string;
  loading?: boolean;
}

export const ModernSelect: React.FC<ModernSelectProps> = ({
  value,
  options,
  placeholder = 'Bitte wählen...',
  disabled = false,
  filter = false,
  showClear = true,
  invalid = false,
  className = '',
  onChange,
  label,
  helpText,
  errorText,
  emptyMessage = 'Keine Optionen verfügbar',
  loading = false
}) => {
  const selectId = React.useId();

  return (
    <div className="field">
      {label && (
        <label htmlFor={selectId} className="block text-900 font-medium mb-2">
          {label}
        </label>
      )}
      
      <Dropdown
        inputId={selectId}
        value={value}
        options={options}
        optionLabel="label"
        optionValue="value"
        placeholder={placeholder}
        disabled={disabled}
        filter={filter}
        showClear={showClear}
        invalid={invalid || !!errorText}
        className={`modern-select w-full ${className}`}
        onChange={onChange}
        emptyMessage={emptyMessage}
        loading={loading}
      />
      
      {helpText && !errorText && (
        <small className="block text-600 mt-1">{helpText}</small>
      )}
      
      {errorText && (
        <small className="block text-red-500 mt-1">{errorText}</small>
      )}
    </div>
  );
};

// CSS Styles für die Komponenten
export const modernUIStyles = `
.modern-card {
  border-radius: 0.75rem;
  overflow: hidden;
}

.modern-button {
  border-radius: 0.5rem;
  font-weight: 500;
  transition: all 0.2s ease;
}

.modern-input {
  border-radius: 0.5rem;
}

.modern-select {
  border-radius: 0.5rem;
}

/* Hover-Effekte */
.modern-card:hover {
  transform: translateY(-2px);
}

.modern-button:not(:disabled):hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}
`;

// Style-Tag für die Komponenten
if (typeof document !== 'undefined' && !document.getElementById('modern-ui-styles')) {
  const styleElement = document.createElement('style');
  styleElement.id = 'modern-ui-styles';
  styleElement.textContent = modernUIStyles;
  document.head.appendChild(styleElement);
}
