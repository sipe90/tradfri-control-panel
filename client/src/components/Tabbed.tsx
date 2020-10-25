import { Tabs } from 'antd'
import { TabsProps } from 'antd/lib/tabs'
import React from 'react'
import { Sticky, StickyContainer } from 'react-sticky'

const TabPane = Tabs.TabPane

interface Tab {
    title: string
    component: JSX.Element
}

interface TabbedProps {
    tabs: Tab[]
}

const Tabbed: React.FC<TabbedProps> = (props) => {
    return (
        <StickyContainer>
            <Tabs
                style={{ textAlign: 'center' }}
                animated={{ inkBar: true, tabPane: false }}
                renderTabBar={renderTabBar}
            >
                {props.tabs.map(renderTabPane)}
            </Tabs>
        </StickyContainer>
    )
}

const renderTabBar = (props: TabsProps, DefaultTabBar: any) => (
    <Sticky bottomOffset={80}>
        {({ style }) => <DefaultTabBar {...props} style={{ ...style, zIndex: 1, background: '#fff' }} />}
    </Sticky>
)

const renderTabPane = ({ title, component }: Tab, index: number) => (
    <TabPane key={String(index)} tab={title}>
        {component}
    </TabPane>
)

export default Tabbed
