// auth.js
// Gestione completa di registrazione, login e autenticazione con Supabase

document.addEventListener('DOMContentLoaded', function() {
    console.log('Auth.js caricato. Controllo sessione esistente...');
    checkCurrentSession();
});

// CONTROLLA SE L'UTENTE È GIÀ LOGGATO
async function checkCurrentSession() {
    const { data, error } = await window.supabaseClient.auth.getSession();
    
    if (error) {
        console.error('Errore controllo sessione:', error);
        return;
    }
    
    if (data.session) {
        console.log('Sessione trovata, reindirizzamento a dashboard...');
        window.location.href = 'dashboard.html';
    }
}

// REGISTRAZIONE CON EMAIL/PASSWORD
async function handleEmailSignUp() {
    const email = document.getElementById('email').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const nominativo = document.getElementById('nominativo').value.trim();
    const password = document.getElementById('password').value;
    
    // Validazione: almeno un campo tra email, phone, nominativo
    if (!email && !phone && !nominativo) {
        alert('Inserisci almeno un campo tra Email, Cellulare o Nominativo.');
        return;
    }
    
    if (!password || password.length < 6) {
        alert('La password è obbligatoria e deve essere di almeno 6 caratteri.');
        return;
    }
    
    try {
        // 1. Registra l'utente in Supabase Auth (richiede email)
        // Se non ha email, usiamo un placeholder ma DOVRAI gestire questo caso diversamente in produzione
        const authEmail = email || `temp_${Date.now()}@careautopro.temp`;
        
        const { data: authData, error: authError } = await window.supabaseClient.auth.signUp({
            email: authEmail,
            password: password,
            options: {
                data: {
                    phone: phone || null,
                    full_name: nominativo || null,
                    // Usiamo l'email reale se c'è, altrimenti il primo campo compilato
                    display_name: nominativo || phone || email || 'Utente'
                }
            }
        });
        
        if (authError) throw authError;
        
        // 2. Se la registrazione è ok, salva i dati nella TABELLA PUBBLICA 'utenti'
        if (authData.user) {
            const { error: dbError } = await window.supabaseClient
                .from('utenti')
                .upsert({
                    utente_id: authData.user.id, // Stesso ID di auth.users
                    email: email || null,
                    phone: phone || null,
                    nominativo: nominativo || null,
                    dataora: new Date().toISOString()
                }, {
                    onConflict: 'utente_id'
                });
            
            if (dbError) {
                console.warn('Utente creato in Auth ma errore su tabella pubblica:', dbError);
                // Non blocchiamo il flusso, l'utente può sincronizzarsi dopo
            }
        }
        
        alert('Registrazione completata! ' + 
              (email ? 'Controlla la tua email per confermare l\'account.' : 
              'Accedi con le tue credenziali.'));
        
        // Pulisci il form
        document.getElementById('authForm').reset();
        
    } catch (error) {
        console.error('Errore registrazione:', error);
        alert('Errore durante la registrazione: ' + error.message);
    }
}

// LOGIN CON EMAIL/PASSWORD
async function handleEmailLogin() {
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    
    if (!email) {
        alert('Per accedere, inserisci la tua email.');
        return;
    }
    
    if (!password) {
        alert('Inserisci la password.');
        return;
    }
    
    try {
        const { data, error } = await window.supabaseClient.auth.signInWithPassword({
            email: email,
            password: password
        });
        
        if (error) throw error;
        
        alert('Accesso riuscito!');
        window.location.href = 'dashboard.html';
        
    } catch (error) {
        console.error('Errore login:', error);
        alert('Accesso fallito: ' + error.message);
    }
}

// LOGIN CON GOOGLE
async function signInWithGoogle() {
    try {
        const { data, error } = await window.supabaseClient.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: window.location.origin + '/dashboard.html'
            }
        });
        
        if (error) throw error;
        
    } catch (error) {
        console.error('Errore login Google:', error);
        alert('Errore accesso Google: ' + error.message);
    }
}

// LOGOUT
async function handleLogout() {
    const { error } = await window.supabaseClient.auth.signOut();
    if (error) {
        console.error('Errore logout:', error);
    } else {
        window.location.href = 'login.html';
    }
}

// FUNZIONI AUSILIARIE
function switchToLogin() {
    const title = document.querySelector('.login-header h1');
    const registerLink = document.querySelector('.register-link');
    
    if (title && registerLink) {
        title.textContent = '# Accedi al tuo account!';
        registerLink.innerHTML = 'Non hai un account? <a href="#" onclick="switchToRegister()">Registrati qui</a>';
    }
}

function switchToRegister() {
    const title = document.querySelector('.login-header h1');
    const registerLink = document.querySelector('.register-link');
    
    if (title && registerLink) {
        title.textContent = '# Benvenuto!';
        registerLink.innerHTML = 'Hai già un account? <a href="#" onclick="switchToLogin()">Accedi qui</a>';
    }
}
