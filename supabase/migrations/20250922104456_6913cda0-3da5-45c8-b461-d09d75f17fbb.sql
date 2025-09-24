-- Move the RPC function to the api schema
CREATE OR REPLACE FUNCTION api.get_user_vehicles(user_id uuid)
 RETURNS TABLE(veicolo_id uuid, nomeveicolo text, targa text, kmattuali integer, dataimmatricolazione date, tipoveicolo_id uuid, utente_id uuid, kmanno integer, cilindrata integer, kw integer, dataora timestamp with time zone, dataoraelimina timestamp with time zone)
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
BEGIN
    RETURN QUERY
    SELECT 
        v.veicolo_id,
        v.nomeveicolo,
        v.targa,
        v.kmattuali,
        v.dataimmatricolazione,
        v.tipoveicolo_id,
        v.utente_id,
        v.kmanno,
        v.cilindrata,
        v.kw,
        v.dataora,
        v.dataoraelimina
    FROM "veicoli" v
    WHERE v.utente_id = get_user_vehicles.user_id
    AND v.dataoraelimina IS NULL
    ORDER BY v.dataora DESC;
END;
$function$