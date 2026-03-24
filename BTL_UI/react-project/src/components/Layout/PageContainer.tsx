import type { ReactNode } from 'react';

interface PageContainerProps {
  children: ReactNode;
  maxWidth?: string;
  background?: string;
  padding?: string;
}

const PageContainer = ({ 
  children, 
  maxWidth = '1200px',
  background = '#fff',
  padding = '20px'
}: PageContainerProps) => {
  return (
    <div style={{ background, minHeight: 'calc(100vh - 64px)' }}>
      <div style={{ maxWidth, margin: '0 auto', padding }}>
        {children}
      </div>
    </div>
  );
};

export default PageContainer;