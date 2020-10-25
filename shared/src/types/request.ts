export interface GroupUpdateRequest {
    id: number
    name?: string
    on?: boolean
    brightness?: number
}

export interface CreateGatewayRequest {
    name: string
    hostname: string
    identity: string
    psk: string
}

export interface UpdateGatewayRequest {
    name: string
    hostname: string
}

export interface UpdateCircadianSettingsRequest {
    latitude: string
    longitude: string
}

export interface GenerateIdentityRequest {
    hostname: string
    securityCode: string
}

export interface TestConnectionRequest {
    hostname: string
    identity: string
    psk: string
}

export interface ConnectionTestResponse {
    success: boolean
    error: string | null
}