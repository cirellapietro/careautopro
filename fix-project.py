cat > fix-project.py << 'EOF'
#!/usr/bin/env python3
"""
Script SEMPLIFICATO per aggiornare careautopro
"""

import os
import json

print("🔧 Inizio aggiornamento careautopro...")

# 1. Crea cartelle necessarie
folders = ["src/utils", "src/hooks", "src/context", "public/icons"]
for folder in folders:
    os.makedirs(folder, exist_ok=True)
    print(f"✅ Creata: {folder}")

# 2. Crea advancedSupabase.js
supabase_content = '''// CONFIGURAZIONE SUPABASE AVANZATA
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export const VEHICLE_TYPES = {
  CAR: { name: 'Auto', intervals: { oil: 15000, brakes: 30000 } },
  MOTORCYCLE: { name: 'Moto', intervals: { oil: 5000, chain: 1000 } },
  VAN: { name: 'Furgone', intervals: { oil: 10000, brakes: 25000 } }
}

export const advancedTracking = {
  getPlatform: () => {
    return (window.matchMedia('(display-mode: standalone)').matches) ? 'pwa' : 'web'
  }
}
'''

with open('src/utils/advancedSupabase.js', 'w') as f:
    f.write(supabase_content)
print("✅ advancedSupabase.js creato")

print("🎉 FASE 1 COMPLETATA!")
print("File creati: src/utils/advancedSupabase.js")
EOF
