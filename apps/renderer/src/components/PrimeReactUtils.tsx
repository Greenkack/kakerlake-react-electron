import React from 'react';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { Badge } from 'primereact/badge';
import { Tag } from 'primereact/tag';
import { ProgressBar } from 'primereact/progressbar';
import { Skeleton } from 'primereact/skeleton';
import { Divider } from 'primereact/divider';
import { Message } from 'primereact/message';
import { InlineMessage } from 'primereact/inlinemessage';
import { Panel } from 'primereact/panel';
import { Avatar } from 'primereact/avatar';
import { Chip } from 'primereact/chip';
import { Toolbar } from 'primereact/toolbar';
import { Tooltip } from 'primereact/tooltip';

// Utility Types
type Severity = 'success' | 'info' | 'warn' | 'error' | undefined;
type Size = 'small' | 'normal' | 'large';

// Loading Card Component
interface LoadingCardProps {
  title?: string;
  lines?: number;
  height?: string;
}

export const LoadingCard: React.FC<LoadingCardProps> = ({ 
  title = "Wird geladen...", 
  lines = 3, 
  height = "200px" 
}) => (
  <Card title={title} style={{ height }}>
    <div className="space-y-3">
      {Array.from({ length: lines }, (_, i) => (
        <Skeleton key={i} height="1.5rem" />
      ))}
    </div>
  </Card>
);

// Status Card Component
interface StatusCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: string;
  severity?: Severity;
  trend?: number;
  onClick?: () => void;
}

export const StatusCard: React.FC<StatusCardProps> = ({
  title,
  value,
  subtitle,
  icon = "pi pi-info-circle",
  severity = "info",
  trend,
  onClick
}) => {
  const getSeverityColor = (sev: Severity) => {
    switch (sev) {
      case 'success': return 'text-green-600';
      case 'warn': return 'text-yellow-600';
      case 'error': return 'text-red-600';
      default: return 'text-blue-600';
    }
  };

  const headerContent = (
    <div className="flex items-center justify-between">
      <span className="text-sm font-medium text-gray-600">{title}</span>
      <i className={`${icon} ${getSeverityColor(severity)}`}></i>
    </div>
  );

  return (
    <Card 
      header={headerContent}
      className={`h-fit ${onClick ? 'cursor-pointer hover:shadow-lg transition-all' : ''}`}
      onClick={onClick}
    >
      <div className="space-y-2">
        <div className={`text-2xl font-bold ${getSeverityColor(severity)}`}>
          {value}
        </div>
        {subtitle && (
          <p className="text-sm text-gray-500">{subtitle}</p>
        )}
        {trend !== undefined && (
          <div className="flex items-center space-x-2">
            <i className={`pi pi-arrow-${trend >= 0 ? 'up' : 'down'} text-sm ${trend >= 0 ? 'text-green-500' : 'text-red-500'}`}></i>
            <span className={`text-sm ${trend >= 0 ? 'text-green-500' : 'text-red-500'}`}>
              {Math.abs(trend)}%
            </span>
          </div>
        )}
      </div>
    </Card>
  );
};

// Action Card Component
interface ActionCardProps {
  title: string;
  description: string;
  icon?: string;
  buttonLabel?: string;
  onAction?: () => void;
  severity?: Severity;
  disabled?: boolean;
  badge?: string | number;
}

export const ActionCard: React.FC<ActionCardProps> = ({
  title,
  description,
  icon = "pi pi-cog",
  buttonLabel = "Aktion ausführen",
  onAction,
  severity = "info",
  disabled = false,
  badge
}) => {
  const header = (
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-3">
        <i className={`${icon} text-lg`}></i>
        <span className="font-semibold">{title}</span>
      </div>
      {badge && (
        <Badge value={badge} severity={severity} />
      )}
    </div>
  );

  const footer = (
    <div className="flex justify-end">
      <Button 
        label={buttonLabel}
        icon="pi pi-arrow-right"
        iconPos="right"
        size="small"
        severity={severity}
        disabled={disabled}
        onClick={onAction}
      />
    </div>
  );

  return (
    <Card header={header} footer={footer} className="h-fit">
      <p className="text-gray-600 mb-4">{description}</p>
    </Card>
  );
};

// Progress Card Component
interface ProgressCardProps {
  title: string;
  value: number;
  max?: number;
  label?: string;
  color?: string;
  showPercentage?: boolean;
}

