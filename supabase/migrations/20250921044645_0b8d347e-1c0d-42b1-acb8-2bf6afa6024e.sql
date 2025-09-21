-- Ripristina la configurazione dell'API per esporre lo schema public
-- Questo dovrebbe risolvere l'errore PGRST106

-- Verifica la configurazione corrente di PostgREST
SELECT current_setting('pgrst.db_schemas') as current_exposed_schemas;

-- Se non è configurato correttamente, impostiamo lo schema public
-- Nota: questa configurazione potrebbe non essere persistente, potrebbe richiedere configurazione via dashboard