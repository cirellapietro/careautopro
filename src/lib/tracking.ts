import { SupabaseClient } from "@supabase/supabase-js";

export async function getActiveVehicle(
  supabase: SupabaseClient,
  profiloutente_id: string
) {
  const { data, error } = await supabase
    .from("utentiprofilo")
    .select(`
      veicolo_tracciato_id,
      veicoli (
        veicolo_id,
        nomeveicolo,
        targa,
        kmattuali,
        kmdagps,
        ultimo_aggiornamento_tracking
      )
    `)
    .eq("profiloutente_id", profiloutente_id)
    .single();

  if (error) throw error;
  return data;
}