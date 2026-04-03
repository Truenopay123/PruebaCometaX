from pydantic import BaseModel, Field
from enum import Enum
from datetime import datetime

class MovementType(str, Enum):
    entry = "entry"    # Entrada de stock
    exit = "exit"      # Salida de stock

class MovementCreate(BaseModel):
    product_id: str = Field(..., example="abc123")
    type: MovementType
    quantity: int = Field(..., example=20)
    note: str = Field(default="", example="Compra a proveedor")