# Detalle de Arquitecturas del Sistema de Inventario

## 1. Arquitectura del Sistema

### Tipo de Arquitectura: **Monolítica MVC + SPA con API REST**

El sistema utiliza una combinación de dos patrones arquitectónicos:

| Capa | Patrón Arquitectónico | Tecnología |
|------|----------------------|------------|
| **Backend** | MVC (Model-View-Controller) + REST API | Laravel 5.8 |
| **Frontend** | SPA Component-Based Architecture | Vue.js 2.x |
| **Comunicación** | RESTful API sobre HTTP | JSON + JWT |

### Detalle del Patrón MVC en Backend

```
┌─────────────────────────────────────────────────────────────────┐
│                    LARAVEL MVC + REST API                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│   REQUEST                                                        │
│      │                                                           │
│      ▼                                                           │
│   ┌─────────────┐                                                │
│   │   Routes    │  api.php - Define endpoints REST               │
│   │   (api.php) │  GET/POST/PUT/DELETE /api/resource             │
│   └──────┬──────┘                                                │
│          │                                                       │
│          ▼                                                       │
│   ┌─────────────┐                                                │
│   │ Middleware  │  JWT.php - Valida token de autenticación       │
│   │   (JWT)     │  Protege rutas que requieren auth              │
│   └──────┬──────┘                                                │
│          │                                                       │
│          ▼                                                       │
│   ┌─────────────────────────────────────────────────────────┐   │
│   │              CONTROLLER (Controladores)                  │   │
│   │  AuthController - Login, Signup, Logout, Refresh JWT     │   │
│   │  Api/ProductController - CRUD productos                  │   │
│   │  Api/EmployeeController - CRUD empleados                 │   │
│   │  Api/CustomerController - CRUD clientes                  │   │
│   │  Api/CategoryController - CRUD categorías                │   │
│   │  Api/SupplierController - CRUD proveedores               │   │
│   │  Api/ExpenseController - CRUD gastos                     │   │
│   │  Api/SalaryController - Gestión salarios                 │   │
│   │  Api/CartController - Carrito (POS)                      │   │
│   │  Api/PosController - Punto de venta                      │   │
│   │  Api/OrderController - Órdenes/ventas                    │   │
│   └──────┬──────────────────────────────────────────────────┘   │
│          │                                                       │
│          ▼                                                       │
│   ┌─────────────────────────────────────────────────────────┐   │
│   │                MODEL (Modelos Eloquent)                  │   │
│   │  User.php - Usuario del sistema + JWT                    │   │
│   │  Product.php - Productos de inventario                   │   │
│   │  Category.php - Categorías de productos                  │   │
│   │  Customer.php - Clientes                                 │   │
│   │  Employee.php - Empleados                                │   │
│   │  Supplier.php - Proveedores                              │   │
│   │  + Query Builder DB:: para consultas complejas           │   │
│   └──────┬──────────────────────────────────────────────────┘   │
│          │                                                       │
│          ▼                                                       │
│   ┌─────────────┐                                                │
│   │  DATABASE   │  MySQL/MariaDB - 13 tablas                     │
│   └─────────────┘                                                │
│                                                                  │
│   RESPONSE → JSON                                                │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### Detalle del Patrón SPA Component-Based en Frontend

```
┌─────────────────────────────────────────────────────────────────┐
│              VUE.JS 2.x SPA COMPONENT-BASED                      │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│   ┌─────────────────────────────────────────────────────────┐   │
│   │                    app.js (Entry Point)                  │   │
│   │  - Inicializa Vue                                        │   │
│   │  - Configura Vue Router                                  │   │
│   │  - Registra helpers globales (User, Notification, Swal)  │   │
│   └──────┬──────────────────────────────────────────────────┘   │
│          │                                                       │
│          ▼                                                       │
│   ┌─────────────────────────────────────────────────────────┐   │
│   │                  Vue Router (routes.js)                  │   │
│   │  - Navegación SPA sin recargar página                    │   │
│   │  - 30+ rutas definidas                                   │   │
│   │  - Modo: history (URLs limpias)                          │   │
│   └──────┬──────────────────────────────────────────────────┘   │
│          │                                                       │
│          ▼                                                       │
│   ┌─────────────────────────────────────────────────────────┐   │
│   │              COMPONENTES VUE (34 archivos .vue)          │   │
│   │                                                          │   │
│   │  auth/           category/        customer/              │   │
│   │  ├── login       ├── index        ├── index              │   │
│   │  ├── register    ├── create       ├── create             │   │
│   │  ├── logout      └── edit         └── edit               │   │
│   │  └── forget                                              │   │
│   │                                                          │   │
│   │  employee/       product/         supplier/              │   │
│   │  ├── index       ├── index        ├── index              │   │
│   │  ├── create      ├── create       ├── create             │   │
│   │  └── edit        ├── edit         └── edit               │   │
│   │                  ├── stock                               │   │
│   │                  └── edit-stock                          │   │
│   │                                                          │   │
│   │  expense/        salary/          order/                 │   │
│   │  ├── expense     ├── all_employee ├── order              │   │
│   │  ├── create      ├── create       ├── viewOrder          │   │
│   │  └── edit        ├── index        └── search             │   │
│   │                  ├── view                                │   │
│   │                  └── edit                                │   │
│   │                                                          │   │
│   │  pos/            home.vue (Dashboard)                    │   │
│   │  └── pointofsale                                         │   │
│   └──────┬──────────────────────────────────────────────────┘   │
│          │                                                       │
│          ▼                                                       │
│   ┌─────────────────────────────────────────────────────────┐   │
│   │                    HELPERS (JS Classes)                  │   │
│   │  User.js - Estado autenticación, info usuario            │   │
│   │  Token.js - Validación y decodificación JWT              │   │
│   │  AppStorage.js - Manejo de localStorage                  │   │
│   │  Notification.js - Alertas (Noty, SweetAlert2)           │   │
│   └──────┬──────────────────────────────────────────────────┘   │
│          │                                                       │
│          ▼                                                       │
│   ┌─────────────────────────────────────────────────────────┐   │
│   │                 AXIOS HTTP CLIENT                        │   │
│   │  - Peticiones HTTP a la API REST                         │   │
│   │  - Base URL: /api/                                       │   │
│   │  - Headers con JWT token                                 │   │
│   └─────────────────────────────────────────────────────────┘   │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## 2. Arquitectura de Datos

