/*
  # Healthcare App Database Schema

  1. New Tables
    - `patients`
      - `id` (uuid, primary key, references auth.users)
      - `full_name` (text)
      - `phone` (text)
      - `date_of_birth` (date)
      - `blood_group` (text)
      - `emergency_contact` (text)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
    
    - `doctors`
      - `id` (uuid, primary key)
      - `name` (text)
      - `specialization` (text)
      - `phone` (text)
      - `email` (text)
      - `address` (text)
      - `latitude` (decimal)
      - `longitude` (decimal)
      - `timings` (text)
      - `created_at` (timestamptz)
    
    - `medicine_searches`
      - `id` (uuid, primary key)
      - `patient_id` (uuid, references patients)
      - `medicine_name` (text)
      - `search_date` (timestamptz)

  2. Security
    - Enable RLS on all tables
    - Patients can only read/update their own data
    - Everyone can read doctors data
    - Only authenticated users can search medicines
*/

CREATE TABLE IF NOT EXISTS patients (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text NOT NULL,
  phone text,
  date_of_birth date,
  blood_group text,
  emergency_contact text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS doctors (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  specialization text NOT NULL,
  phone text NOT NULL,
  email text,
  address text NOT NULL,
  latitude decimal(10, 8),
  longitude decimal(11, 8),
  timings text NOT NULL,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS medicine_searches (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id uuid REFERENCES patients(id) ON DELETE CASCADE,
  medicine_name text NOT NULL,
  search_date timestamptz DEFAULT now()
);

ALTER TABLE patients ENABLE ROW LEVEL SECURITY;
ALTER TABLE doctors ENABLE ROW LEVEL SECURITY;
ALTER TABLE medicine_searches ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Patients can read own data"
  ON patients FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Patients can insert own data"
  ON patients FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Patients can update own data"
  ON patients FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Anyone can read doctors"
  ON doctors FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Patients can read own medicine searches"
  ON medicine_searches FOR SELECT
  TO authenticated
  USING (patient_id = auth.uid());

CREATE POLICY "Patients can insert own medicine searches"
  ON medicine_searches FOR INSERT
  TO authenticated
  WITH CHECK (patient_id = auth.uid());

INSERT INTO doctors (name, specialization, phone, email, address, latitude, longitude, timings) VALUES
('Dr. Rajesh Kumar', 'General Physician', '+91-9876543210', 'dr.rajesh@clinic.com', 'MG Road, Bangalore, Karnataka', 12.9716, 77.5946, 'Mon-Sat: 9AM-2PM, 5PM-8PM'),
('Dr. Priya Sharma', 'Cardiologist', '+91-9876543211', 'dr.priya@heart.com', 'Connaught Place, New Delhi', 28.6315, 77.2167, 'Mon-Fri: 10AM-1PM, 4PM-7PM'),
('Dr. Amit Patel', 'Pediatrician', '+91-9876543212', 'dr.amit@kids.com', 'Andheri West, Mumbai, Maharashtra', 19.1136, 72.8697, 'Mon-Sat: 8AM-12PM, 6PM-9PM'),
('Dr. Sneha Reddy', 'Dermatologist', '+91-9876543213', 'dr.sneha@skin.com', 'Banjara Hills, Hyderabad, Telangana', 17.4065, 78.4772, 'Tue-Sun: 10AM-2PM, 5PM-8PM'),
('Dr. Vikram Singh', 'Orthopedic', '+91-9876543214', 'dr.vikram@bones.com', 'Park Street, Kolkata, West Bengal', 22.5726, 88.3639, 'Mon-Sat: 9AM-1PM, 4PM-7PM');
