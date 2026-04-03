from pydantic import BaseModel, Field
from typing import Optional
from enum import Enum

class CategoryEnum(str, Enum):
    electronics = "Electronics"
    clothing = "Clothing"
    food = "Food"
    tools = "Tools"
    other = "Other"

class ProductCreate(BaseModel):
    name: str = Field(..., example="Laptop Dell")
    category: CategoryEnum
    price: float = Field(..., example=15000.00)
    stock: int = Field(..., example=50)
    min_stock: int = Field(default=10, example=10)  # Para alerta de stock bajo
    is_active: Optional[bool] = None

class ProductUpdate(BaseModel):
    name: Optional[str] = None
    category: Optional[CategoryEnum] = None
    price: Optional[float] = None
    stock: Optional[int] = None
    min_stock: Optional[int] = None
    is_active: bool = True