### Tipo de Arquitectura: **Modelo Relacional Normalizado (3NF)**

El sistema utiliza una base de datos relacional MySQL/MariaDB con normalización hasta la tercera forma normal (3NF).

### Características del Modelo

| Característica | Valor |
|----------------|-------|
| **SGBD** | MySQL 10.4 / MariaDB |
| **ORM** | Eloquent (Laravel) + Query Builder |
| **Tablas** | 13 |
| **Normalización** | 3NF (Tercera Forma Normal) |
| **Charset** | utf8mb4_unicode_ci |

### Diagrama Entidad-Relación Textual

```
┌─────────────────────────────────────────────────────────────────────────┐
│                    MODELO ENTIDAD-RELACIÓN                               │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│   ┌──────────┐         ┌──────────────┐         ┌──────────────┐        │
│   │  USERS   │         │  CATEGORIES  │         │  SUPPLIERS   │        │
│   │  (PK id) │         │   (PK id)    │         │   (PK id)    │        │
│   └────┬─────┘         └──────┬───────┘         └──────┬───────┘        │
│        │                      │                        │                 │
│        │                      │ 1:N                    │ 1:N             │
│        │                      ▼                        ▼                 │
│        │               ┌──────────────────────────────────┐             │
│        │               │           PRODUCTS               │             │
│        │               │  (PK id, FK category_id,         │             │
│        │               │   FK supplier_id)                │             │
│        │               └───────────────┬──────────────────┘             │
│        │                               │                                 │
│        │                               │ 1:N                             │
│        │                               ▼                                 │
│        │                        ┌──────────────┐                        │
│        │                        │     POS      │                        │
│        │                        │   (Carrito)  │                        │
│        │                        └──────────────┘                        │
│        │                                                                 │
│   ┌────┴─────┐                                                          │
│   │EMPLOYEES │                                                          │
│   │ (PK id)  │                                                          │
│   └────┬─────┘                                                          │
│        │ 1:N                                                            │
│        ▼                                                                │
│   ┌──────────┐                                                          │
│   │ SALARIES │                                                          │
│   │(FK emp)  │                                                          │
│   └──────────┘                                                          │
│                                                                          │
│   ┌──────────┐         ┌──────────────┐         ┌──────────────┐        │
│   │CUSTOMERS │ ──1:N─► │   ORDERS     │ ──1:N─► │ORDER_DETAILS │        │
│   │ (PK id)  │         │(FK customer) │         │(FK order,    │        │
│   └──────────┘         └──────────────┘         │ FK product)  │        │
│                                                 └──────────────┘        │
│                                                                          │
│   ┌──────────┐         ┌──────────────┐                                 │
│   │ EXPENSES │         │    EXTRAS    │  (Tabla de configuración)       │
│   │ (PK id)  │         │   (Config)   │                                 │
│   └──────────┘         └──────────────┘                                 │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

### Relaciones entre Tablas

| Tabla Origen | Relación | Tabla Destino | Cardinalidad |
|--------------|----------|---------------|--------------|
| categories | → | products | 1:N |
| suppliers | → | products | 1:N |
| employees | → | salaries | 1:N |
| customers | → | orders | 1:N |
| orders | → | order_details | 1:N |
| products | → | order_details | 1:N |
| products | → | pos | 1:N |

---

## 3. Diagramas XML para Draw.io

Se han generado dos archivos XML listos para importar en Draw.io:

1. **[arquitectura_sistema_drawio.xml](arquitectura_sistema_drawio.xml)** 
   - Diagrama de arquitectura MVC + SPA
   - Muestra capas frontend y backend

2. **[arquitectura_datos_drawio.xml](arquitectura_datos_drawio.xml)**
   - Diagrama ER de base de datos
   - Muestra las 13 tablas y sus relaciones

### Cómo usar los diagramas:

1. Abrir https://app.diagrams.net (Draw.io)
2. Ir a **Archivo → Importar desde → Dispositivo**
3. Seleccionar el archivo XML
4. El diagrama se cargará listo para editar
