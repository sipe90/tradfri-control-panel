const SQL = require('sql-template-strings')
const { getConnection } = require('db')

const all = async (sql) => (await getConnection()).all(sql)
const get = async (sql) => (await getConnection()).get(sql)
const run = async (sql) => (await getConnection()).run(sql)

const ins = async (sql) => (await run(sql)).lastID
const del = async (sql) => (await run(sql)).changes > 0

const selectAllGateways = async () =>
    all(SQL`SELECT id, name, hostname, identity, psk FROM tradfri_gateway`)

const selectGateway = async () =>
    get(SQL`SELECT id, name, hostname, identity, psk FROM tradfri_gateway LIMIT 1`)

const selectGatewayById = async (gatewayId) =>
    get(SQL`SELECT id, name, hostname, identity, psk FROM tradfri_gateway WHERE id = ${gatewayId}`)

const insertGateway = async ({ name, hostname, identity, psk }) =>
    ins(SQL`INSERT INTO tradfri_gateway (name, hostname, identity, psk) VALUES (${name}, ${hostname}, ${identity}, ${psk})`)

const deleteGatewayById = async (gatewayId) =>
    del(SQL`DELETE FROM tradfri_gateway WHERE id = ${gatewayId}`)

module.exports = {
    selectAllGateways,
    selectGateway,
    selectGatewayById,
    insertGateway,
    deleteGatewayById
}
