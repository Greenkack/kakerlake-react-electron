import React from 'react';

interface ResponsiveGridProps {
  children: React.ReactNode;
  columns?: {
    sm?: number;
    md?: number;
    lg?: number;
    xl?: number;
  };
  gap?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export const ResponsiveGrid: React.FC<ResponsiveGridProps> = ({
  children,
  columns = { sm: 1, md: 2, lg: 3, xl: 4 },
  gap = 'md',
  className = ''
}) => {
  const gapClasses = {
    sm: 'gap-2',
    md: 'gap-4',
    lg: 'gap-6',
    xl: 'gap-8'
  };

  const gridClasses = `
    grid
    grid-cols-${columns.sm || 1}
    ${columns.md ? `md:grid-cols-${columns.md}` : ''}
    ${columns.lg ? `lg:grid-cols-${columns.lg}` : ''}
    ${columns.xl ? `xl:grid-cols-${columns.xl}` : ''}
    ${gapClasses[gap]}
  `.trim().replace(/\s+/g, ' ');

  return (
    <div className={`${gridClasses} ${className}`}>
      {children}
    </div>
  );
};

interface ResponsiveContainerProps {
  children: React.ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '7xl' | 'full';
  padding?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export const ResponsiveContainer: React.FC<ResponsiveContainerProps> = ({
  children,
  maxWidth = '7xl',
  padding = 'md',
  className = ''
}) => {
  const maxWidthClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md', 
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
    '7xl': 'max-w-7xl',
    full: 'max-w-full'
  };

  const paddingClasses = {
    sm: 'px-4 py-2',
    md: 'px-6 py-4',
    lg: 'px-8 py-6',
    xl: 'px-12 py-8'
  };

