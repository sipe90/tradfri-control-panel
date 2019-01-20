
import Circadian from '@/components/settings/Circadian'
import Tabbed from '@/components/Tabbed'
import { IAppState } from '@/reducers'
import { AppDispatch } from '@/types'
import React, { Component } from 'react'
import { connect } from 'react-redux'

class SettingsModule extends Component {
    public render = () => {
        const tabs = [{
            title: 'Circadian',
            component: <Circadian/>
        }]
        return <Tabbed tabs={tabs}/>
    }
}

const mapStateToProps = (state: IAppState) => ({

})

const mapDispatchToProps = (dispatch: AppDispatch) => ({

})

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(SettingsModule)
