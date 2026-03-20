from fastapi import FastAPI

app = FastAPI()


@app.get("/")
def read_root():
    import os
    # Esto lee la variable de tu archivo .env
    app_name = os.getenv("APP_NAME", "Nombre por defecto")
    return {
        "mensaje": "¡Servidor funcionando!",
        "proyecto": app_name,
        "status": "online"
    }
