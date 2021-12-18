import { Responsive as ResponsiveGridLayout } from 'react-grid-layout';
import { withSize } from 'react-sizeme';
import "react-grid-layout/css/styles.css"
import "react-resizable/css/styles.css"

import AudioPlayer from "./AudioPlayer"
import Settings from "./Settings"
import AnnotationText from "./AnnotationText"
import RecordingDetails from "./RecordingDetails"

import React, {
    useRef,
  } from "react";

type SizeParams = {
    width: number;
};

function Dashboard({ size: { width } }: {size: SizeParams}) 
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
        { i: 'AudioPlayer', x: 0, y: 0, w: 12, h: 9, isResizable: false},
        { i: 'AnnotationText', x: 3, y: 0, w: 6, h: 5, isResizable: false},
        { i: 'Settings', x: 0, y: 0, w: 2.7, h: 5, isResizable: false},
        { i: 'RecordingDetails', x: 10, y: 0, w: 2.7, h: 10, isResizable: false},
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
            <AudioPlayer />
        </div>
        <div key="AnnotationText">
            <AnnotationText />
        </div>
        {/* <div key="Settings">
            <Settings />
        </div> */}
        <div key="RecordingDetails">
            <RecordingDetails />
        </div>
    </ResponsiveGridLayout>
    );
}

export default withSize({ refreshMode: 'debounce', refreshRate: 60 })(Dashboard);