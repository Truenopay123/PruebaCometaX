from fastapi import APIRouter, HTTPException
from database import movements_collection, products_collection
from models.movement import MovementCreate
from bson import ObjectId
from datetime import datetime

router = APIRouter()

def parse(doc) -> dict:
    doc["id"] = str(doc["_id"])
    del doc["_id"]
    return doc


# CREATE — Registrar movimiento
@router.post("/movements", status_code=201)
async def create_movement(data: MovementCreate):
    # Verificar que el producto existe
    product = await products_collection.find_one({"_id": ObjectId(data.product_id)})
    if not product:
        raise HTTPException(404, "Producto no encontrado")

    # Ajustar stock según tipo
    delta = data.quantity if data.type == "entry" else -data.quantity

    # Evitar stock negativo
    if product["stock"] + delta < 0:
        raise HTTPException(400, "Stock insuficiente para esta salida")

    await products_collection.update_one(
        {"_id": ObjectId(data.product_id)},
        {"$inc": {"stock": delta}}
    )

    # Guardar movimiento
    new = data.dict()
    new["date"] = datetime.utcnow()
    result = await movements_collection.insert_one(new)

    # Buscar el documento insertado y parsearlo
    created = await movements_collection.find_one({"_id": result.inserted_id})
    return parse(created)


# READ ALL — Ver todos los movimientos
@router.get("/movements")
async def get_movements():
    docs = await movements_collection.find().to_list(200)
    return [parse(d) for d in docs]