  return (
    <div className={`${maxWidthClasses[maxWidth]} mx-auto ${paddingClasses[padding]} ${className}`}>
      {children}
    </div>
  );
};

interface ResponsiveNavProps {
  title: string;
  logo?: string;
  menuItems: Array<{
    label: string;
    href: string;
    icon?: string;
    active?: boolean;
  }>;
  actions?: React.ReactNode;
  className?: string;
}

export const ResponsiveNav: React.FC<ResponsiveNavProps> = ({
  title,
  logo,
  menuItems,
  actions,
  className = ''
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  return (
    <nav className={`bg-white shadow-lg border-b border-gray-200 ${className}`}>
      <ResponsiveContainer maxWidth="7xl" padding="md">
        <div className="flex justify-between items-center">
          {/* Logo/Title */}
          <div className="flex items-center space-x-3">
            {logo && (
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <i className={`${logo} text-white`}></i>
              </div>
            )}
            <h1 className="text-xl font-bold text-gray-900 hidden sm:block">
              {title}
            </h1>
            <h1 className="text-lg font-bold text-gray-900 sm:hidden">
              {title.split(' ')[0]}
            </h1>
          </div>

          {/* Desktop Menu */}
          <div className="hidden lg:flex items-center space-x-1">
            {menuItems.map((item, index) => (
              <a
                key={index}
                href={item.href}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  item.active
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                {item.icon && <i className={`${item.icon} mr-2`}></i>}
                {item.label}
              </a>
            ))}
          </div>

          {/* Actions & Mobile Menu Button */}
          <div className="flex items-center space-x-3">
            {actions && <div className="hidden md:block">{actions}</div>}
            
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              title="Menü öffnen/schließen"
              className="lg:hidden p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100"
            >
              <i className={`pi ${isMobileMenuOpen ? 'pi-times' : 'pi-bars'} text-lg`}></i>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden mt-4 pb-4 border-t border-gray-200 pt-4">
            <div className="space-y-2">
              {menuItems.map((item, index) => (
                <a
                  key={index}
                  href={item.href}
                  className={`block px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                    item.active
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.icon && <i className={`${item.icon} mr-3`}></i>}
                  {item.label}
                </a>
              ))}
            </div>
            
            {actions && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                {actions}
              </div>
            )}
          </div>
        )}
      </ResponsiveContainer>
    </nav>
  );
};

interface ResponsiveSidebarProps {
  title?: string;
  items: Array<{
    label: string;
    href: string;
    icon?: string;
    active?: boolean;
    badge?: string | number;
  }>;
  footer?: React.ReactNode;
  className?: string;
}

export const ResponsiveSidebar: React.FC<ResponsiveSidebarProps> = ({
  title,
  items,
  footer,
  className = ''
}) => {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        fixed lg:static inset-y-0 left-0 z-50 lg:z-0
        w-64 bg-white shadow-lg border-r border-gray-200
        transform transition-transform duration-300 ease-out
        ${className}
      `}>
        <div className="h-full flex flex-col">
          {/* Header */}
          {title && (
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-gray-900">{title}</h2>
                <button
                  onClick={() => setIsOpen(false)}
                  title="Sidebar schließen"
                  className="lg:hidden p-1 rounded text-gray-500 hover:text-gray-700"
                >
                  <i className="pi pi-times"></i>
                </button>
              </div>
            </div>
          )}

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            {items.map((item, index) => (
              <a
                key={index}
                href={item.href}
                className={`
                  flex items-center px-4 py-3 text-sm font-medium rounded-lg
                  transition-all duration-200
                  ${item.active 
                    ? 'bg-blue-100 text-blue-700 border-r-2 border-blue-500' 
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }
                `}
                onClick={() => setIsOpen(false)}
              >
                {item.icon && <i className={`${item.icon} mr-3 text-lg`}></i>}
                <span className="flex-1">{item.label}</span>
                {item.badge && (
                  <span className="ml-2 px-2 py-0.5 text-xs font-medium bg-blue-100 text-blue-700 rounded-full">
                    {item.badge}
                  </span>
                )}
              </a>
            ))}
          </nav>

          {/* Footer */}
          {footer && (
            <div className="p-4 border-t border-gray-200">
              {footer}
            </div>
          )}
        </div>
      </div>

      {/* Mobile Menu Toggle Button */}
      <button
        onClick={() => setIsOpen(true)}
        title="Menü öffnen"
        className="lg:hidden fixed bottom-4 left-4 z-30 p-3 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700"
      >
        <i className="pi pi-bars"></i>
      </button>
    </>
  );
};

interface ResponsiveTableProps {
  headers: Array<{
    key: string;
    label: string;
    sortable?: boolean;
    width?: string;
  }>;
  data: Array<Record<string, any>>;
  onRowClick?: (row: Record<string, any>) => void;
  loading?: boolean;
  emptyMessage?: string;
  className?: string;
}

export const ResponsiveTable: React.FC<ResponsiveTableProps> = ({
  headers,
  data,
  onRowClick,
  loading = false,
  emptyMessage = "Keine Daten vorhanden",
  className = ''
}) => {
  const [sortField, setSortField] = React.useState<string>('');
  const [sortDirection, setSortDirection] = React.useState<'asc' | 'desc'>('asc');

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const sortedData = React.useMemo(() => {
    if (!sortField) return data;
    
    return [...data].sort((a, b) => {
      const aVal = a[sortField];
      const bVal = b[sortField];
      
      if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  }, [data, sortField, sortDirection]);

  if (loading) {
    return (
      <div className={`bg-white rounded-lg shadow-lg p-8 text-center ${className}`}>
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Daten werden geladen...</p>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-lg shadow-lg overflow-hidden ${className}`}>
      {/* Desktop Table */}
      <div className="hidden lg:block overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              {headers.map((header) => (
                <th
                  key={header.key}
                  className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${header.width || ''} ${header.sortable ? 'cursor-pointer hover:bg-gray-100' : ''}`}
                  onClick={() => header.sortable && handleSort(header.key)}
                >
                  <div className="flex items-center space-x-1">
                    <span>{header.label}</span>
                    {header.sortable && (
                      <i className={`pi ${
                        sortField === header.key 
                          ? (sortDirection === 'asc' ? 'pi-sort-up' : 'pi-sort-down')
                          : 'pi-sort'
                      } text-xs`}></i>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {sortedData.map((row, index) => (
              <tr
                key={index}
                className={`hover:bg-gray-50 ${onRowClick ? 'cursor-pointer' : ''}`}
                onClick={() => onRowClick?.(row)}
              >
                {headers.map((header) => (
                  <td key={header.key} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {row[header.key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="lg:hidden divide-y divide-gray-200">
        {sortedData.map((row, index) => (
          <div
            key={index}
            className={`p-4 ${onRowClick ? 'cursor-pointer hover:bg-gray-50' : ''}`}
            onClick={() => onRowClick?.(row)}
          >
            <div className="space-y-2">
              {headers.slice(0, 3).map((header) => (
                <div key={header.key} className="flex justify-between">
                  <span className="text-sm font-medium text-gray-600">{header.label}:</span>
                  <span className="text-sm text-gray-900">{row[header.key]}</span>
                </div>
              ))}
              {headers.length > 3 && (
                <div className="text-xs text-gray-500 pt-2">
                  +{headers.length - 3} weitere Felder
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {sortedData.length === 0 && (
        <div className="p-8 text-center">
          <i className="pi pi-inbox text-4xl text-gray-400 mb-4"></i>
          <p className="text-gray-600">{emptyMessage}</p>
        </div>
      )}
    </div>
  );
};

export default { ResponsiveGrid, ResponsiveContainer, ResponsiveNav, ResponsiveSidebar, ResponsiveTable };
