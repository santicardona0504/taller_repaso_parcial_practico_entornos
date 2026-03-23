// Elementos del DOM
const messageForm = document.getElementById('messageForm');
const messageInput = document.getElementById('messageInput');
const sendButton = document.getElementById('sendButton');
const chatMessages = document.getElementById('chatMessages');
const errorMessage = document.getElementById('errorMessage');

// URL del backend (ajustar según sea necesario)
const BACKEND_URL = 'http://localhost:8000';

// Evento al hacer submit del formulario
messageForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const userMessage = messageInput.value.trim();

    if (!userMessage) {
        showError('Por favor, escribe un mensaje');
        return;
    }

    // Agregar mensaje del usuario al chat
    addMessageToChat(userMessage, 'user');
    messageInput.value = '';
    messageInput.focus();

    // Deshabilitar botón mientras se procesa
    sendButton.disabled = true;

    // Mostrar indicador de escritura
    const loadingId = showLoadingIndicator();

    try {
        // Enviar mensaje al backend
        const response = await fetch(`${BACKEND_URL}/chat`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ message: userMessage }),
        });

        // Remover indicador de escritura
        removeLoadingIndicator(loadingId);

        // Verificar si la respuesta es OK
        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status}`);
        }

        const data = await response.json();

        // Manejar la respuesta según el status
        if (data.status === 'success') {
            clearError();
            addMessageToChat(data.bot_response, 'bot');
        } else if (data.status === 'error') {
            removeLoadingIndicator(loadingId);
            showError(data.error || 'Ocurrió un error al procesar tu mensaje');
            addMessageToChat(`Error: ${data.error}`, 'error');
        }
    } catch (error) {
        // Remover indicador de escritura en caso de error
        removeLoadingIndicator(loadingId);

        // Manejar errores de conexión o de parseo
        const errorMsg =
            error instanceof TypeError
                ? 'No se pudo conectar al servidor. ¿Está ejecutando FastAPI?'
                : error.message;

        showError(errorMsg);
        console.error('Error:', error);
    } finally {
        // Rehabilitar botón
        sendButton.disabled = false;
    }
});

/**
 * Agrega un mensaje al chat
 * @param {string} message - El contenido del mensaje
 * @param {string} type - El tipo de mensaje ('user', 'bot', 'error')
 */
function addMessageToChat(message, type) {
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('message', type);

    const messageContent = document.createElement('div');
    messageContent.classList.add('message-content');

    // Formatear el mensaje (convertir saltos de línea)
    messageContent.textContent = message;

    messageDiv.appendChild(messageContent);
    chatMessages.appendChild(messageDiv);

    // Auto-scroll al último mensaje
    scrollToBottom();
}

/**
 * Muestra un indicador de carga (puntos animados)
 * @returns {number} ID del elemento de carga para poder removerlo después
 */
function showLoadingIndicator() {
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('message', 'bot');
    messageDiv.id = 'loading-indicator';

    const messageContent = document.createElement('div');
    messageContent.classList.add('message-content', 'loading');

    messageContent.innerHTML = '<span></span><span></span><span></span>';

    messageDiv.appendChild(messageContent);
    chatMessages.appendChild(messageDiv);

    scrollToBottom();
    return messageDiv.id;
}

/**
 * Remueve el indicador de carga
 * @param {number} loadingId - El ID del elemento de carga
 */
function removeLoadingIndicator(loadingId) {
    const loadingElement = document.getElementById(loadingId);
    if (loadingElement) {
        loadingElement.remove();
    }
}

/**
 * Muestra un mensaje de error
 * @param {string} message - El mensaje de error
 */
function showError(message) {
    errorMessage.textContent = message;
    errorMessage.classList.add('show');
}

/**
 * Limpia el mensaje de error
 */
function clearError() {
    errorMessage.textContent = '';
    errorMessage.classList.remove('show');
}

/**
 * Hace scroll automático al último mensaje
 */
function scrollToBottom() {
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Permitir enviar con Enter (pero no con Shift+Enter para permitir nuevas líneas)
messageInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        messageForm.dispatchEvent(new Event('submit'));
    }
});

// Auto-focus en el input al cargar la página
window.addEventListener('load', () => {
    messageInput.focus();
});
