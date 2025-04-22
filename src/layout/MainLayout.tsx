import React from 'react';
import MediaQuery from 'react-responsive';
import '../App.css';
import { ExportLogButton } from './ExportLogButton';
export const MainLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="App">
      <MediaQuery minWidth={431}>
        <div className="MainLayout large-screen">
          {children}
          <ExportLogButton />
        </div>
      </MediaQuery>
      <MediaQuery maxWidth={430}>
        <div className="MainLayout small-screen">
          {children}
          <ExportLogButton />
        </div>
      </MediaQuery>
    </div>
  );
};
