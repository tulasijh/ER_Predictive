import { Patient, Staff, Department } from '../types';
import { mockStaff, mockDepartments, generateMockPatients } from './mockData';
import { secureStorage } from './secureStorage';

const STORAGE_KEYS = {
  PATIENTS: 'er_patients',
  STAFF: 'er_staff',
  DEPARTMENTS: 'er_departments',
  USERS: 'er_users',
  CURRENT_USER: 'er_current_user'
};

interface User extends Staff {
  password: string;
}

// Initialize storage with mock data
const initializeStorage = () => {
  try {
    // Clear any potentially corrupted data
    secureStorage.clear();
    
    // Set up mock data
    secureStorage.setItem(STORAGE_KEYS.STAFF, mockStaff);
    secureStorage.setItem(STORAGE_KEYS.DEPARTMENTS, mockDepartments);
    secureStorage.setItem(STORAGE_KEYS.PATIENTS, generateMockPatients(100));
    
    // Initialize empty users array
    secureStorage.setItem(STORAGE_KEYS.USERS, []);
    
    return true;
  } catch (error) {
    console.error('Error initializing storage:', error);
    return false;
  }
};

export const localDataService = {
  // User methods
  createUser: async (userData: Omit<Staff, 'id'> & { password: string }): Promise<boolean> => {
    try {
      const users = secureStorage.getItem(STORAGE_KEYS.USERS) || [];
      
      if (users.some((user: User) => user.email === userData.email)) {
        throw new Error('Email already exists');
      }

      const newUser: User = {
        ...userData,
        id: Math.random().toString(36).substr(2, 9),
        schedule: []
      };

      users.push(newUser);
      secureStorage.setItem(STORAGE_KEYS.USERS, users);
      return true;
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  },

  login: async (email: string, password: string): Promise<boolean> => {
    try {
      // Initialize storage with fresh data
      initializeStorage();

      // Check mock staff first (for demo accounts)
      const mockUser = mockStaff.find(u => u.email === email && u.password === password);
      if (mockUser) {
        const { password: _, ...userWithoutPassword } = mockUser;
        secureStorage.setItem(STORAGE_KEYS.CURRENT_USER, userWithoutPassword);
        return true;
      }

      // Then check regular users
      const users = secureStorage.getItem(STORAGE_KEYS.USERS) || [];
      const user = users.find((u: User) => u.email === email && u.password === password);
      
      if (user) {
        const { password: _, ...userWithoutPassword } = user;
        secureStorage.setItem(STORAGE_KEYS.CURRENT_USER, userWithoutPassword);
        return true;
      }

      return false;
    } catch (error) {
      console.error('Error during login:', error);
      return false;
    }
  },

  getCurrentUser: (): Staff | null => {
    try {
      const user = secureStorage.getItem(STORAGE_KEYS.CURRENT_USER);
      return user || null;
    } catch (error) {
      console.error('Error getting current user:', error);
      return null;
    }
  },

  logout: (): void => {
    secureStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
  },

  // Patient methods
  getPatients: (): Patient[] => {
    const patients = secureStorage.getItem(STORAGE_KEYS.PATIENTS);
    return patients || generateMockPatients(100);
  },

  setPatients: (patients: Patient[]) => {
    secureStorage.setItem(STORAGE_KEYS.PATIENTS, patients);
  },

  // Staff methods
  getStaff: (): Staff[] => {
    const staff = secureStorage.getItem(STORAGE_KEYS.STAFF);
    return staff || mockStaff;
  },

  setStaff: (staff: Staff[]) => {
    secureStorage.setItem(STORAGE_KEYS.STAFF, staff);
  },

  // Department methods
  getDepartments: (): Department[] => {
    const departments = secureStorage.getItem(STORAGE_KEYS.DEPARTMENTS);
    return departments || mockDepartments;
  },

  setDepartments: (departments: Department[]) => {
    secureStorage.setItem(STORAGE_KEYS.DEPARTMENTS, departments);
  },

  // Reset all data
  resetStorage: (): void => {
    initializeStorage();
  }
};