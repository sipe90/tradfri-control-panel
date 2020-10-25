import express from 'express'
import { CircadianSettings } from '@tradfri-control-panel/shared'

const router = express.Router()

let circadianSettings: CircadianSettings | null = null

router.get('/circadian', (_req, res) =>
    circadianSettings ? res.json(circadianSettings) : res.sendStatus(404)
)

router.post('/circadian', (req, res) => {
    circadianSettings = {
        ...(circadianSettings || { groupIds: [] }),
        latitude: req.body.latitude,
        longitude: req.body.longitude
    }
    res.sendStatus(201)
})

router.post('/circadian/groups', (req, res) => {
    const groupId = req.query.groupId as string
    if (!circadianSettings || !groupId || circadianSettings.groupIds.includes(groupId)) {
        return res.sendStatus(500)
    }
    circadianSettings = {
        ...circadianSettings,
        groupIds: circadianSettings.groupIds.concat(groupId)
    }
    res.sendStatus(204)
})

router.delete('/circadian/groups', (req, res) => {
    const groupId = req.query.groupId as string
    if (!circadianSettings || !groupId || !circadianSettings.groupIds.includes(groupId)) {
        return res.sendStatus(500)
    }
    circadianSettings = {
        ...circadianSettings,
        groupIds: circadianSettings.groupIds.filter((id) => id !== groupId)
    }
    res.sendStatus(204)
})

export default router
