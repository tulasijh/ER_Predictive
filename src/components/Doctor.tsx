import React from 'react';
import { Users, Calendar, AlertTriangle, BarChart3 } from 'lucide-react';
import { Routes, Route, Link } from 'react-router-dom';
import Analytics from './Analytics';
import PatientManagement from './PatientManagement';
import StaffSchedule from './StaffSchedule';
import IncidentTracker from './IncidentTracker';

export default function Doctor() {
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
            to="/dashboard/patients"
            className="mt-1 group flex items-center px-2 py-2 text-base font-medium rounded-md text-white hover:bg-gray-700"
          >
            <Users className="mr-4 h-6 w-6" />
            Patients
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
            <Route path="/patients" element={<PatientManagement />} />
            <Route path="/schedule" element={<StaffSchedule />} />
            <Route path="/incidents" element={<IncidentTracker />} />
          </Routes>
        </div>
      </main>
    </div>
  );
}