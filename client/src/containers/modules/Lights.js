import React, { Component } from 'react'

import { Card } from 'antd'

import 'containers/modules/Lights.css'

class Lights extends Component {
    
    constructor() {
        super()
    }

    render() {
        return (
            <div className="card-container">
                <Card className="card" title = "Card">Carddddddddddddddddddddddddddddddddddddddd</Card>
                <Card className="card" title = "Card">Carddddddddddddddddddddddddddddddddddddddd</Card>
                <Card className="card" title = "Card">Carddddddddddddddddddddddddddddddddddddddd</Card>
                <Card className="card" title = "Card">Carddddddddddddddddddddddddddddddddddddddd</Card>
                <Card className="card" title = "Card">Carddddddddddddddddddddddddddddddddddddddd</Card>
                <Card className="card" title = "Card">Carddddddddddddddddddddddddddddddddddddddd</Card>
                <Card className="card" title = "Card">Carddddddddddddddddddddddddddddddddddddddd</Card>
                <Card className="card" title = "Card">Carddddddddddddddddddddddddddddddddddddddd</Card>
            </div>
        )
    }
}

export default Lights
