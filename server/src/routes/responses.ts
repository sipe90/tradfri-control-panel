import { Response } from 'express'
import R from 'ramda'

export const okOrNotFound = (res: Response) => (body: any) => R.isNil(body) ? res.sendStatus(404) : res.json(body)

export const ok = (res: Response) => (body: any) => res.json(body)
export const notFound = (res: Response) => () => res.sendStatus(404)
export const created =  (res: Response) => () => res.sendStatus(201)
export const noContent =  (res: Response) => () => res.sendStatus(204)
