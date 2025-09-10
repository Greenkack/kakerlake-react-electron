import React, { useState, useEffect } from 'react';
import { Panel } from 'primereact/panel';
import { Button } from 'primereact/button';
import { Sidebar } from 'primereact/sidebar';
import { Menubar } from 'primereact/menubar';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Card } from 'primereact/card';
import { Divider } from 'primereact/divider';
import 'primeicons/primeicons.css';

// ResponsiveGrid mit flexiblem Grid-System
interface ResponsiveGridProps {
  children: React.ReactNode;
  cols?: 1 | 2 | 3 | 4 | 6 | 12;
  gap?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export const ResponsiveGrid: React.FC<ResponsiveGridProps> = ({
  children,
  cols = 1,
  gap = 'md',
  className = ''
}) => {
  const getGridClasses = () => {
    const gapClasses = {
      none: '',
      sm: 'gap-2',
      md: 'gap-4',
      lg: 'gap-6',
      xl: 'gap-8'
    };

    const colClasses = {
      1: 'grid-cols-1',
      2: 'grid-cols-1 md:grid-cols-2',
      3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
      4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
      6: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6',
      12: 'grid-cols-12'
    };

    return `grid ${colClasses[cols]} ${gapClasses[gap]} ${className}`;
  };

  return (
    <div className={getGridClasses()}>
      {children}
    </div>
  );
};

// ResponsiveContainer für konsistente Layouts
interface ResponsiveContainerProps {
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  className?: string;
}

export const ResponsiveContainer: React.FC<ResponsiveContainerProps> = ({
  children,
  size = 'lg',
  padding = 'md',
  className = ''
}) => {
  const getSizeClasses = () => {
    const sizeClasses = {
      sm: 'max-w-screen-sm',
      md: 'max-w-screen-md',
      lg: 'max-w-screen-lg',
      xl: 'max-w-screen-xl',
      full: 'w-full'
    };

    const paddingClasses = {
      none: '',
      sm: 'px-4 py-2',
      md: 'px-6 py-4',
      lg: 'px-8 py-6'
    };

    return `${sizeClasses[size]} ${paddingClasses[padding]} mx-auto ${className}`;
  };

  return (
    <div className={getSizeClasses()}>
      {children}
    </div>
  );
};

// ResponsiveNavigation mit PrimeReact Menubar
interface NavigationItem {
  label: string;
  icon?: string;
  command?: () => void;
  items?: NavigationItem[];
  url?: string;
}

interface ResponsiveNavigationProps {
  items: NavigationItem[];
  logo?: React.ReactNode;
  className?: string;
  onMenuToggle?: () => void;
}

export const ResponsiveNavigation: React.FC<ResponsiveNavigationProps> = ({
  items,
  logo,
  className = '',
  onMenuToggle
}) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  const start = logo ? (
    <div className="flex align-items-center">
      {logo}
    </div>
  ) : undefined;

  const end = isMobile ? (
    <Button
      icon="pi pi-bars"
      className="p-button-text"
      onClick={onMenuToggle}
      aria-label="Menu"
    />
  ) : undefined;

  return (
    <div className={`surface-card ${className}`}>
      <Menubar
        model={isMobile ? [] : items}
        start={start}
        end={end}
        className="border-none shadow-2"
      />
    </div>
  );
};

// ResponsiveSidebar mit PrimeReact Sidebar
interface ResponsiveSidebarProps {
  visible: boolean;
  onHide: () => void;
  children: React.ReactNode;
  position?: 'left' | 'right';
  className?: string;
  header?: string;
}

export const ResponsiveSidebar: React.FC<ResponsiveSidebarProps> = ({
  visible,
  onHide,
  children,
  position = 'left',
  className = '',
  header
}) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  return (
    <Sidebar
      visible={visible}
      onHide={onHide}
      position={position}
      className={`${className} ${isMobile ? 'w-full' : 'w-20rem'}`}
      header={header}
      modal={isMobile}
      dismissable={isMobile}
    >
      {children}
    </Sidebar>
  );
};

// ResponsiveTable mit PrimeReact DataTable
interface ResponsiveTableColumn {
  field: string;
  header: string;
  body?: (rowData: any) => React.ReactNode;
  sortable?: boolean;
  filter?: boolean;
  style?: React.CSSProperties;
  className?: string;
}

