from fastapi import APIRouter
from database import products_collection, movements_collection

router = APIRouter()

@router.get("/stats/summary")
async def get_summary():

    # 1. Productos por categoría
    by_category = await products_collection.aggregate([
        {"$group": {"_id": "$category", "total": {"$sum": 1}}}
    ]).to_list(20)

    # 2. Valor total del inventario por categoría
    inventory_value = await products_collection.aggregate([
        {"$group": {
            "_id": "$category",
            "value": {"$sum": {"$multiply": ["$price", "$stock"]}}
        }}
    ]).to_list(20)

    # 3. Movimientos por mes
    by_month = await movements_collection.aggregate([
        {"$group": {
            "_id": {"$month": "$date"},
            "entries": {"$sum": {"$cond": [{"$eq": ["$type", "entry"]}, "$quantity", 0]}},
            "exits":   {"$sum": {"$cond": [{"$eq": ["$type", "exit"]},  "$quantity", 0]}},
        }},
        {"$sort": {"_id": 1}}
    ]).to_list(12)

    # 4. Alertas: productos con stock <= min_stock
    low_stock = await products_collection.find(
        {"$expr": {"$lte": ["$stock", "$min_stock"]}}
    ).to_list(50)
    for p in low_stock:
        p["id"] = str(p["_id"]); del p["_id"]

    return {
        "by_category": [{"category": d["_id"], "total": d["total"]} for d in by_category],
        "inventory_value": [{"category": d["_id"], "value": round(d["value"], 2)} for d in inventory_value],
        "by_month": [{"month": d["_id"], "entries": d["entries"], "exits": d["exits"]} for d in by_month],
        "low_stock_alerts": low_stock
    }