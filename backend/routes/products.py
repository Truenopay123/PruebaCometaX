from fastapi import APIRouter, HTTPException
from database import products_collection
from models.product import ProductCreate, ProductUpdate
from bson import ObjectId
from datetime import datetime

router = APIRouter()

def parse(doc) -> dict:
    doc["id"] = str(doc["_id"])
    del doc["_id"]
    return doc

# CREATE
# CREATE
@router.post("/products", status_code=201)
async def create_product(data: ProductCreate):
    new = data.dict()
    new["created_at"] = datetime.utcnow()
    result = await products_collection.insert_one(new)
    
    created = await products_collection.find_one({"_id": result.inserted_id})
    return parse(created)

# READ ALL
@router.get("/products")
async def get_products(active_only: bool = False):
    query = {"is_active": True} if active_only else {}
    docs = await products_collection.find(query).to_list(100)
    return [parse(d) for d in docs]

# READ ONE
@router.get("/products/{id}")
async def get_product(id: str):
    doc = await products_collection.find_one({"_id": ObjectId(id)})
    if not doc:
        raise HTTPException(404, "Producto no encontrado")
    return parse(doc)

# UPDATE
@router.put("/products/{id}")
async def update_product(id: str, data: ProductUpdate):
    changes = {k: v for k, v in data.dict().items() if v is not None}
    result = await products_collection.update_one(
        {"_id": ObjectId(id)}, {"$set": changes}
    )
    if result.matched_count == 0:
        raise HTTPException(404, "Producto no encontrado")
    return {"message": "Producto actualizado ✅"}

# Desactivar producto
@router.patch("/products/{id}/deactivate")
async def deactivate_product(id: str):
    result = await products_collection.update_one(
        {"_id": ObjectId(id)},
        {"$set": {"is_active": False}}
    )
    if result.matched_count == 0:
        raise HTTPException(404, "Producto no encontrado")
    return {"message": "Producto desactivado ⛔"}

# Reactivar producto
@router.patch("/products/{id}/activate")
async def activate_product(id: str):
    result = await products_collection.update_one(
        {"_id": ObjectId(id)},
        {"$set": {"is_active": True}}
    )
    if result.matched_count == 0:
        raise HTTPException(404, "Producto no encontrado")
    return {"message": "Producto activado ✅"}

# DELETE
@router.delete("/products/{id}")
async def delete_product(id: str):
    result = await products_collection.delete_one({"_id": ObjectId(id)})
    if result.deleted_count == 0:
        raise HTTPException(404, "Producto no encontrado")
    return {"message": "Producto eliminado ✅"}