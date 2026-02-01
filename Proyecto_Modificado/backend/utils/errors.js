// Sistema centralizado de códigos de error para debugging
// Uso: throw new AppError('ERR_AUTH_001', 'Mensaje descriptivo', { detalles })

export class AppError extends Error {
    constructor(code, message, details = {}) {
        super(message);
        this.code = code;
        this.details = details;
        this.timestamp = new Date().toISOString();
    }

    toJSON() {
        return {
            code: this.code,
            message: this.message,
            details: this.details,
            timestamp: this.timestamp
        };
    }
}

// Códigos de error por módulo
export const ErrorCodes = {
    // Autenticación (AUTH)
    AUTH: {
        INVALID_CREDENTIALS: 'ERR_AUTH_001',
        TOKEN_EXPIRED: 'ERR_AUTH_002',
        TOKEN_INVALID: 'ERR_AUTH_003',
        USER_NOT_VERIFIED: 'ERR_AUTH_004',
        USER_ALREADY_EXISTS: 'ERR_AUTH_005',
        RATE_LIMIT_EXCEEDED: 'ERR_AUTH_006',
    },
    // Productos (PROD)
    PRODUCT: {
        NOT_FOUND: 'ERR_PROD_001',
        SKU_EXISTS: 'ERR_PROD_002',
        INVALID_VARIANT: 'ERR_PROD_003',
    },
    // Ventas (SALE)
    SALE: {
        INSUFFICIENT_STOCK: 'ERR_SALE_001',
        VARIANT_NOT_FOUND: 'ERR_SALE_002',
        INVALID_QUANTITY: 'ERR_SALE_003',
    },
    // Inventario (INV)
    INVENTORY: {
        NEGATIVE_STOCK: 'ERR_INV_001',
        LOG_FAILED: 'ERR_INV_002',
    },
    // Base de datos (DB)
    DATABASE: {
        CONNECTION_FAILED: 'ERR_DB_001',
        QUERY_FAILED: 'ERR_DB_002',
        TRANSACTION_FAILED: 'ERR_DB_003',
    },
    // Servidor (SRV)
    SERVER: {
        INTERNAL_ERROR: 'ERR_SRV_001',
        VALIDATION_FAILED: 'ERR_SRV_002',
    }
};

// Helper para crear respuestas de error estandarizadas
export const errorResponse = (res, statusCode, code, message, details = {}) => {
    return res.status(statusCode).json({
        success: false,
        error: {
            code,
            message,
            details,
            timestamp: new Date().toISOString()
        }
    });
};

// Middleware de manejo de errores
export const errorHandler = (err, req, res, next) => {
    console.error(`[${new Date().toISOString()}] Error:`, err);

    if (err instanceof AppError) {
        return errorResponse(res, err.statusCode || 500, err.code, err.message, err.details);
    }

    // Error no controlado
    return errorResponse(
        res,
        500,
        ErrorCodes.SERVER.INTERNAL_ERROR,
        'Error interno del servidor',
        process.env.NODE_ENV !== 'production' ? { stack: err.stack } : {}
    );
};