interface ResponsiveTableProps {
  data: any[];
  columns: ResponsiveTableColumn[];
  loading?: boolean;
  paginator?: boolean;
  rows?: number;
  className?: string;
  emptyMessage?: string;
  mobileCardTemplate?: (item: any) => React.ReactNode;
}

export const ResponsiveTable: React.FC<ResponsiveTableProps> = ({
  data,
  columns,
  loading = false,
  paginator = true,
  rows = 10,
  className = '',
  emptyMessage = 'Keine Daten verfügbar',
  mobileCardTemplate
}) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  // Mobile Card-Ansicht
  if (isMobile && mobileCardTemplate) {
    return (
      <div className={`grid gap-3 ${className}`}>
        {data.map((item, index) => (
          <Card key={index} className="p-2">
            {mobileCardTemplate(item)}
          </Card>
        ))}
        {data.length === 0 && (
          <div className="text-center p-4 text-600">
            {emptyMessage}
          </div>
        )}
      </div>
    );
  }

  // Desktop Tabellen-Ansicht
  return (
    <DataTable
      value={data}
      loading={loading}
      paginator={paginator}
      rows={rows}
      className={`responsive-table ${className}`}
      emptyMessage={emptyMessage}
      responsiveLayout="scroll"
    >
      {columns.map((col, index) => (
        <Column
          key={index}
          field={col.field}
          header={col.header}
          body={col.body}
          sortable={col.sortable}
          filter={col.filter}
          style={col.style}
          className={col.className}
        />
      ))}
    </DataTable>
  );
};

// ResponsivePanel mit PrimeReact Panel
interface ResponsivePanelProps {
  children: React.ReactNode;
  header?: string;
  toggleable?: boolean;
  collapsed?: boolean;
  className?: string;
  headerTemplate?: React.ReactNode;
  icons?: React.ReactNode;
}

export const ResponsivePanel: React.FC<ResponsivePanelProps> = ({
  children,
  header,
  toggleable = false,
  collapsed = false,
  className = '',
  headerTemplate,
  icons
}) => {
  return (
    <Panel
      header={header}
      toggleable={toggleable}
      collapsed={collapsed}
      className={`responsive-panel ${className}`}
      headerTemplate={headerTemplate}
      icons={icons}
    >
      {children}
    </Panel>
  );
};

// Layout-Hook für Responsive-Verhalten
export const useResponsive = () => {
  const [screenSize, setScreenSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 0,
    height: typeof window !== 'undefined' ? window.innerHeight : 0
  });

  const [breakpoint, setBreakpoint] = useState<'xs' | 'sm' | 'md' | 'lg' | 'xl'>('lg');

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      
      setScreenSize({ width, height });
      
      if (width < 576) setBreakpoint('xs');
      else if (width < 768) setBreakpoint('sm');
      else if (width < 992) setBreakpoint('md');
      else if (width < 1200) setBreakpoint('lg');
      else setBreakpoint('xl');
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return {
    screenSize,
    breakpoint,
    isMobile: breakpoint === 'xs' || breakpoint === 'sm',
    isTablet: breakpoint === 'md',
    isDesktop: breakpoint === 'lg' || breakpoint === 'xl'
  };
};

// CSS Styles für responsive Komponenten
export const responsiveStyles = `
.responsive-table .p-datatable-wrapper {
  overflow-x: auto;
}

.responsive-panel {
  margin-bottom: 1rem;
}

@media (max-width: 768px) {
  .responsive-table .p-datatable-tbody > tr > td {
    display: block;
    border: none;
    border-bottom: 1px solid var(--surface-border);
    padding: 0.5rem;
  }
  
  .responsive-table .p-datatable-thead,
  .responsive-table .p-datatable-tfoot {
    display: none;
  }
  
  .responsive-table .p-datatable-tbody > tr > td:before {
    content: attr(data-label) ": ";
    font-weight: bold;
    color: var(--text-color-secondary);
  }
}
`;

// Style-Injection für responsive Komponenten
if (typeof document !== 'undefined' && !document.getElementById('responsive-layout-styles')) {
  const styleElement = document.createElement('style');
  styleElement.id = 'responsive-layout-styles';
  styleElement.textContent = responsiveStyles;
  document.head.appendChild(styleElement);
}
