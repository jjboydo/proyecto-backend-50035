import * as chai from "chai";
import supertest from "supertest";

const expect = chai.expect;
const requester = supertest("http://localhost:8080");

// Test de sessions

let userId;

describe("Test de Sessions", () => {

    describe("Test de registro de usuario", () => {

        it("El endpoint POST /api/sessions/register debería registrar un usuario correctamente", async () => {
            const response = await requester.post("/api/sessions/register").send({
                first_name: "Usuario",
                last_name: "Test",
                email: "test@gmail.com",
                password: "123456",
                age: 25,
                role: "user_premium"
            })

            userId = response.body.payload;

            expect(response.status).to.eql(200)
            expect(response.body).to.have.property("status")
            expect(response.body.status).to.eql("success")
        })

        it("El endpoint POST /api/sessions/register no debería registrar un usuario que ya existe", async () => {
            const response = await requester.post("/api/sessions/register").send({
                first_name: "Usuario",
                last_name: "Test",
                email: "test@gmail.com",
                password: "123456",
                age: 25
            })

            // esto es si hubo redireccion a failedRegister
            expect(response.status).to.eql(302);
            expect(response.header.location).to.eql("failregister");
        });

    })

    describe("Test de login de usuario", () => {

        let cookie

        it("El endpoint POST /api/sessions/login debería loguear un usuario correctamente", async () => {
            const response = await requester.post("/api/sessions/login").send({
                email: "test@gmail.com",
                password: "123456"
            })

            const cookieResult = response.headers["set-cookie"][0]
            expect(cookieResult).to.be.ok
            cookie = {
                name: cookieResult.split("=")[0],
                value: cookieResult.split("=")[1]
            }

            expect(response.status).to.eql(200)
            expect(cookie.name).to.be.ok.and.eql("cookieToken")
            expect(cookie.value).to.be.ok
        })

        it("Debe enviar la cookie que contiene el usuario en current", async () => {
            const response = await requester.get("/api/sessions/current").set("Cookie", `${cookie.name}=${cookie.value}`)
            expect(response._body.last_name).to.eql("Test")
        })

        it("El endpoint POST /api/sessions/login debería devolver un redirect si el usuario no existe", async () => {
            const response = await requester.post("/api/sessions/login").send({
                email: "noexiste@gmail.com",
                password: "123456"
            })

            expect(response.status).to.eql(302)
            expect(response.header.location).to.eql("faillogin")
        })

        it("El endpoint POST /api/sessions/login debería devolver un redirect si la contraseña es incorrecta", async () => {
            const response = await requester.post("/api/sessions/login").send({
                email: "test@gmail.com",
                password: "incorrecta"
            })

            expect(response.status).to.eql(302)
            expect(response.header.location).to.eql("faillogin")
        })

    })

})

// Test de products

let productId;

