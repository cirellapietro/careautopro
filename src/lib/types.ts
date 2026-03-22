
export type NotificationChannel = 'app' | 'email' | 'sms' | 'whatsapp' | 'telegram' | 'facebook';

export type User = {
  uid: string; // Corresponds to Firebase user.uid
  displayName: string | null;
  email: string | null;
  photoURL: string | null;
  role: string;
  notificationChannels?: NotificationChannel[];
  notificationReminderTime?: number; // in days
  dataoraelimina?: string | null;
};

export type Role = {
  id: string;
  name: string;
  description?: string;
  dataoraelimina?: string | null;
};

export type VehicleType = {
    id: string;
    name: string;
    averageAnnualMileage: number;
    dataoraelimina?: string | null;
}

export type MaintenanceCheck = {
    id: string;
    vehicleTypeId: string;
    description: string;
    intervalMileage?: number;
    intervalTime?: number; // in months
    dataoraelimina?: string | null;
}

export type Vehicle = {
  id: string;
  userId: string;
  name: string;
  make?: string;
  model?: string;
  registrationDate: string;
  vin?: string;
  licensePlate: string;
  imageUrl?: string;
  imageHint?: string;
  type: string;
  vehicleTypeId: string;
  currentMileage: number;
  lastMaintenanceDate: string;
  createdAt?: string;
  dataoraelimina?: string | null;
  isTaxi?: boolean;
  trackingGPS?: boolean;
  // Automations
  autoHotspotEnabled?: boolean;
  autoTrackingEnabled?: boolean;
  bluetoothMacAddress?: string;
  bluetoothDeviceName?: string;
};

export type MaintenanceIntervention = {
  id: string;
  vehicleId: string;
  description: string;
  scheduledDate?: string;
  completionDate?: string;
  status: 'Richiesto' | 'Pianificato' | 'Completato';
  cost?: number;
  notes?: string;
  urgency: 'Alta' | 'Media' | 'Bassa';
  dataoraelimina?: string | null;
};

export type DrivingSession = {
  id: string;
  vehicleId: string;
  startTime: string;
  endTime?: string;
  distance: number;
  duration: number; // in minutes
  dataoraelimina?: string | null;
};

export type DailyStat = {
  vehicleId: string;
  date: string;
  distance: number;
  duration: number; // in minutes
  dataoraelimina?: string | null;
};
