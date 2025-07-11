const form = document.getElementById('connexionForm');
const messageDiv = document.getElementById('message');
function showMessage(message, type) {
    messageDiv.textContent = message;
    messageDiv.className = `message ${type}`;
    messageDiv.style.display = 'block';
    // Masquer le message après 5 secondes
    setTimeout(() => {
        messageDiv.style.display = 'none';
    }, 5000);
}
form.addEventListener('submit', async function(e) {
    e.preventDefault(); // Empêcher le rechargement de la page
    const pseudo = document.getElementById('pseudo').value.trim();//.trim pour supprimer espaces blancs
    const password = document.getElementById('password').value.trim();
    if (!pseudo || !password) {
        showMessage('Veuillez remplir tous les champs', 'error');
        return;
    }
    if (pseudo.length < 3) {
        showMessage('Le pseudo doit contenir au moins 3 caractères', 'error');
        return;
    }
    if (password.length < 4) {
        showMessage('Le mot de passe doit contenir au moins 4 caractères', 'error');
        return;
    }
    const submitButton = form.querySelector('button[type="submit"]');
    submitButton.disabled = true;
    submitButton.textContent = 'Connexion en cours...';

    try {
        console.log('Tentative de connexion pour:', pseudo);
        
        const response = await fetch('/api/user/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                pseudo: pseudo,
                password: password
            })
        });

        console.log('Réponse reçue:', response.status, response.statusText);
        
        // Vérifier si la réponse est du JSON
        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
            throw new Error('Réponse non-JSON reçue du serveur');
        }

        const data = await response.json();
        console.log('Données reçues:', data);

        if (response.ok) {
            // Sauvegarder le token et les infos utilisateur
            localStorage.setItem('authToken', data.data.token);
            localStorage.setItem('userPseudo', data.data.user.pseudo);
            localStorage.setItem('userId', data.data.user.id);
            
            showMessage('Connexion réussie ! Bienvenue ' + data.data.user.pseudo + ' !', 'success');
            form.reset();
            setTimeout(() => {
                window.location.href = '/';
            }, 2000);
        } else {
            showMessage(data.message || 'Erreur lors de la connexion', 'error');
        }
    } catch (error) {
        console.error('Erreur:', error);
        showMessage('Erreur de connexion au serveur', 'error');
    } finally {
        // Réactiver le bouton
        submitButton.disabled = false;
        submitButton.textContent = 'Se connecter';
    }
});

