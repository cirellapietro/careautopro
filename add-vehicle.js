// add-vehicle.js - Versione corretta per Supabase

document.addEventListener('DOMContentLoaded', async function() {
    console.log('Pagina aggiunta veicolo caricata');
    
    // 1. Controlla autenticazione
    const { data: sessionData } = await window.supabaseClient.auth.getSession();
    if (!sessionData.session) {
        alert('Devi essere loggato per aggiungere un veicolo.');
        window.location.href = 'login.html';
        return;
    }
    
    const userId = sessionData.session.user.id;
    console.log('ID utente corrente:', userId);
    
    // 2. Popola la select combo dei tipi veicolo
    await populateVehicleTypes();
    
    // 3. Configura l'invio del form
    setupFormSubmission(userId);
});

async function populateVehicleTypes() {
    const selectElement = document.getElementById('tipoveicolo_id');
    if (!selectElement) {
        console.error('Elemento select non trovato!');
        return;
    }
    
    try {
        // Query a Supabase per tipi veicolo non eliminati
        const { data, error } = await window.supabaseClient
            .from('tipoveicoli')
            .select('tipoveicolo_id, descrizione')
            .is('dataoraelimina', null)
            .order('descrizione');
        
        if (error) throw error;
        
        // Pulisci e popola la select
        selectElement.innerHTML = '<option value="">-- Seleziona un tipo --</option>';
        
        data.forEach(type => {
            const option = document.createElement('option');
            option.value = type.tipoveicolo_id;
            option.textContent = type.descrizione;
            selectElement.appendChild(option);
        });
        
        console.log('Tipi veicolo caricati:', data.length);
        
    } catch (error) {
        console.error('Errore caricamento tipi veicolo:', error);
        selectElement.innerHTML = '<option value="">Errore nel caricamento</option>';
        alert('Impossibile caricare i tipi veicolo. Ricarica la pagina.');
    }
}

function setupFormSubmission(userId) {
    const form = document.getElementById('addVehicleForm');
    if (!form) {
        console.error('Form non trovato!');
        return;
    }
    
    form.addEventListener('submit', async function(event) {
        event.preventDefault();
        
        // Raccoglie i dati dal form
        const formData = {
            nomeveicolo: document.getElementById('nomeveicolo').value.trim(),
            tipoveicolo_id: document.getElementById('tipoveicolo_id').value,
            targa: document.getElementById('targa').value.trim() || null,
            dataimmatricolazione: document.getElementById('dataimmatricolazione').value || null,
            kmattuali: document.getElementById('kmattuali').value ? parseInt(document.getElementById('kmattuali').value) : null,
            utente_id: userId, // Collegamento all'utente
            dataora: new Date().toISOString()
        };
        
        // Validazione
        if (!formData.nomeveicolo) {
            alert('Il Nome Veicolo è obbligatorio.');
            return;
        }
        if (!formData.tipoveicolo_id) {
            alert('Seleziona un Tipo Veicolo.');
            return;
        }
        
        try {
            // Inserimento in Supabase
            const { data, error } = await window.supabaseClient
                .from('veicoli')
                .insert([formData])
                .select();
            
            if (error) throw error;
            
            console.log('Veicolo inserito con successo:', data);
            alert('Veicolo salvato con successo!');
            
            // Reindirizza alla dashboard o alla lista veicoli
            window.location.href = 'dashboard.html';
            
        } catch (error) {
            console.error('Errore durante il salvataggio:', error);
            alert('Errore nel salvataggio del veicolo: ' + error.message);
        }
    });
}
