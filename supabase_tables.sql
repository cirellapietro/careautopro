-- Tabella viaggi
CREATE TABLE trips (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  vehicle_id UUID REFERENCES veicoli(id) ON DELETE CASCADE,
  start_time TIMESTAMP WITH TIME ZONE NOT NULL,
  end_time TIMESTAMP WITH TIME ZONE,
  distance_km DECIMAL(10,2) DEFAULT 0,
  duration_minutes INTEGER DEFAULT 0,
  status TEXT DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_id UUID REFERENCES auth.users(id)
);

-- Tabella posizioni GPS
CREATE TABLE trip_positions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  trip_id UUID REFERENCES trips(id) ON DELETE CASCADE,
  latitude DECIMAL(10,8) NOT NULL,
  longitude DECIMAL(11,8) NOT NULL,
  recorded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Abilita RLS
ALTER TABLE trips ENABLE ROW LEVEL SECURITY;
ALTER TABLE trip_positions ENABLE ROW LEVEL SECURITY;

-- Policies per sicurezza
CREATE POLICY "Users can manage own trips" ON trips
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own trip positions" ON trip_positions
  FOR ALL USING (
    EXISTS (SELECT 1 FROM trips WHERE trips.id = trip_id AND trips.user_id = auth.uid())
  );