export const ProgressCard: React.FC<ProgressCardProps> = ({
  title,
  value,
  max = 100,
  label,
  color,
  showPercentage = true
}) => {
  const percentage = Math.round((value / max) * 100);
  
  return (
    <Card title={title} className="h-fit">
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">{label || 'Fortschritt'}</span>
          {showPercentage && (
            <span className="text-sm font-medium">{percentage}%</span>
          )}
        </div>
        <ProgressBar 
          value={percentage} 
          color={color}
          style={{ height: '8px' }}
        />
        <div className="flex justify-between text-xs text-gray-500">
          <span>{value}</span>
          <span>{max}</span>
        </div>
      </div>
    </Card>
  );
};

// Info Panel Component
interface InfoPanelProps {
  title: string;
  children: React.ReactNode;
  severity?: Severity;
  icon?: string;
  collapsible?: boolean;
  collapsed?: boolean;
}

export const InfoPanel: React.FC<InfoPanelProps> = ({
  title,
  children,
  severity = "info",
  icon,
  collapsible = false,
  collapsed = false
}) => {
  const headerTemplate = (
    <div className="flex items-center space-x-2">
      {icon && <i className={icon}></i>}
      <span className="font-semibold">{title}</span>
    </div>
  );

  return (
    <Panel
      header={headerTemplate}
      toggleable={collapsible}
      collapsed={collapsed}
      className={`border-l-4 ${
        severity === 'success' ? 'border-l-green-500' :
        severity === 'warn' ? 'border-l-yellow-500' :
        severity === 'error' ? 'border-l-red-500' :
        'border-l-blue-500'
      }`}
    >
      {children}
    </Panel>
  );
};

// Quick Action Toolbar
interface QuickAction {
  label: string;
  icon: string;
  action: () => void;
  severity?: Severity;
  disabled?: boolean;
  tooltip?: string;
}

interface QuickActionToolbarProps {
  actions: QuickAction[];
  title?: string;
}

export const QuickActionToolbar: React.FC<QuickActionToolbarProps> = ({
  actions,
  title = "Schnellaktionen"
}) => {
  const startContent = title ? (
    <div className="flex items-center space-x-2">
      <i className="pi pi-bolt text-yellow-500"></i>
      <span className="font-semibold">{title}</span>
    </div>
  ) : null;

  const endContent = (
    <div className="flex space-x-2">
      {actions.map((action, index) => (
        <Button
          key={index}
          label={action.label}
          icon={action.icon}
          size="small"
          severity={action.severity || "secondary"}
          disabled={action.disabled}
          onClick={action.action}
          tooltip={action.tooltip}
          tooltipOptions={{ position: 'bottom' }}
        />
      ))}
    </div>
  );

  return (
    <Toolbar 
      start={startContent} 
      end={endContent}
      className="mb-4 bg-gray-50 border-gray-200"
    />
  );
};

// Stat Grid Component
interface Stat {
  label: string;
  value: string | number;
  icon?: string;
  severity?: Severity;
  change?: number;
}

interface StatGridProps {
  stats: Stat[];
  columns?: 2 | 3 | 4;
}

export const StatGrid: React.FC<StatGridProps> = ({ stats, columns = 3 }) => {
  const gridClass = {
    2: 'grid grid-cols-1 md:grid-cols-2 gap-4',
    3: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4',
    4: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'
  };

  return (
    <div className={gridClass[columns]}>
      {stats.map((stat, index) => (
        <StatusCard
          key={index}
          title={stat.label}
          value={stat.value}
          icon={stat.icon}
          severity={stat.severity}
          trend={stat.change}
        />
      ))}
    </div>
  );
};

// Feature List Component
interface Feature {
  label: string;
  description?: string;
  icon?: string;
  severity?: Severity;
  badge?: string;
}

interface FeatureListProps {
  features: Feature[];
  title?: string;
}

export const FeatureList: React.FC<FeatureListProps> = ({ 
  features, 
  title = "Features" 
}) => (
  <Card title={title} className="h-fit">
    <div className="space-y-3">
      {features.map((feature, index) => (
        <div key={index} className="flex items-start space-x-3 p-2 rounded-lg hover:bg-gray-50 transition-colors">
          {feature.icon && (
            <i className={`${feature.icon} mt-1 ${
              feature.severity === 'success' ? 'text-green-500' :
              feature.severity === 'warn' ? 'text-yellow-500' :
              feature.severity === 'error' ? 'text-red-500' :
              'text-blue-500'
            }`}></i>
          )}
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <span className="font-medium">{feature.label}</span>
              {feature.badge && (
                <Tag value={feature.badge} severity={feature.severity} />
              )}
            </div>
            {feature.description && (
              <p className="text-sm text-gray-600 mt-1">{feature.description}</p>
            )}
          </div>
        </div>
      ))}
    </div>
  </Card>
);

// User Card Component
interface UserCardProps {
  name: string;
  role: string;
  avatar?: string;
  email?: string;
  status?: 'online' | 'offline' | 'away';
  actions?: Array<{ label: string; icon: string; action: () => void }>;
}

