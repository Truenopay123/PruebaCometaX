# 📦 Inventory System — Sistema de Control de Inventario

Sistema fullstack para gestión de inventario con estadísticas en tiempo real.
Desarrollado con FastAPI, Angular 17 y MongoDB Atlas.

---

## 🚀 Tech Stack

| Capa | Tecnología |
|------|-----------|
| Backend | Python 3.11 + FastAPI |
| Base de datos | MongoDB Atlas (Motor async) |
| Frontend | Angular 17 + Chart.js |
| Documentación API | Swagger UI (automático) |

---

## ✨ Funcionalidades

- ✅ CRUD completo de productos
- ✅ Soft delete (activar/desactivar productos)
- ✅ Registro de movimientos de entrada y salida de stock
- ✅ Validación automática con Pydantic
- ✅ Alerta automática de stock bajo
- ✅ Dashboard con estadísticas en tiempo real:
  - 🍩 Productos por categoría (Doughnut chart)
  - 📊 Valor del inventario por categoría (Bar chart)
  - 📈 Movimientos por mes — Entradas vs Salidas (Bar chart)
  - ⚠️ Tabla de alertas de stock bajo

---

## 🗂️ Estructura del Proyecto
```
inventory-system/
├── backend/
│   ├── main.py              # Entry point, CORS, routers
│   ├── database.py          # Conexión a MongoDB Atlas
│   ├── .env                 # Variables de entorno (no commitear)
│   ├── requirements.txt
│   ├── models/
│   │   ├── product.py       # Esquemas Pydantic de producto
│   │   └── movement.py      # Esquemas Pydantic de movimiento
│   └── routes/
│       ├── products.py      # CRUD + activate/deactivate
│       ├── movements.py     # Registro de entradas/salidas
│       └── stats.py         # Agregaciones para dashboard
└── frontend/
    └── src/app/
        ├── core/services/   # ProductService, MovementService, StatsService
        ├── pages/
        │   ├── dashboard/   # KPIs + gráficas Chart.js
        │   ├── products/    # Tabla + modal formulario
        │   └── movements/   # Tabla + modal formulario
        └── shared/navbar/   # Navegación principal
```

---

## ⚙️ Instalación y configuración

### Requisitos previos
- Python 3.11+
- Node.js 18+
- Angular CLI 17
- Cuenta en MongoDB Atlas

---

### 🐍 Backend
```bash
# 1. Ir a la carpeta backend
cd inventory-system/backend

# 2. Crear y activar entorno virtual
python -m venv venv
venv\Scripts\activate        # Windows
# source venv/bin/activate   # Mac/Linux

# 3. Instalar dependencias
pip install -r requirements.txt

# 4. Crear archivo .env
# MONGO_URL=mongodb+srv://<usuario>:<password>@cluster0.xxxxx.mongodb.net/
# DB_NAME=inventorydb

# 5. Correr el servidor
uvicorn main:app --reload
```

API disponible en: `http://localhost:8000`
Documentación Swagger: `http://localhost:8000/docs`

---

### 🅰️ Frontend
```bash
# 1. Ir a la carpeta frontend
cd inventory-system/frontend

# 2. Instalar dependencias
npm install

# 3. Correr la app
ng serve
```

App disponible en: `http://localhost:4200`

---

## 🔌 Endpoints de la API

### Productos
| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/products` | Obtener todos los productos |
| GET | `/api/products?active_only=true` | Solo productos activos |
| GET | `/api/products/{id}` | Obtener un producto |
| POST | `/api/products` | Crear producto |
| PUT | `/api/products/{id}` | Actualizar producto |
| PATCH | `/api/products/{id}/deactivate` | Desactivar producto |
| PATCH | `/api/products/{id}/activate` | Activar producto |
| DELETE | `/api/products/{id}` | Eliminar permanentemente |

### Movimientos
| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/movements` | Ver todos los movimientos |
| POST | `/api/movements` | Registrar entrada o salida |

### Estadísticas
| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/stats/summary` | Dashboard completo |

---

## 🧠 Decisiones técnicas

**¿Por qué FastAPI?**
Genera documentación automática con Swagger, tiene validación con Pydantic y es asíncrono por naturaleza, ideal para APIs modernas.

**¿Por qué Motor en lugar de PyMongo?**
Motor es el driver asíncrono oficial de MongoDB para Python. Al ser async, no bloquea el servidor mientras espera respuestas de la base de datos.

**¿Por qué soft delete?**
Desactivar en lugar de eliminar preserva el historial de movimientos y permite auditoría. Es una práctica estándar en sistemas de inventario productivos.

**¿Por qué MongoDB Atlas?**
Base de datos en la nube sin configuración de servidor local. El esquema flexible de MongoDB es ideal para productos con atributos variables.

---

## 🔮 Mejoras futuras

- [ ] Autenticación con JWT
- [ ] Paginación en endpoints
- [ ] Filtros por categoría y rango de fechas
- [ ] Exportar reportes a PDF/Excel
- [ ] Notificaciones en tiempo real con WebSockets

---

## 👨‍💻 Autor

**Bryan Axel**
Desarrollador Fullstack Jr.
Stack: Python · FastAPI · Angular · MongoDB