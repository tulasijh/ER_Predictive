import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';
import { AlertTriangle, TrendingUp, Users, Clock } from 'lucide-react';
import { localDataService } from '../lib/localData';
import { generateMockPatients } from '../lib/mockData';
import type { Patient } from '../types';

export default function Analytics() {
  const [loading, setLoading] = useState(true);
  const [patientStats, setPatientStats] = useState({
    totalToday: 0,
    averageWaitTime: 0,
    criticalCases: 0
  });
  const [hourlyData, setHourlyData] = useState<any[]>([]);
  const [severityData, setSeverityData] = useState<any[]>([]);
  const [weeklyData, setWeeklyData] = useState<any[]>([]);

  useEffect(() => {
    async function fetchAnalytics() {
      try {
        // Get or generate patient data
        let patients = localDataService.getPatients();
        if (patients.length === 0) {
          patients = generateMockPatients(50000);
          localDataService.setPatients(patients);
        }

        // Calculate today's statistics
        const today = new Date().toISOString().split('T')[0];
        const todayData = patients.filter(p => 
          p.visit_time.startsWith(today)
        );

        setPatientStats({
          totalToday: todayData.length,
          averageWaitTime: Math.round(todayData.reduce((acc, curr) => acc + curr.wait_time, 0) / todayData.length || 0),
          criticalCases: todayData.filter(p => p.severity === 'critical').length
        });

        // Calculate hourly distribution
        const hourlyDistribution = Array(24).fill(0);
        todayData.forEach(visit => {
          const hour = new Date(visit.visit_time).getHours();
          hourlyDistribution[hour]++;
        });

        setHourlyData(hourlyDistribution.map((count, hour) => ({
          hour: `${hour}:00`,
          patients: count
        })));

        // Calculate weekly distribution
        const weekDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        const weeklyDistribution = Array(7).fill(0);
        patients.forEach(visit => {
          const day = new Date(visit.visit_time).getDay();
          weeklyDistribution[day]++;
        });

        setWeeklyData(weeklyDistribution.map((count, index) => ({
          day: weekDays[index],
          patients: count
        })));

        // Calculate severity distribution
        const severityCounts = {
          low: 0,
          medium: 0,
          high: 0,
          critical: 0
        };

        patients.forEach(patient => {
          severityCounts[patient.severity as keyof typeof severityCounts]++;
        });

        setSeverityData(Object.entries(severityCounts).map(([severity, count]) => ({
          severity,
          count
        })));

        setLoading(false);
      } catch (error) {
        console.error('Error fetching analytics:', error);
        setLoading(false);
      }
    }

    fetchAnalytics();
  }, []);

  if (loading) {
    return <div className="flex justify-center items-center h-full">Loading analytics...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-semibold text-gray-900 mb-6">Analytics Dashboard</h1>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-3 mb-8">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Users className="h-6 w-6 text-gray-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Total Patients Today</dt>
                  <dd className="text-2xl font-semibold text-gray-900">{patientStats.totalToday}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Clock className="h-6 w-6 text-gray-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Average Wait Time</dt>
                  <dd className="text-2xl font-semibold text-gray-900">{patientStats.averageWaitTime} min</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <AlertTriangle className="h-6 w-6 text-red-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Critical Cases</dt>
                  <dd className="text-2xl font-semibold text-gray-900">{patientStats.criticalCases}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Hourly Patient Distribution</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={hourlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="hour" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="patients" stroke="#3b82f6" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Case Severity Distribution</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={severityData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="severity" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="count" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Weekly Patient Distribution</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="patients" fill="#10b981" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}