describe("Test de Products", () => {

    let cookie
    describe("Test de creación de producto", () => {

        it("El endpoint POST /api/products debería crear un producto correctamente", async () => {

            const loginResponse = await requester.post("/api/sessions/login").send({
                email: "test@gmail.com",
                password: "123456"
            })

            const cookieResult = loginResponse.headers["set-cookie"][0]
            expect(cookieResult).to.be.ok
            cookie = {
                name: cookieResult.split("=")[0],
                value: cookieResult.split("=")[1]
            }

            const response = await requester.post("/api/products").send({
                title: "producto TEST",
                description: "Este es un producto prueba TEST",
                price: 850,
                stock: 20,
                code: "abc123TEST",
                category: "Categoría TEST"
            }).set("Cookie", `${cookie.name}=${cookie.value}`)

            productId = response.body.payload;

            expect(response.status).to.eql(200)
            expect(response.body).to.have.property("success")
            expect(response.body.success).to.eql("Product added correctly!")
        })

        it("El endpoint POST /api/products no debería crear un producto si el usuario no está logueado", async () => {
            const response = await requester.post("/api/products").send({
                title: "producto TEST",
                description: "Este es un producto prueba TEST",
                price: 850,
                stock: 20,
                code: "abc123TEST",
                category: "Categoría TEST"
            })

            expect(response.status).to.eql(401)
            expect(response.body).to.have.property("error")
            expect(response.body.error).to.eql("Error: No auth token")
        })

        it("El endpoint POST /api/products no deberiá crear un producto con un codigo que ya existe", async () => {
            const response = await requester.post("/api/products").send({
                title: "producto TEST",
                description: "Este es un producto prueba TEST",
                price: 850,
                stock: 20,
                code: "abc123TEST",
                category: "Categoría TEST"
            }).set("Cookie", `${cookie.name}=${cookie.value}`)

            expect(response.status).to.eql(400)
            expect(response.body).to.have.property("error")
            expect(response.body).to.have.property("cause")
            expect(response.body.cause).to.eql(`There is already a product with that code. Received abc123TEST`)
        })

    })

    describe("Test de modificación de producto", () => {

        it("El endpoint PUT /api/products/:id debería modificar un producto correctamente", async () => {
            const response = await requester.put(`/api/products/${productId}`).send({
                title: "producto TEST MODIFICADO",
                description: "Este es un producto prueba TEST MODIFICADO",
                category: "Categoría TEST MODIFICADA"
            }).set("Cookie", `${cookie.name}=${cookie.value}`)

            expect(response.status).to.eql(200)
            expect(response.body).to.have.property("success")
            expect(response.body.success).to.eql(`Product ${productId} successfully modified!`)
        })

        it("El endpoint PUT /api/products/:id no debería modificar un producto si el usuario no está logueado", async () => {
            const response = await requester.put(`/api/products/${productId}`).send({
                title: "producto TEST MODIFICADO",
                description: "Este es un producto prueba TEST MODIFICADO",
                price: 950,
                stock: 25,
                code: "abc123TEST",
                category: "Categoría TEST MODIFICADA"
            })

            expect(response.status).to.eql(401)
            expect(response.body).to.have.property("error")
            expect(response.body.error).to.eql("Error: No auth token")
        })

        it("El endpoint PUT /api/products/:id no debería modificar un producto si el usuario no es el dueño", async () => {

            const response = await requester.put(`/api/products/666070177a1dca21cf8f7e90`).send({
                title: "producto TEST MODIFICADO",
                description: "Este es un producto prueba TEST MODIFICADO",
                category: "Categoría TEST MODIFICADA"
            }).set("Cookie", `${cookie.name}=${cookie.value}`) // El id es de un producto de otro usuario

            expect(response.status).to.eql(403)
            expect(response.body).to.have.property("error")
            expect(response.body.error).to.eql("You do not have permission to modify this product")
        })
    })

    describe("Test de eliminación de producto", () => {

        it("El endpoint DELETE /api/products/:id no debería eliminar un producto si el usuario no está logueado", async () => {
            const response = await requester.delete(`/api/products/${productId}`)

            expect(response.status).to.eql(401)
            expect(response.body).to.have.property("error")
            expect(response.body.error).to.eql("Error: No auth token")
        })

        it("El endpoint DELETE /apí/products/:id no debería eliminar un producto que no existe", async () => {
            const response = await requester.delete(`/api/products/1111111111111111111111111`).set("Cookie", `${cookie.name}=${cookie.value}`)

            expect(response.status).to.eql(404)
            expect(response.body).to.have.property("error")
            expect(response.body.error).to.eql("Product 1111111111111111111111111 does not exist!")
        })

        it("El endpoint DELETE /api/products/:id debería eliminar un producto correctamente", async () => {
            const response = await requester.delete(`/api/products/${productId}`).set("Cookie", `${cookie.name}=${cookie.value}`)

            expect(response.status).to.eql(200)
            expect(response.body).to.have.property("success")
            expect(response.body.success).to.eql(`Product ${productId} deleted successfully!`)
        })

    })

    after(async () => {
        const productResponse = await requester.delete(`/api/products/${productId}`).set("Cookie", `${cookie.name}=${cookie.value}`)
        const userResponse = await requester.delete(`/api/sessions/deleteuser/${userId}`)
        expect(userResponse.status).to.eql(200)
    })

})

