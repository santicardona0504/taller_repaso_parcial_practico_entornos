from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Union
import os
import requests
from dotenv import load_dotenv
from fastapi.openapi.docs import get_swagger_ui_html




# 👇 Cargar variables de entorno
load_dotenv()

# 👇 Definir variables (AQUÍ ESTABA TU ERROR)
GEMINI_API_KEY= "AIzaSyBdJQQNLgXvZrnr5q_TOJjmdTPq15aJvm0"
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", GEMINI_API_KEY)  # Usa la variable de entorno o el valor por defecto

GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent"

app = FastAPI()

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Modelos
class MessageRequest(BaseModel):
    message: str

class MessageResponse(BaseModel):
    status: str
    user_message: str
    bot_response: str

class ErrorResponse(BaseModel):
    status: str
    error: str



@app.get("/docs", include_in_schema=False)
def custom_docs():
    return get_swagger_ui_html(
        openapi_url="/openapi.json",
        title="Mi Swagger personalizado",
        swagger_favicon_url="https://tu-logo.com/logo.png"
    )


@app.get("/")
def read_root():
    return {
        "mensaje": "¡Chatbot API funcionando!",
        "status": "online"
    }

@app.post("/chat", response_model=Union[MessageResponse, ErrorResponse])
def chat(request: MessageRequest):
    
    if not request.message.strip():
        return ErrorResponse(
            status="error",
            error="El mensaje no puede estar vacío"
        )

    if not GEMINI_API_KEY:
        return ErrorResponse(
            status="error",
            error="GEMINI_API_KEY no está configurada"
        )

    try:
        headers = {
            "Content-Type": "application/json",
        }

        payload = {
            "contents": [
                {
                    "parts": [
                        {"text": request.message}
                    ]
                }
            ]
        }

        response = requests.post(
            f"{GEMINI_API_URL}?key={GEMINI_API_KEY}",
            json=payload,
            headers=headers,
            timeout=30
        )

        if response.status_code != 200:
            return ErrorResponse(
                status="error",
                error=f"Error en Gemini: {response.text}"
            )

        data = response.json()

        bot_response = data["candidates"][0]["content"]["parts"][0]["text"]

        return MessageResponse(
            status="success",
            user_message=request.message,
            bot_response=bot_response
        )

    except Exception as e:
        return ErrorResponse(
            status="error",
            error=str(e)
        )