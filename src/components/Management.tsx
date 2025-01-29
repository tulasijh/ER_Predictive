import React from 'react';
import { BarChart3, Users, Calendar, AlertTriangle, UserCog } from 'lucide-react';
import Analytics from './Analytics';
import StaffManagement from './StaffManagement';
import StaffSchedule from './StaffSchedule';
import IncidentTracker from './IncidentTracker';
import { Routes, Route, Link } from 'react-router-dom';

export default function Management() {
  return (
    <div className="flex h-[calc(100vh-4rem)]">
      <aside className="w-64 bg-gray-800">
        <nav className="mt-5 px-2">
          <Link
            to="/dashboard"
            className="group flex items-center px-2 py-2 text-base font-medium rounded-md text-white hover:bg-gray-700"
          >
            <BarChart3 className="mr-4 h-6 w-6" />
            Analytics
          </Link>
          <Link
            to="/dashboard/staff"
            className="mt-1 group flex items-center px-2 py-2 text-base font-medium rounded-md text-white hover:bg-gray-700"
          >
            <UserCog className="mr-4 h-6 w-6" />
            Staff Management
          </Link>
          <Link
            to="/dashboard/schedule"
            className="mt-1 group flex items-center px-2 py-2 text-base font-medium rounded-md text-white hover:bg-gray-700"
          >
            <Calendar className="mr-4 h-6 w-6" />
            Schedule
          </Link>
          <Link
            to="/dashboard/incidents"
            className="mt-1 group flex items-center px-2 py-2 text-base font-medium rounded-md text-white hover:bg-gray-700"
          >
            <AlertTriangle className="mr-4 h-6 w-6" />
            Incidents
          </Link>
        </nav>
      </aside>

      <main className="flex-1 overflow-y-auto bg-gray-100">
        <div className="py-6">
          <Routes>
            <Route path="/" element={<Analytics />} />
            <Route path="/staff" element={<StaffManagement />} />
            <Route path="/schedule" element={<StaffSchedule />} />
            <Route path="/incidents" element={<IncidentTracker />} />
          </Routes>
        </div>
      </main>
    </div>
  );
}