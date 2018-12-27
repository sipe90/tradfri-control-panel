import SQL, { SQLStatement } from 'sql-template-strings'
import { getConnection } from '#/db'
import { Omit, Gateway } from 'shared/types';

const all = async (sql: SQLStatement) => (await getConnection()).all(sql)
const get = async (sql: SQLStatement) => (await getConnection()).get(sql)
const run = async (sql: SQLStatement) => (await getConnection()).run(sql)

const ins = async (sql: SQLStatement) => (await run(sql)).lastID
const del = async (sql: SQLStatement) => (await run(sql)).changes > 0

export const selectAllGateways = async () =>
    all(SQL`SELECT id, name, hostname, identity, psk FROM tradfri_gateway`)

export const selectGateway: () => Promise<Gateway> = async () =>
    get(SQL`SELECT id, name, hostname, identity, psk FROM tradfri_gateway LIMIT 1`)

export const insertGateway = async ({ name, hostname, identity, psk }: Omit<Gateway, 'id' | 'connected'>) =>
    ins(SQL`INSERT INTO tradfri_gateway (name, hostname, identity, psk) VALUES (${name}, ${hostname}, ${identity}, ${psk})`)

export const deleteGatewayById = async (gatewayId: number) =>
    del(SQL`DELETE FROM tradfri_gateway WHERE id = ${gatewayId}`)
