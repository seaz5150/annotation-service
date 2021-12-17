import { Responsive as ResponsiveGridLayout } from 'react-grid-layout';
import { withSize } from 'react-sizeme';
import "react-grid-layout/css/styles.css"
import "react-resizable/css/styles.css"

import AudioPlayer from "./AudioPlayer"
import Settings from "./Settings"

import React, {
    useRef,
  } from "react";

function Dashboard({ size: { width } }) 
{
    // const originalModules = ["AudioPlayer", "Settings"];

    // const onRemoveItem = (moduleId) => {
    //     setItems(modules.filter((i) => i !== moduleId));
    // };

    // const onAddItem = (moduleId) => {
    //     setItems([...modules, moduleId]);
    // };

    const layouts = {
    lg: [
        { i: 'AudioPlayer', x: 1, y: 0, w: 10, h: 11, minH: 11, maxH:11, minW: 5},
        { i: 'Settings', x: 1, y: 0, w: 1, h: 5, minH: 5, minW: 1},
    ],
    };

    return (
    <ResponsiveGridLayout
        className="layout"
        layouts={layouts}
        breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
        cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}
        rowHeight={10}
        width={width}
        // onRemoveItem={onRemoveModule}
        // onAddItem={onAddModule}
        // originalModules={originalModules}
    >
        <div key="AudioPlayer">
            {/* <AudioPlayer url={url}/> */}
            <AudioPlayer />
        </div>
        <div key="Settings">
            <Settings />
        </div>
    </ResponsiveGridLayout>
    );
}

export default withSize({ refreshMode: 'debounce', refreshRate: 60 })(Dashboard);