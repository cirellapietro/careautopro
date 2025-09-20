-- Creiamo un tipo di veicolo "Generico" che useremo come default
INSERT INTO "TipoVeicoli" (tipoveicolo_id, descrizione) VALUES 
('default-tipo', 'Generico')
ON CONFLICT (tipoveicolo_id) DO NOTHING;