// Test de carrito

let cartId;

describe("Test de Cart", () => {

    let productId
    describe("Test de creación de carrito", () => {

        it("El endpoint POST /api/carts debería crear un carrito correctamente", async () => {

            const response = await requester.post("/api/carts")
            cartId = response.body.payload;

            expect(response.status).to.eql(200)
            expect(response.body).to.have.property("success")
            expect(response.body.success).to.eql("Cart added correctly!")
        })

    })

    describe("Test de modificación de carrito", () => {

        it("El endpoint PUT /api/carts/:id debería modificar un carrito correctamente", async () => {
            const response = await requester.put(`/api/carts/${cartId}`).send({
                products: [
                    {
                        product: "65d15db6c76e92ed7d5b4589",
                        quantity: 2
                    },
                    {
                        product: "65d69cb167b0da1f574b2aac",
                        quantity: 5
                    }
                ]
            })

            expect(response.status).to.eql(200)
            expect(response.body).to.have.property("success")
            expect(response.body.success).to.eql(`Products updated in cart ${cartId} successfully!`)
        })

        it("El endpoint PUT /api/carts/:id no debería modificar un carrito que no existe", async () => {
            const response = await requester.put(`/api/carts/1111111111111111111111111`).send({
                products: [
                    {
                        product: "65d15db6c76e92ed7d5b4589",
                        quantity: 2
                    },
                    {
                        product: "65d69cb167b0da1f574b2aac",
                        quantity: 5
                    }
                ]
            })

            expect(response.status).to.eql(400)
            expect(response.body).to.have.property("error")
            expect(response.body).to.have.property("cause")
            expect(response.body.cause).to.eql("Cart doesn´t exist. Received 1111111111111111111111111")
        })

    })

    describe("Test de modificación de producto en carrito", () => {

        it("El endpoint PUT /api/carts/:cid/product/:pid debería modificar un producto en un carrito correctamente", async () => {
            const response = await requester.put(`/api/carts/${cartId}/product/65d15db6c76e92ed7d5b4589`).send({
                quantity: 5
            })

            expect(response.status).to.eql(200)
            expect(response.body).to.have.property("success")
            expect(response.body.success).to.eql(`Product 65d15db6c76e92ed7d5b4589 from cart ${cartId} updated successfully!`)
        })

        it("El endpoint PUT /api/carts/:cid/product/:pid no debería modificar un producto en un carrito que no existe", async () => {
            const response = await requester.put(`/api/carts/2222222222222222222222/product/1111111111111111111111111`).send({
                quantity: 5
            })

            expect(response.status).to.eql(400)
            expect(response.body).to.have.property("error")
            expect(response.body).to.have.property("cause")
            expect(response.body.cause).to.eql("Cart doesn´t exist. Received 2222222222222222222222")
        })

        it("El endpoint PUT /api/carts/:cid/product/:pid no debería modificar un producto que no existe en un carrito", async () => {
            const response = await requester.put(`/api/carts/${cartId}/product/1111111111111111111111111`).send({
                quantity: 5
            })

            expect(response.status).to.eql(400)
            expect(response.body).to.have.property("error")
            expect(response.body).to.have.property("cause")
            expect(response.body.cause).to.eql("The product doesn´t exist. Received 1111111111111111111111111")
        })

    })

    after(async () => {
        const cartResponse = await requester.delete(`/api/carts/test/${cartId}`)
        expect(cartResponse.status).to.eql(200)
    })

})
