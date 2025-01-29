import React, { useState, useEffect } from 'react';
import { localDataService } from '../lib/localData';
import { mockStaff } from '../lib/mockData';
import { Staff } from '../types';
import { Clock, User, Calendar, Plus } from 'lucide-react';

export default function StaffManagement() {
  const [staff, setStaff] = useState<Staff[]>([]);
  const [selectedStaff, setSelectedStaff] = useState<Staff | null>(null);
  const [newSchedule, setNewSchedule] = useState({ day: 'Monday', hours: '7:00 AM - 3:00 PM' });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedStaff = localDataService.getStaff();
    if (storedStaff.length === 0) {
      localDataService.setStaff(mockStaff);
      setStaff(mockStaff);
    } else {
      setStaff(storedStaff);
    }
    setLoading(false);
  }, []);

  const handleAddSchedule = (staffMember: Staff) => {
    const updatedStaff = staff.map(s => {
      if (s.id === staffMember.id) {
        return {
          ...s,
          schedule: [...(s.schedule || []), newSchedule]
        };
      }
      return s;
    });
    localDataService.setStaff(updatedStaff);
    setStaff(updatedStaff);
    setSelectedStaff(null);
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-semibold text-gray-900 mb-6">Staff Management</h1>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Staff List */}
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <h2 className="text-lg font-medium text-gray-900">Staff Directory</h2>
          </div>
          <ul className="divide-y divide-gray-200">
            {staff.map((member) => (
              <li
                key={member.id}
                className="px-4 py-4 hover:bg-gray-50 cursor-pointer"
                onClick={() => setSelectedStaff(member)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <User className="h-6 w-6 text-gray-400" />
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-900">{member.name}</p>
                      <p className="text-sm text-gray-500">{member.role}</p>
                    </div>
                  </div>
                  <div className="text-sm text-gray-500">{member.department}</div>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Schedule Management */}
        {selectedStaff && (
          <div className="bg-white shadow sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6">
              <h3 className="text-lg font-medium text-gray-900">
                Schedule for {selectedStaff.name}
              </h3>
            </div>
            <div className="border-t border-gray-200">
              <dl>
                <div className="px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">Current Schedule</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {selectedStaff.schedule?.map((schedule, index) => (
                      <div key={index} className="flex items-center space-x-2 mb-2">
                        <Calendar className="h-4 w-4 text-gray-400" />
                        <span>{schedule.day}: {schedule.hours}</span>
                      </div>
                    ))}
                  </dd>
                </div>

                <div className="px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 bg-gray-50">
                  <dt className="text-sm font-medium text-gray-500">Add New Schedule</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    <div className="flex space-x-4">
                      <select
                        className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        value={newSchedule.day}
                        onChange={(e) => setNewSchedule({ ...newSchedule, day: e.target.value })}
                      >
                        {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(day => (
                          <option key={day} value={day}>{day}</option>
                        ))}
                      </select>
                      <select
                        className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        value={newSchedule.hours}
                        onChange={(e) => setNewSchedule({ ...newSchedule, hours: e.target.value })}
                      >
                        <option value="7:00 AM - 3:00 PM">7:00 AM - 3:00 PM</option>
                        <option value="3:00 PM - 11:00 PM">3:00 PM - 11:00 PM</option>
                        <option value="11:00 PM - 7:00 AM">11:00 PM - 7:00 AM</option>
                      </select>
                      <button
                        onClick={() => handleAddSchedule(selectedStaff)}
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Add
                      </button>
                    </div>
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}