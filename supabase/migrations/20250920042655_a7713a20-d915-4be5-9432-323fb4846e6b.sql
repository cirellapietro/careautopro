-- Aggiungiamo alcuni tipi di veicolo di base per permettere l'inserimento
INSERT INTO "TipoVeicoli" (descrizione) VALUES 
('Auto'),
('Moto'),
('Furgone'),
('Camion'),
('Autobus'),
('Altro')
ON CONFLICT DO NOTHING;