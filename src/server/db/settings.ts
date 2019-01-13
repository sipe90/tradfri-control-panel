import { getCollection, getConnection } from '#/db'

export const getSettingsCollection = () => getCollection('settings')

export const collectionExists = () => getSettingsCollection() !== null

export const createCollection = () => getConnection().addCollection('settings', { unique: [ 'key' ]})

export const findSettings = (key: string) => getSettingsCollection().findOne({ key: { $eq: key }})

export const insert = (key: string, object: any) => getSettingsCollection().insert({ ...object, key })

export const update = (object: any) => getSettingsCollection().update(object)

export const remove = (object: any) => getSettingsCollection().remove(object)
