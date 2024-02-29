# Proyecto Final Backend. Comisión 50035

## Juan José Boydo

### Capturas de pantalla de los endpoints:

* getProducts. Cuenta con parametros opcionales (limit, sort, page, category, status)

```
GET http://localhost:8080/api/products
```

![alt text](image.png)

* getProductsById

```
GET http://localhost:8080/api/products/:pid
```

![alt text](image-1.png)

* addProduct

```
POST http://localhost:8080/api/products
```

![alt text](image-2.png)

* updateProduct

```
PUT http://localhost:8080/api/products/:pid
```

![alt text](image-3.png)

* deleteProduct

```
DELETE http://localhost:8080/api/products/:pid
```

![alt text](image-4.png)

* addNewCart

```
POST http://localhost:8080/api/carts
```

![alt text](image-5.png)

* getCartById

```
GET http://localhost:8080/api/carts/:cid
```

![alt text](image-6.png)

* addProductToCart

```
POST http://localhost:8080/api/carts/:cid/product/:pid
```

![alt text](image-7.png)

* deleteProductFromCart

```
DELETE http://localhost:8080/api/carts/:cid/product/:pid
```

![alt text](image-8.png)

* deleteCart

```
DELETE http://localhost:8080/api/carts/:cid
```

![alt text](image-9.png)

* updateProductFromCart (Se debe enviar por body la cantidad nueva del producto)

```
PUT http://localhost:8080/api/carts/:cid/product/:pid
```

![alt text](image-10.png)

* updateCart (Se debe enviar por body el arreglo nuevo de productos, junto a sus cantidades)

```
PUT http://localhost:8080/api/carts/:cid
```

![alt text](image-11.png)