import { Router } from 'express'
import {
  createProduct,
  deleteProduct,
  getProductById,
  getProducts,
  updateAvailability,
  updateProduct,
} from './handlers/product'
import {
  handleInputErrors,
  validateAvailability,
  validateProductBody,
  validateProductId,
} from './middleware'

const router = Router()
/**
 * @swagger
 * components:
 *  schemas:
 *    Product:
 *      type: object
 *      properties:
 *        id:
 *          type: integer
 *          description: The Product ID
 *          example: 1
 *        name:
 *            type: string
 *            description: The Product Name
 *            example: Product 1
 *        price:
 *            type: number
 *            description: The Product Price
 *            example: 100
 *        availability:
 *            type: boolean
 *            description: The Product Availability
 *            example: true
 *    DeletedProduct:
 *      type: object
 *      properties:
 *        data:
 *          type: string
 *          description: The message indicating the product was deleted
 *          example: Producto Eliminado
 */

/**
 * @swagger
 * /api/products:
 *  get:
 *    summary: Get a list of all products
 *    tags:
 *      - Products
 *    description: Returns a list of products
 *    responses:
 *      200:
 *        description: Successful response
 *        content:
 *          application/json:
 *            schema:
 *              type: array
 *              items:
 *                $ref: '#/components/schemas/Product'
 */
router.get('/', getProducts)

/**
 * @swagger
 * /api/products/{id}:
 *  get:
 *    summary: Gets a product by ID
 *    tags:
 *      - Products
 *    description: Returns a product based on its unique ID
 *    parameters:
 *      - name: id
 *        in: path
 *        description: Product ID
 *        required: true
 *        schema:
 *          type: integer
 *    responses:
 *      200:
 *        description: Successful response
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Product'
 *      404:
 *        description: Product not found
 *      400:
 *        description: Bad request - Invalid ID
 */
router.get('/:id', validateProductId, handleInputErrors, getProductById)

/**
 * @swagger
 * /api/products:
 *  post:
 *    summary: Creates a new product
 *    tags:
 *      - Products
 *    description: Creates a new product with the provided data
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              name:
 *                type: string
 *                description: The Product Name
 *                example: Product 1
 *              price:
 *                type: number
 *                description: The Product Price
 *                example: 100
 *    responses:
 *      201:
 *        description: Product created successfully
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Product'
 *      400:
 *        description: Bad request - Invalid input data
 */
router.post('/', validateProductBody, handleInputErrors, createProduct)

/**
 * @swagger
 * /api/products/{id}:
 *  put:
 *    summary: Updates a product with user input
 *    tags:
 *      - Products
 *    description: Returns the updated product
 *    parameters:
 *      - name: id
 *        in: path
 *        description: Product ID
 *        required: true
 *        schema:
 *          type: integer
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              name:
 *                type: string
 *                description: The Product Name
 *                example: Product 1
 *              price:
 *                type: number
 *                description: The Product Price
 *                example: 100
 *              availability:
 *                type: boolean
 *                description: The Product Availability
 *                example: true
 *    responses:
 *      200:
 *        description: Successful response
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Product'
  *      400:
 *        description: Bad request - Invalid ID or input data
 *      404:
 *        description: Product not found
 */
router.put(
  '/:id',
  validateProductId,
  validateProductBody,
  validateAvailability,
  handleInputErrors,
  updateProduct
)

/**
 * @swagger
 * /api/products/{id}:
 *  patch:
 *    summary: Update Product availability
 *    tags:
 *      - Products
 *    description: Returns the updated availability
 *    parameters:
 *      - name: id
 *        in: path
 *        description: Product ID
 *        required: true
 *        schema:
 *          type: integer
 *    responses:
 *      200:
 *        description: Successful response
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Product'
 *      400:
 *        description: Bad request - Invalid ID
 *      404:
 *        description: Product not found
 */
router.patch('/:id', validateProductId, handleInputErrors, updateAvailability)

/**
 * @swagger
 * /api/products/{id}:
 *  delete:
 *    summary: Deletes a Product by a given ID
 *    tags:
 *      - Products
 *    description: Returns a confirmation message
 *    parameters:
 *      - name: id
 *        in: path
 *        description: The ID of the product to delete
 *        required: true
 *        schema:
 *          type: integer
 *    responses:
 *      200:
 *        description: Successful response
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/DeletedProduct'
 *      400:
 *        description: Bad request - Invalid ID
 *      404:
 *        description: Product not found
 */
router.delete('/:id', validateProductId, handleInputErrors, deleteProduct)

export default router
