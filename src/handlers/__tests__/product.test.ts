import request from 'supertest'
import server from '../../server'

describe('POST api/products', () => {
  it('should display validation errors', async () => {
    const response = await request(server).post('/api/products').send({})

    expect(response.status).toBe(400)
    expect(response.body).toHaveProperty('errors')
    expect(response.body.errors).toHaveLength(4)

    expect(response.status).not.toBe(404)
    expect(response.body.errors).not.toHaveLength(2)
  })

  it('should validate that the price is greater than 0', async () => {
    const response = await request(server).post('/api/products').send({
      name: 'Producto de prueba',
      price: 0,
    })

    expect(response.status).toBe(400)
    expect(response.body).toHaveProperty('errors')
    expect(response.body.errors).toHaveLength(1)

    expect(response.status).not.toBe(404)
    expect(response.body.errors).not.toHaveLength(0)
  })

  it('should validate that the price is a number and greater than 0', async () => {
    const response = await request(server).post('/api/products').send({
      name: 'Producto de prueba',
      price: 'Hola',
    })

    expect(response.status).toBe(400)
    expect(response.body).toHaveProperty('errors')
    expect(response.body.errors).toHaveLength(2)

    expect(response.status).not.toBe(404)
    expect(response.body.errors).not.toHaveLength(0)
  })

  it('should create a new product', async () => {
    const response = await request(server).post('/api/products').send({
      name: 'Producto de prueba',
      price: 100,
    })

    expect(response.status).toBe(201)
    expect(response.body).toHaveProperty('data')

    expect(response.status).not.toBe(400)
    expect(response.body).not.toHaveProperty('errors')
  })
})

describe('GET /api/products', () => {
  it('should check if api/products url exists', async () => {
    const response = await request(server).get('/api/products')

    expect(response.status).not.toBe(404)
  })

  it('should GET a JSON response with products', async () => {
    const response = await request(server).get('/api/products')

    expect(response.status).toBe(200)
    expect(response.type).toBe('application/json')
    expect(response.body).toHaveProperty('data')
    expect(response.body.data).toHaveLength(1)

    expect(response.body).not.toHaveProperty('errors')
  })
})

describe('GET /api/products/:id', () => {
  it('should return a 404 response for a non-existent product', async () => {
    const productId = 2000
    const response = await request(server).get(`/api/products/${productId}`)

    expect(response.status).toBe(404)
    expect(response.body).toHaveProperty('error')
    expect(response.body.error).toBe('Producto no encontrado')
  })

  it('should check for a valid ID in the URL', async () => {
    const response = await request(server).get('/api/products/testing')

    expect(response.status).toBe(400)
    expect(response.body).toHaveProperty('errors')
    expect(response.body.errors).toHaveLength(1)
    expect(response.body.errors[0].msg).toBe('ID no válido')
  })

  it('should get a JSON response for a single product', async () => {
    const response = await request(server).get(`/api/products/1`)

    expect(response.status).toBe(200)
    expect(response.body).toHaveProperty('data')
  })
})

describe('PUT /api/products/:id', () => {
  it('should display validation error messages when updating a product', async () => {
    const response = await request(server).put('/api/products/1').send({})

    expect(response.status).toBe(400)
    expect(response.body).toHaveProperty('errors')
    expect(response.body.errors).toBeTruthy()
    expect(response.body.errors).toHaveLength(5)

    expect(response.status).not.toBe(200)
    expect(response.body).not.toHaveProperty('data')
  })
})

describe('PUT /api/products/:id', () => {
  it('should check for a valid ID in the URL', async () => {
    const response = await request(server).put('/api/products/testing').send({
      name: 'Producto de prueba',
      availability: true,
      price: 500,
    })

    expect(response.status).toBe(400)
    expect(response.body).toHaveProperty('errors')
    expect(response.body.errors).toHaveLength(1)
    expect(response.body.errors[0].msg).toBe('ID no válido')
  })

  it('should validate than the price is greater than 0', async () => {
    const response = await request(server).put('/api/products/1').send({
      name: 'Producto de prueba',
      availability: true,
      price: 0,
    })

    expect(response.status).toBe(400)
    expect(response.body).toHaveProperty('errors')
    expect(response.body.errors).toBeTruthy()
    expect(response.body.errors).toHaveLength(1)
    expect(response.body.errors[0].msg).toBe('Precio no válido')

    expect(response.status).not.toBe(200)
    expect(response.body).not.toHaveProperty('data')
  })

  it('should return a 404 for a non-existent product', async () => {
    const productId = 2000
    const response = await request(server)
      .put(`/api/products/${productId}`)
      .send({
        name: 'Producto de prueba',
        availability: true,
        price: 500,
      })

    expect(response.status).toBe(404)
    expect(response.body.error).toBe('Producto no encontrado')

    expect(response.status).not.toBe(200)
    expect(response.body).not.toHaveProperty('data')
  })

  it('should update an existing product with valid data', async () => {
    const response = await request(server)
      .put('/api/products/1')
      .send({
        name: 'Nuevo Producto de prueba',
        availability: true,
        price: 500,
      })

    expect(response.status).toBe(200)
    expect(response.body).toHaveProperty('data')

    expect(response.status).not.toBe(400)
    expect(response.body).not.toHaveProperty('errors')
  })
})

describe('PATCH /api/products/:id', () => {
  it('should check for a valid ID', async () => {
    const response = await request(server).patch('/api/products/testing').send({
      availability: true,
    })

    expect(response.status).toBe(400)
    expect(response.body).toHaveProperty('errors')
    expect(response.body.errors).toHaveLength(1)
    expect(response.body.errors[0].msg).toBe('ID no válido')
  })

  it('should return a 404 response for a non-existent product', async () => {
    const productId = 2000
    const response = await request(server)
      .patch(`/api/products/${productId}`)

    expect(response.status).toBe(404)
    expect(response.body.error).toBe('Producto no encontrado')

    expect(response.status).not.toBe(200)
    expect(response.body).not.toHaveProperty('data')
  })

  it('should update the availability of an existing product', async () => {
    const response = await request(server)
      .patch('/api/products/1')

    expect(response.status).toBe(200)
    expect(response.body).toHaveProperty('data')
    expect(response.body.data.availability).toBe(false)

        expect(response.status).not.toBe(400)
        expect(response.status).not.toBe(404)
        expect(response.body).not.toHaveProperty('errors')
  })
})

describe('DELETE /api/products/:id', () => {
  it('should check for a valid ID', async () => {
    const response = await request(server).delete('/api/products/testing')

    expect(response.status).toBe(400)
    expect(response.body).toHaveProperty('errors')
    expect(response.body.errors).toHaveLength(1)
    expect(response.body.errors[0].msg).toBe('ID no válido')
  })

  it('should return a 404 response for a non-existent product', async () => {
    const productId = 2000
    const response = await request(server).delete(`/api/products/${productId}`)

    expect(response.status).toBe(404)
    expect(response.body.error).toBe('Producto no encontrado')

    expect(response.status).not.toBe(200)
  })

  it('should delete an existing product', async () => {
    const response = await request(server).delete('/api/products/1')

    expect(response.status).toBe(200)
    expect(response.body).toHaveProperty('data')
    expect(response.body.data).toBe('Producto eliminado')
  })
})