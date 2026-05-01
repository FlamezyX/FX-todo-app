import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import NotificationBell from './NotificationBell';
import GlobalSearch from './GlobalSearch';
import TutorialButton from '../tutorial/TutorialButton';

const AppLayout = () => {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="lg:ml-64 flex-1 p-4 lg:p-8 pt-16 lg:pt-8">
        <div className="flex justify-between items-center mb-6">
          <div data-tour="global-search">
            <GlobalSearch />
          </div>
          <div className="flex items-center gap-2">
            <TutorialButton />
            <div data-tour="notification-bell">
              <NotificationBell />
            </div>
          </div>
        </div>
        <Outlet />
      </main>
    </div>
  );
};

export default AppLayout;
