import React, { useState, useEffect } from 'react';
import { Calendar as CalendarIcon, Clock, User } from 'lucide-react';
import { localDataService } from '../lib/localData';

export default function StaffSchedule() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const staff = localDataService.getStaff();
    const scheduleData = staff.map(member => ({
      id: member.id,
      name: member.name,
      role: member.role,
      department: member.department,
      shift: member.schedule?.[0]?.hours || '7:00 AM - 3:00 PM'
    }));
    setSchedules(scheduleData);
    setLoading(false);
  }, [selectedDate]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-gray-500">Loading schedules...</div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-900 mb-4 sm:mb-0">Staff Schedule</h1>
        <div className="w-full sm:w-auto">
          <div className="relative">
            <input
              type="date"
              className="block w-full sm:w-auto pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              value={selectedDate.toISOString().split('T')[0]}
              onChange={(e) => setSelectedDate(new Date(e.target.value))}
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <CalendarIcon className="h-5 w-5 text-gray-400" />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {schedules.map((schedule: any) => (
            <li key={schedule.id}>
              <div className="px-4 py-4 sm:px-6">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
                  <div className="flex items-center mb-2 sm:mb-0">
                    <User className="h-6 w-6 text-gray-400" />
                    <p className="ml-3 text-sm font-medium text-gray-900">
                      {schedule.name}
                    </p>
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-5 w-5 text-gray-400" />
                    <p className="ml-2 text-sm text-gray-500">{schedule.shift}</p>
                  </div>
                </div>
                <div className="mt-2 sm:flex sm:justify-between">
                  <div className="sm:flex">
                    <p className="flex items-center text-sm text-gray-500">
                      {schedule.role.charAt(0).toUpperCase() + schedule.role.slice(1)}
                    </p>
                    <p className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0 sm:ml-6">
                      {schedule.department}
                    </p>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}