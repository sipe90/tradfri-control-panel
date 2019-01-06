import SQL, { SQLStatement } from 'sql-template-strings'

import { getConnection } from '#/db'

interface IGatewayEntity {
    name: string
    hostname: string
    identity: string
    psk: string
}

// const all = async (sql: SQLStatement) => (await getConnection()).all(sql)
const get = async (sql: SQLStatement) => (await getConnection()).get(sql)
const run = async (sql: SQLStatement) => (await getConnection()).run(sql)

const ins = async (sql: SQLStatement) => (await run(sql)).lastID
const del = async (sql: SQLStatement) => (await run(sql)).changes > 0
const upd = del

export const selectGateway: () => Promise<IGatewayEntity> = async () =>
    get(SQL`SELECT name, hostname, identity, psk FROM tradfri_gateway LIMIT 1`)

export const insertGateway = async ({ name, hostname, identity, psk }: IGatewayEntity) =>
    ins(SQL`INSERT INTO tradfri_gateway (name, hostname, identity, psk)
        VALUES (${name}, ${hostname}, ${identity}, ${psk})`)

export const updateGateway = async ({ name, hostname }: Partial<IGatewayEntity>) =>
    upd(SQL`UPDATE tradfri_gateway SET name = ${name}, hostname = ${hostname}`)

export const deleteGateway = async () =>
    del(SQL`DELETE FROM tradfri_gateway`)
