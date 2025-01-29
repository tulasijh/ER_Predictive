import React, { useEffect, useState } from 'react';
import { Clock, Users, AlertTriangle } from 'lucide-react';
import { localDataService } from '../lib/localData';
import { mockDepartments } from '../lib/mockData';
import type { Department } from '../types';

export default function PublicView() {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load departments from local storage or use mock data
    const storedDepartments = localDataService.getDepartments();
    if (storedDepartments.length === 0) {
      localDataService.setDepartments(mockDepartments);
      setDepartments(mockDepartments);
    } else {
      setDepartments(storedDepartments);
    }
    setLoading(false);
  }, []);

  return (
    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div className="px-4 py-6 sm:px-0">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Baylor University Medical Center - Current Status
        </h1>

        {loading ? (
          <div className="text-center">Loading...</div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {departments.map((dept) => (
              <div
                key={dept.id}
                className="bg-white overflow-hidden shadow rounded-lg"
              >
                <div className="px-4 py-5 sm:p-6">
                  <h3 className="text-lg font-medium text-gray-900">
                    {dept.name}
                  </h3>
                  
                  <div className="mt-5 grid grid-cols-2 gap-5">
                    <div className="flex items-center">
                      <Users className="h-5 w-5 text-gray-400" />
                      <span className="ml-2 text-sm text-gray-500">
                        Capacity: {dept.current_capacity}/{dept.max_capacity}
                      </span>
                    </div>
                    
                    <div className="flex items-center">
                      <Clock className="h-5 w-5 text-gray-400" />
                      <span className="ml-2 text-sm text-gray-500">
                        Wait: ~{dept.wait_time} min
                      </span>
                    </div>
                  </div>

                  <div className="mt-4">
                    {(dept.current_capacity / dept.max_capacity) > 0.9 && (
                      <div className="flex items-center text-yellow-600">
                        <AlertTriangle className="h-5 w-5" />
                        <span className="ml-2 text-sm">High volume alert</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-8 bg-blue-50 border-l-4 border-blue-400 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <AlertTriangle className="h-5 w-5 text-blue-400" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-blue-700">
                For emergencies, please call 911. This dashboard shows estimated wait times
                and may not reflect sudden changes in hospital capacity.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}