import React, { useEffect } from 'react';

import MediaQuery from 'react-responsive';

import '../App.css';
import { printSafeArea } from '../utils';
import { ExportLogButton } from './ExportLogButton';

const isProdEnv = import.meta.env.VITE_DEPLOY_ENV === 'prod';

export const MainLayout = ({ children }: { children: React.ReactNode }) => {
  useEffect(() => {
    printSafeArea();
  }, []);

  return (
    <div className="App safe-area">
      <MediaQuery minWidth={431}>
        <div className="MainLayout large-screen">
          {children}
          {!isProdEnv && <ExportLogButton />}
        </div>
      </MediaQuery>
      <MediaQuery maxWidth={430}>
        <div className="MainLayout small-screen">
          {children}
          {!isProdEnv && <ExportLogButton />}
        </div>
      </MediaQuery>
    </div>
  );
};
