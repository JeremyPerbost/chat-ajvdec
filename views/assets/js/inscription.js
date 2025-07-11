const form = document.getElementById('inscriptionForm');
const messageDiv = document.getElementById('message');

// Fonction pour afficher les messages
function showMessage(message, type) {
    messageDiv.textContent = message;
    messageDiv.className = `message ${type}`;
    messageDiv.style.display = 'block';
    // Masquer le message après 5 secondes
    setTimeout(() => {
        messageDiv.style.display = 'none';
    }, 5000);
}

// Gestionnaire de soumission du formulaire
form.addEventListener('submit', async function(e) {
    e.preventDefault(); // Empêcher le rechargement de la page

    // Récupérer les valeurs du formulaire
    const pseudo = document.getElementById('pseudo').value.trim();
    const password = document.getElementById('password').value.trim();

    // Validation simple
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

    // Désactiver le bouton pendant la requête
    const submitButton = form.querySelector('button[type="submit"]');
    submitButton.disabled = true;
    submitButton.textContent = 'Inscription en cours...';

    try {
        // Envoyer la requête à l'API
        const response = await fetch('/api/user', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                pseudo: pseudo,
                password: password
            })
        });

        const data = await response.json();

        if (response.ok) {
            // Succès
            showMessage('Inscription réussie ! Bienvenue ' + pseudo + ' !', 'success');
            
            // Réinitialiser le formulaire
            form.reset();
            
            // Rediriger vers la page d'accueil après 2 secondes
            setTimeout(() => {
                window.location.href = '/';
            }, 2000);
        } else {
            // Erreur côté serveur
            showMessage(data.message || 'Erreur lors de l\'inscription', 'error');
        }
    } catch (error) {
        console.error('Erreur:', error);
        showMessage('Erreur de connexion au serveur', 'error');
    } finally {
        // Réactiver le bouton
        submitButton.disabled = false;
        submitButton.textContent = 'S\'inscrire';
    }
});

