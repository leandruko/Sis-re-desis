CREATE TABLE bodegas (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL
);

CREATE TABLE monedas (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(20) NOT NULL,
);

CREATE TABLE sucursales (
    id SERIAL PRIMARY KEY,
    bodega_id INT REFERENCES bodegas(id),
    nombre VARCHAR(50) NOT NULL
);

CREATE TABLE productos (
    id SERIAL PRIMARY KEY,
    codigo VARCHAR(15) UNIQUE NOT NULL,
    nombre VARCHAR(50) NOT NULL,
    bodega_id INT REFERENCES bodegas(id),
    sucursal_id INT REFERENCES sucursales(id),
    moneda_id INT REFERENCES monedas(id),
    precio NUMERIC(10, 2) NOT NULL,
    materiales TEXT NOT NULL, 
    descripcion TEXT NOT NULL
);

INSERT INTO bodegas (nombre) VALUES ('Bodega 1'), ('Bodega 2');
INSERT INTO monedas (nombre) VALUES ('DOLAR');
INSERT INTO sucursales (bodega_id, nombre) VALUES (1, 'Sucursal 1'), (1, 'Sucursal 2');