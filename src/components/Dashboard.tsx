import { Responsive as ResponsiveGridLayout } from 'react-grid-layout';
import { withSize } from 'react-sizeme';
import "react-grid-layout/css/styles.css"
import "react-resizable/css/styles.css"

import AudioPlayer from "./AudioPlayer"
import Settings from "./Settings"
import AnnotationText from "./AnnotationText"
import RecordingDetails from "./RecordingDetails"

import React, {
    useEffect,
    useRef, useState,
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

    const [audioPlayerDimensions, setAudioPlayerDimensions] = useState({width: 12, height: 9});
    const [annotationTextDimensions, setAnnotationTextDimensions] = useState({width: 6, height: 5});

    const moduleRefs = useRef([] as any[]); 
    moduleRefs.current = [];

    const addToModuleRefs = (moduleEl: any, moduleName: any) => {
        if (moduleEl && !moduleRefs.current.includes(moduleEl)) {
            moduleRefs.current.push({
                moduleName: moduleName,
                ref: moduleEl
            });
        }
    }

    useEffect(() => {
        for (var index in moduleRefs.current) {
            console.log("LOL")
            var moduleRef = moduleRefs.current[index];

            switch (moduleRef.moduleName) {
                case "AudioPlayer":
                    // var newWidth = Math.floor(moduleRef.ref.clientWidth / 123);
                    // var newHeight = Math.floor(moduleRef.ref.clientHeight / 17);
                    // setAudioPlayerDimensions({width: newWidth, height: newHeight})
                    break;
                case "AnnotationText":
                    console.log("¨setting anno")
                    //var newWidth = Math.floor((moduleRef.ref.scrollWidth + 10) / 20);
                    var newHeight = Math.floor((moduleRef.ref. + 10) / 20);
                    console.log(moduleRef.ref.clientHeight);
                    setAnnotationTextDimensions({width: 6, height: newHeight})
                    break;
                default:
                    break;
            }
        }
    }, [moduleRefs.current.length]);

    const layouts = {
    lg: [
        { i: 'AudioPlayer', x: 0, y: 0, w: audioPlayerDimensions.width, h: audioPlayerDimensions.height, isResizable: false},
        { i: 'AnnotationText', x: 3, y: 0, w: annotationTextDimensions.width, h: annotationTextDimensions.height, isResizable: false},
        { i: 'Settings', x: 0, y: 0, w: 2.7, h: 5, isResizable: false},
        { i: 'RecordingDetails', x: 10, y: 0, w: 2.7, h: 11.4, isResizable: false},
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
            <AudioPlayer moduleRef={(el: any) => addToModuleRefs(el, "AudioPlayer")}/>
        </div>
        <div key="AnnotationText">
            <AnnotationText moduleRef={(el: any) => addToModuleRefs(el, "AnnotationText")}/>
        </div>
        {/* <div key="Settings">
            <Settings />
        </div> */}
        <div key="RecordingDetails">
            <RecordingDetails moduleRef={(el: any) => addToModuleRefs(el, "RecordingDetails")}/>
        </div>
    </ResponsiveGridLayout>
    );
}

export default withSize({ refreshMode: 'debounce', refreshRate: 60 })(Dashboard);