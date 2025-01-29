import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import { BarChart3, Users, Calendar, AlertTriangle, UserCog, Menu, X } from 'lucide-react';
import Analytics from './Analytics';
import StaffSchedule from './StaffSchedule';
import PatientManagement from './PatientManagement';
import IncidentTracker from './IncidentTracker';
import StaffManagement from './StaffManagement';
import { localDataService } from '../lib/localData';

export default function Dashboard() {
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);
  const currentUser = localDataService.getCurrentUser();
  const isManagement = currentUser?.role === 'management';

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  return (
    <div className="flex h-[calc(100vh-4rem)]">
      {/* Mobile menu button */}
      <button
        onClick={toggleSidebar}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700"
      >
        {isSidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </button>

      {/* Sidebar */}
      <aside
        className={`${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0 fixed lg:relative w-64 h-full bg-gray-800 transition-transform duration-300 ease-in-out z-40`}
      >
        <nav className="mt-5 px-2">
          <Link
            to="/dashboard"
            onClick={closeSidebar}
            className="group flex items-center px-2 py-2 text-base font-medium rounded-md text-white hover:bg-gray-700"
          >
            <BarChart3 className="mr-4 h-6 w-6" />
            Analytics
          </Link>
          <Link
            to="/dashboard/patients"
            onClick={closeSidebar}
            className="mt-1 group flex items-center px-2 py-2 text-base font-medium rounded-md text-white hover:bg-gray-700"
          >
            <Users className="mr-4 h-6 w-6" />
            Patients
          </Link>
          {(currentUser?.role === 'doctor' || currentUser?.role === 'staff' || isManagement) && (
            <Link
              to="/dashboard/schedule"
              onClick={closeSidebar}
              className="mt-1 group flex items-center px-2 py-2 text-base font-medium rounded-md text-white hover:bg-gray-700"
            >
              <Calendar className="mr-4 h-6 w-6" />
              Schedule
            </Link>
          )}
          {isManagement && (
            <Link
              to="/dashboard/staff"
              onClick={closeSidebar}
              className="mt-1 group flex items-center px-2 py-2 text-base font-medium rounded-md text-white hover:bg-gray-700"
            >
              <UserCog className="mr-4 h-6 w-6" />
              Staff Management
            </Link>
          )}
          <Link
            to="/dashboard/incidents"
            onClick={closeSidebar}
            className="mt-1 group flex items-center px-2 py-2 text-base font-medium rounded-md text-white hover:bg-gray-700"
          >
            <AlertTriangle className="mr-4 h-6 w-6" />
            Incidents
          </Link>
        </nav>
      </aside>

      {/* Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-gray-600 bg-opacity-75 z-30 lg:hidden"
          onClick={closeSidebar}
        ></div>
      )}

      {/* Main content */}
      <main className="flex-1 overflow-y-auto bg-gray-100 relative">
        <div className="py-6 px-4 sm:px-6 lg:px-8">
          <Routes>
            <Route path="/" element={<Analytics />} />
            <Route path="/patients" element={<PatientManagement />} />
            <Route path="/schedule" element={<StaffSchedule />} />
            <Route path="/staff" element={<StaffManagement />} />
            <Route path="/incidents" element={<IncidentTracker />} />
          </Routes>
        </div>
      </main>
    </div>
  );
}