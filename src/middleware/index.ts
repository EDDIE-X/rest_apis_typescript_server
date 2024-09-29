import { Request, Response, NextFunction } from 'express'
import { check, validationResult } from 'express-validator'

export const handleInputErrors = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() })
  }

  next()
}

export const validateProductBody = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  await check('name')
    .notEmpty()
    .withMessage('El nombre de Producto no puede ir vacío')
    .run(req)
  await check('price')
    .isNumeric()
    .withMessage('Valor no válido')
    .notEmpty()
    .withMessage('El nombre de Producto no puede ir vacío')
    .custom((value) => value > 0)
    .withMessage('Precio no válido')
    .run(req)

  next()
}

export const validateProductId = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  await check('id').isInt().withMessage('ID no válido').run(req)

  next()
}

export const validateAvailability = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  await check('availability')
    .notEmpty()
    .withMessage('La disponibilidad de Producto no puede ir vacío')
    .run(req)

  next()
}