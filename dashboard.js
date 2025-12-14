// dashboard.js
// Protezione della dashboard e gestione sessione

document.addEventListener('DOMContentLoaded', async function() {
    // 1. Controlla se l'utente è autenticato
    const { data, error } = await window.supabaseClient.auth.getSession();
    
    if (error) {
        console.error('Errore controllo sessione:', error);
        window.location.href = 'login.html';
        return;
    }
    
    if (!data.session) {
        // Nessuna sessione, reindirizza al login
        window.location.href = 'login.html';
        return;
    }
    
    // 2. Utente autenticato - mostra informazioni
    const user = data.session.user;
    console.log('Utente loggato:', user);
    
    // Mostra il nome utente nella dashboard
    const userNameElement = document.getElementById('userName');
    if (userNameElement) {
        const displayName = user.user_metadata?.full_name || 
                           user.user_metadata?.display_name || 
                           user.email?.split('@')[0] || 
                           'Utente';
        userNameElement.textContent = displayName;
    }
    
    // 3. Configura il pulsante di logout
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', async function() {
            const { error } = await window.supabaseClient.auth.signOut();
            if (error) {
                console.error('Errore logout:', error);
                alert('Errore durante il logout.');
            } else {
                window.location.href = 'login.html';
            }
        });
    }
    
    // 4. Chiedi se vuole registrare un viaggio (funzionalità futura)
    setTimeout(() => {
        const startTrip = confirm('Vuoi registrare un viaggio con questo veicolo?');
        if (startTrip) {
            // Qui implementerai la logica per avviare il tracciamento GPS
            alert('Funzionalità di tracciamento viaggio in sviluppo...');
        }
    }, 1000);
});
