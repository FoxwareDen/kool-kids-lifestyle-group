
export interface Unit {
    id: string;
    label: string;
    capacity: number;
    duration: number;
} 

export interface Calendar {
  start_date: string;
  end_date?: string;
  start_time: string;
  end_time: string;
  days_of_weeK: number[];
  frequency?: "weekly";
  buffer_minutes: number;
}