-- Creiamo un tipo di veicolo "Generico" con UUID valido
INSERT INTO "TipoVeicoli" (tipoveicolo_id, descrizione) VALUES 
(gen_random_uuid(), 'Generico');

-- Prendiamo l'ID del tipo "Generico" per usarlo come default
-- (lo useremo nel codice)