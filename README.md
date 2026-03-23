# 💬 ChatBot con FastAPI y Gemini API

Un chatbot completo con frontend puro (HTML, CSS, JavaScript) y backend en FastAPI que se conecta con la API de Google Gemini.

## 🚀 Características

- **Frontend moderno**: HTML5, CSS3 y JavaScript vanilla (sin frameworks)
- **Backend robusto**: FastAPI con manejo de errores
- **API Gemini**: Integración con Google Gemini para respuestas IA
- **CORS habilitado**: Comunicación cliente-servidor sin problemas
- **Validación**: Mensajes de error claros y manejo de excepciones
- **Responsive**: Interfaz adaptable a dispositivos móviles

## 📋 Requisitos Previos

- Python 3.8+
- pip (gestor de paquetes de Python)
- Una API key de Google Gemini (obtén una en [Google AI Studio](https://makersuite.google.com/app/apikey))

## 🔧 Instalación

### 1. Clonar o descargar el proyecto

```bash
cd tu-directorio-del-proyecto
```

### 2. Crear un entorno virtual (recomendado)

```bash
python -m venv venv
```

**Activar el entorno virtual:**

**En Linux/Mac:**
```bash
source venv/bin/activate
```

**En Windows:**
```bash
venv\Scripts\activate
```

### 3. Instalar dependencias

```bash
pip install -r requirements.txt
```

### 4. Configurar variables de entorno

Crea un archivo `.env` en la raíz del proyecto con tu API key de Gemini:

```env
GEMINI_API_KEY=tu_api_key_aqui
```

## ▶️ Ejecutar el Proyecto

### 1. Iniciar el servidor FastAPI

```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

**Explicación de flags:**
- `--reload`: Reinicia el servidor automáticamente al cambiar el código
- `--host 0.0.0.0`: Escucha en todas las interfaces de red
- `--port 8000`: Puerto en el que corre el servidor

### 2. Abrir el frontend en el navegador

Simplemente abre el archivo `index.html` en tu navegador o accede a:
```
http://localhost:8000
```

**Nota:** El frontend también se puede servir desde cualquier servidor HTTP. Si prefieres usar Python:

```bash
python -m http.server 3000 --directory .
```

Luego accede a `http://localhost:3000`

## 📁 Estructura del Proyecto

```
.
├── main.py              # Backend FastAPI
├── index.html           # Frontend HTML
├── styles.css           # Estilos CSS
├── script.js            # Lógica JavaScript
├── requirements.txt     # Dependencias Python
├── .env                 # Variables de entorno (no subir a GitHub)
└── README.md           # Este archivo
```

## 🔌 Endpoints de la API

### GET /

Verifica que el servidor esté funcionando.

**Response:**
```json
{
  "mensaje": "¡Chatbot API funcionando!",
  "status": "online"
}
```

### POST /chat

Envía un mensaje y recibe respuesta de Gemini.

**Request:**
```json
{
  "message": "¿Cuál es la capital de Francia?"
}
```

**Response (Éxito):**
```json
{
  "status": "success",
  "user_message": "¿Cuál es la capital de Francia?",
  "bot_response": "La capital de Francia es París..."
}
```

**Response (Error):**
```json
{
  "status": "error",
  "error": "Descripción del error"
}
```

## 🛡️ Manejo de Errores

El proyecto maneja los siguientes tipos de errores:

- **API Key faltante**: Verifica que GEMINI_API_KEY esté configurada
- **Mensaje vacío**: Se valida que el usuario envíe texto
- **Error de conexión**: Se captura y comunica al usuario
- **Timeout**: Si la API tarda más de 30 segundos
- **Error de Gemini**: Si la API retorna un error

## 🧪 Pruebas Manuales

Puedes probar la API usando curl:

```bash
curl -X POST http://localhost:8000/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "Hola, ¿cómo estás?"}'
```

## 📝 Notas Importantes

1. **No subas tu `.env`** con la API key a GitHub. Usa `.gitignore`:
   ```
   .env
   venv/
   __pycache__/
   *.pyc
   ```

2. **CORS**: El servidor permite requests desde cualquier origen. En producción, restringe esto.

3. **Frontend**: El archivo `script.js` asume que el backend corre en `http://localhost:8000`. Cambia `BACKEND_URL` si es necesario.

4. **API Limit**: Gemini tiene límites de rate. Consulta la documentación de Google.

## 🚀 Despliegue en Producción

Para producción, considera:

- Usar un servidor ASGI como Gunicorn
- Configurar HTTPS
- Usar variables de entorno seguras
- Limitar CORS a dominios específicos
- Implementar autenticación
- Usar rate limiting

## 📖 Recursos

- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [Google Gemini API](https://ai.google.dev/tutorials/python_quickstart)
- [Uvicorn](https://www.uvicorn.org/)

## 📄 Licencia

Este proyecto es de código abierto.

---

**¿Preguntas?** Revisa los logs del servidor para más detalles sobre errores.
