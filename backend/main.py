from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes.products import router as products_router
from routes.movements import router as movements_router
from routes.stats import router as stats_router

app = FastAPI(title="Sistema de Control de Inventario 📦")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:4200"],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(products_router, prefix="/api")
app.include_router(movements_router, prefix="/api")
app.include_router(stats_router, prefix="/api")

@app.get("/")
def root():
    return {"message": "Sistema de Control de Inventario funcionando ✅"}