-- Ricreiamo le politiche per l'accesso ai veicoli
-- Prima rimuoviamo le politiche esistenti
DROP POLICY IF EXISTS "Veicoli_select_policy" ON "Veicoli";
DROP POLICY IF EXISTS "Veicoli_insert_policy" ON "Veicoli";
DROP POLICY IF EXISTS "Veicoli_update_policy" ON "Veicoli";
DROP POLICY IF EXISTS "Veicoli_delete_policy" ON "Veicoli";

-- Ricreiamo le politiche per l'accesso ai veicoli
CREATE POLICY "Users can view their own vehicles" 
ON "Veicoli" 
FOR SELECT 
TO authenticated
USING (
  dataoraelimina IS NULL 
  AND (auth.uid() = utente_id OR is_admin(auth.uid()))
);

CREATE POLICY "Users can insert their own vehicles" 
ON "Veicoli" 
FOR INSERT 
TO authenticated
WITH CHECK (auth.uid() = utente_id OR is_admin(auth.uid()));

CREATE POLICY "Users can update their own vehicles" 
ON "Veicoli" 
FOR UPDATE 
TO authenticated
USING (auth.uid() = utente_id OR is_admin(auth.uid()));

CREATE POLICY "Users can delete their own vehicles" 
ON "Veicoli" 
FOR UPDATE 
TO authenticated
USING (auth.uid() = utente_id OR is_admin(auth.uid()));

-- Assicuriamoci che RLS sia abilitato
ALTER TABLE "Veicoli" ENABLE ROW LEVEL SECURITY;