export const UserCard: React.FC<UserCardProps> = ({
  name,
  role,
  avatar,
  email,
  status = 'offline',
  actions = []
}) => {
  const statusColors = {
    online: 'text-green-500',
    offline: 'text-gray-500',
    away: 'text-yellow-500'
  };

  return (
    <Card className="h-fit">
      <div className="flex items-start space-x-4">
        <div className="relative">
          <Avatar
            image={avatar}
            icon={avatar ? undefined : "pi pi-user"}
            size="large"
            shape="circle"
            className="bg-blue-500 text-white"
          />
          <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${
            status === 'online' ? 'bg-green-500' :
            status === 'away' ? 'bg-yellow-500' :
            'bg-gray-400'
          }`}></div>
        </div>
        
        <div className="flex-1">
          <div className="space-y-1">
            <h4 className="font-semibold text-gray-900">{name}</h4>
            <p className="text-sm text-gray-600">{role}</p>
            {email && (
              <p className="text-xs text-gray-500">{email}</p>
            )}
            <div className="flex items-center space-x-1">
              <i className={`pi pi-circle-fill text-xs ${statusColors[status]}`}></i>
              <span className="text-xs text-gray-500 capitalize">{status}</span>
            </div>
          </div>
          
          {actions.length > 0 && (
            <div className="flex space-x-2 mt-3">
              {actions.map((action, index) => (
                <Button
                  key={index}
                  label={action.label}
                  icon={action.icon}
                  size="small"
                  text
                  onClick={action.action}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};

// Notification List Component
interface Notification {
  id: string;
  title: string;
  message: string;
  time: string;
  severity?: Severity;
  read?: boolean;
  actions?: Array<{ label: string; action: () => void }>;
}

interface NotificationListProps {
  notifications: Notification[];
  onMarkAsRead?: (id: string) => void;
  onMarkAllAsRead?: () => void;
}

export const NotificationList: React.FC<NotificationListProps> = ({
  notifications,
  onMarkAsRead,
  onMarkAllAsRead
}) => {
  const unreadCount = notifications.filter(n => !n.read).length;

  const header = (
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-2">
        <i className="pi pi-bell"></i>
        <span className="font-semibold">Benachrichtigungen</span>
        {unreadCount > 0 && (
          <Badge value={unreadCount} severity="info" />
        )}
      </div>
      {unreadCount > 0 && onMarkAllAsRead && (
        <Button
          label="Alle als gelesen markieren"
          size="small"
          text
          onClick={onMarkAllAsRead}
        />
      )}
    </div>
  );

  return (
    <Card header={header} className="h-fit">
      <div className="space-y-3 max-h-96 overflow-y-auto">
        {notifications.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <i className="pi pi-inbox text-3xl mb-2 block"></i>
            <span>Keine Benachrichtigungen</span>
          </div>
        ) : (
          notifications.map((notification) => (
            <div
              key={notification.id}
              className={`p-3 rounded-lg border transition-colors ${
                notification.read 
                  ? 'bg-gray-50 border-gray-200' 
                  : 'bg-blue-50 border-blue-200'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <span className={`font-medium ${notification.read ? 'text-gray-600' : 'text-gray-900'}`}>
                      {notification.title}
                    </span>
                    {!notification.read && (
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    )}
                  </div>
                  <p className={`text-sm ${notification.read ? 'text-gray-500' : 'text-gray-700'}`}>
                    {notification.message}
                  </p>
                  <span className="text-xs text-gray-400 mt-1 block">
                    {notification.time}
                  </span>
                </div>
                
                <div className="flex items-center space-x-2 ml-4">
                  {!notification.read && onMarkAsRead && (
                    <Button
                      icon="pi pi-check"
                      size="small"
                      text
                      rounded
                      onClick={() => onMarkAsRead(notification.id)}
                      tooltip="Als gelesen markieren"
                    />
                  )}
                  {notification.severity && (
                    <Tag 
                      severity={notification.severity} 
                      value={notification.severity.toUpperCase()}
                      rounded 
                    />
                  )}
                </div>
              </div>
              
              {notification.actions && notification.actions.length > 0 && (
                <div className="flex space-x-2 mt-3 pt-3 border-t border-gray-200">
                  {notification.actions.map((action, index) => (
                    <Button
                      key={index}
                      label={action.label}
                      size="small"
                      outlined
                      onClick={action.action}
                    />
                  ))}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </Card>
  );
};

export default {
  LoadingCard,
  StatusCard,
  ActionCard,
  ProgressCard,
  InfoPanel,
  QuickActionToolbar,
  StatGrid,
  FeatureList,
  UserCard,
  NotificationList
};