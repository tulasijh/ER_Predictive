import React, { useEffect, useState } from 'react';
import { Search, Filter, AlertTriangle } from 'lucide-react';
import { localDataService } from '../lib/localData';
import { generateMockPatients } from '../lib/mockData';
import type { Patient } from '../types';

export default function PatientManagement() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');

  useEffect(() => {
    async function fetchPatients() {
      try {
        // Get patients from local storage or generate new ones if none exist
        let storedPatients = localDataService.getPatients();
        if (storedPatients.length === 0) {
          storedPatients = generateMockPatients(50000);
          localDataService.setPatients(storedPatients);
        }

        // Apply filters
        let filteredPatients = storedPatients;
        if (selectedDepartment !== 'all') {
          filteredPatients = filteredPatients.filter(p => p.department === selectedDepartment);
        }
        if (selectedStatus !== 'all') {
          filteredPatients = filteredPatients.filter(p => p.status === selectedStatus);
        }

        // Sort by visit time descending and limit to 50 records for performance
        filteredPatients.sort((a, b) => new Date(b.visit_time).getTime() - new Date(a.visit_time).getTime());
        setPatients(filteredPatients.slice(0, 50));
      } catch (error) {
        console.error('Error fetching patients:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchPatients();
  }, [selectedDepartment, selectedStatus]);

  const filteredPatients = patients.filter(patient => {
    const searchMatch = patient.id.toLowerCase().includes(searchTerm.toLowerCase());
    return searchMatch;
  });

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'bg-red-100 text-red-800';
      case 'high':
        return 'bg-orange-100 text-orange-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-900 mb-4 sm:mb-0">Patient Management</h1>
        
        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4 w-full sm:w-auto">
          <div className="relative">
            <input
              type="text"
              placeholder="Search patients..."
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
          </div>

          <select
            className="block w-full sm:w-auto pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
            value={selectedDepartment}
            onChange={(e) => setSelectedDepartment(e.target.value)}
          >
            <option value="all">All Departments</option>
            <option value="Emergency">Emergency</option>
            <option value="Trauma">Trauma</option>
            <option value="Pediatric Emergency">Pediatric Emergency</option>
            <option value="Critical Care">Critical Care</option>
          </select>

          <select
            className="block w-full sm:w-auto pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
          >
            <option value="all">All Statuses</option>
            <option value="waiting">Waiting</option>
            <option value="in_treatment">In Treatment</option>
            <option value="discharged">Discharged</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-4">Loading patients...</div>
      ) : (
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <ul className="divide-y divide-gray-200">
            {filteredPatients.map((patient) => (
              <li key={patient.id}>
                <div className="px-4 py-4 sm:px-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <p className="text-sm font-medium text-gray-900">
                        Patient ID: {patient.id}
                      </p>
                      <span className={`ml-2 px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getSeverityColor(patient.severity)}`}>
                        {patient.severity}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <p className="text-sm text-gray-500">
                        Wait Time: {patient.wait_time} min
                      </p>
                    </div>
                  </div>
                  <div className="mt-2 sm:flex sm:justify-between">
                    <div className="sm:flex">
                      <p className="flex items-center text-sm text-gray-500">
                        Department: {patient.department}
                      </p>
                      <p className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0 sm:ml-6">
                        Status: {patient.status.replace('_', ' ')}
                      </p>
                    </div>
                    <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                      <p className="text-sm text-gray-500">
                        Symptoms: {patient.symptoms.join(', ')}
                      </p>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}