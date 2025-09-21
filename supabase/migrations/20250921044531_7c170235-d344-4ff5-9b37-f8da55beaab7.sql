-- Configurazione per esporre lo schema public nell'API PostgREST
-- Questo risolverà l'errore PGRST106

-- Esponi lo schema public per l'API REST
NOTIFY pgrst, 'reload schema';

-- Assicuriamoci che lo schema public sia configurato correttamente
-- Verifica che le tabelle siano accessibili via API
SELECT schemaname, tablename 
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename IN ('Veicoli', 'Utenti', 'TipoVeicoli');