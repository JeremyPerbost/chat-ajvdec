// Vérifier le statut de connexion au chargement de la page
document.addEventListener('DOMContentLoaded', function() {
    checkAuthStatus();
    setupChat();
});

function checkAuthStatus() {
    const token = localStorage.getItem('authToken');
    const userPseudo = localStorage.getItem('userPseudo');
    const statutElement = document.getElementById('statut');
    if (token && userPseudo) {
        // Vérifier si le token est encore valide
        verifyToken(token).then(isValid => {
            if (isValid) {
                // Utilisateur connecté
                statutElement.innerHTML = `STATUT : <span style="color: green;">Connecter </span> | <button onclick="logout()" style="color: red; background: none; border: none; cursor: pointer;">Se déconnecter</button>`;
                
                // Masquer les boutons inscription/connexion
                const btnInscription = document.getElementById('btn_inscription');
                const btnConnexion = document.getElementById('btn_connexion');
                if (btnInscription) btnInscription.style.display = 'none';
                if (btnConnexion) btnConnexion.style.display = 'none';
                
                // Afficher la zone de chat
                const chatContainer = document.getElementById('chat-container');
                if (chatContainer) {
                    chatContainer.style.display = 'block';
                    loadMessages();
                }
            } else {
                // Token invalide
                logout();
            }
        });
    } else {
        // Utilisateur non connecté
        statutElement.innerHTML = 'STATUT : <span style="color: red;">Non connecté</span>';
        
        // Masquer la zone de chat
        const chatContainer = document.getElementById('chat-container');
        if (chatContainer) {
            chatContainer.style.display = 'none';
        }
    }
}

async function verifyToken(token) {
    try {
        const response = await fetch('/api/user/verify', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        return response.ok;
    } catch (error) {
        console.error('Erreur lors de la vérification du token:', error);
        return false;
    }
}

function logout() {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userPseudo');
    localStorage.removeItem('userId');
    window.location.reload();
}

// Configuration du chat
function setupChat() {
    const messageInput = document.getElementById('message-input');
    const sendButton = document.getElementById('send-button');
    
    if (messageInput && sendButton) {
        // Envoyer le message avec le bouton
        sendButton.addEventListener('click', sendMessage);
        
        // Envoyer le message avec Entrée
        messageInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                sendMessage();
            }
        });
    }
}

async function sendMessage() {
    const messageInput = document.getElementById('message-input');
    const message = messageInput.value.trim();
    
    if (!message) {
        alert('Veuillez taper un message');
        return;
    }
    
    const token = localStorage.getItem('authToken');
    if (!token) {
        alert('Vous devez être connecté pour envoyer un message');
        return;
    }
    
    try {
        const response = await fetch('/api/message', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                contenu: message
            })
        });
        
        if (response.ok) {
            messageInput.value = '';
            loadMessages(); // Recharger les messages
        } else {
            const error = await response.json();
            alert('Erreur lors de l\'envoi du message: ' + error.message);
        }
    } catch (error) {
        console.error('Erreur lors de l\'envoi du message:', error);
        alert('Erreur de connexion');
    }
}

async function loadMessages() {
    const token = localStorage.getItem('authToken');
    if (!token) return;
    
    try {
        const response = await fetch('/api/messages', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        if (response.ok) {
            const data = await response.json();
            displayMessages(data.data);
        }
    } catch (error) {
        console.error('Erreur lors du chargement des messages:', error);
    }
}

function displayMessages(messages) {
    const messagesContainer = document.getElementById('messages-container');
    if (!messagesContainer) return;
    
    messagesContainer.innerHTML = '';
    
    // Récupérer l'ID de l'utilisateur connecté
    const currentUserId = localStorage.getItem('userId');
    
    messages.forEach(message => {
        const messageDiv = document.createElement('div');
        
        // Déterminer si c'est un message de l'utilisateur connecté
        const isCurrentUser = message.user_id && currentUserId && message.user_id.toString() === currentUserId.toString();
        
        // Appliquer la classe appropriée
        messageDiv.className = isCurrentUser ? 'message-user' : 'message-other';
        
        const date = new Date(message.created_at).toLocaleString('fr-FR');
        
        messageDiv.innerHTML = `
            <div class="message-header">${message.pseudo} • ${date}</div>
            <div class="message-content">${escapeHtml(message.contenu)}</div>
        `;
        
        messagesContainer.appendChild(messageDiv);
    });
    
    // Scroll vers le bas pour voir le dernier message
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Recharger les messages toutes les 5 secondes
setInterval(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
        loadMessages();
    }
}, 5000);