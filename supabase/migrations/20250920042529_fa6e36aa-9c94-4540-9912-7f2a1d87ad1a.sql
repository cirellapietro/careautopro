-- Verifica e abilita l'accesso alla tabella Veicoli tramite API
-- Il problema sembra essere che l'API non riesce ad accedere alla tabella

-- Assicuriamoci che la tabella sia accessibile tramite l'API
-- Ricreiamo le politiche RLS per la tabella Veicoli se necessario

-- Prima rimuoviamo le politiche esistenti se ci sono problemi
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

-- Verifichiamo anche che la tabella Utenti abbia le politiche corrette
-- per permettere la creazione di profili utente
CREATE POLICY IF NOT EXISTS "Users can view their own profile" 
ON "Utenti" 
FOR SELECT 
TO authenticated
USING (
  dataoraelimina IS NULL 
  AND (auth.uid() = utente_id OR is_admin(auth.uid()))
);

CREATE POLICY IF NOT EXISTS "Users can insert their own profile" 
ON "Utenti" 
FOR INSERT 
TO authenticated
WITH CHECK (auth.uid() = utente_id OR is_admin(auth.uid()));

CREATE POLICY IF NOT EXISTS "Users can update their own profile" 
ON "Utenti" 
FOR UPDATE 
TO authenticated
USING (auth.uid() = utente_id OR is_admin(auth.uid()));

-- Abilita RLS per la tabella Utenti
ALTER TABLE "Utenti" ENABLE ROW LEVEL SECURITY;