import { Responsive as ResponsiveGridLayout } from 'react-grid-layout';
import { withSize } from 'react-sizeme';
import "react-grid-layout/css/styles.css"
import "react-resizable/css/styles.css"

import AudioPlayer from "./AudioPlayer"
import TextTags from "./TextTags"
import AnnotationText from "./AnnotationText"
import RecordingDetails from "./RecordingDetails"

import React, {
    useEffect,
    useRef, useState,
  } from "react";

type SizeParams = {
    width: number;
    height: number;
};

function Dashboard({ size: { width, height } }: {size: SizeParams}) 
{
    // const originalModules = ["AudioPlayer", "Settings"];

    // const onRemoveItem = (moduleId) => {
    //     setItems(modules.filter((i) => i !== moduleId));
    // };

    // const onAddItem = (moduleId) => {
    //     setItems([...modules, moduleId]);
    // };

    const [audioPlayerDimensions, setAudioPlayerDimensions] = useState({width: 12, height: 9});
    const [audioPlayerPosition, setAudioPlayerPosition] = useState({x: 0, y: 0});

    const [annotationTextDimensions, setAnnotationTextDimensions] = useState({width: 6, height: 2});
    const [annotationTextPosition, setAnnotationTextPosition] = useState({x: 3, y: 0});

    const [recordingDetailsDimensions, setRecordingDetailsDimensions] = useState({width: 2.7, height: 11.4});
    const [recordingDetailsPosition, setRecordingDetailsPosition] = useState({x: 10, y: 0});

    const [textTagsDimensions, setTextTagsDimensions] = useState({width: 2.7, height: 11.4});
    const [textTagsPosition, setTextTagsPosition] = useState({x: 0, y: 1});

    const layouts = {
        lg: [
            { i: 'AudioPlayer', x: audioPlayerPosition.x, y: audioPlayerPosition.y, w: audioPlayerDimensions.width, h: audioPlayerDimensions.height, isResizable: false},
            { i: 'AnnotationText', x: annotationTextPosition.x, y: annotationTextPosition.y, w: annotationTextDimensions.width, h: annotationTextDimensions.height, isResizable: false},
            { i: 'TextTags', x: textTagsPosition.x, y: textTagsPosition.y, w: textTagsDimensions.width, h: textTagsDimensions.height, isResizable: false},
            { i: 'RecordingDetails', x: recordingDetailsPosition.x, y: recordingDetailsPosition.y, w: recordingDetailsDimensions.width, h: recordingDetailsDimensions.height, isResizable: false},
        ]
    };

    // useEffect(() => {
    //     for (var index in moduleRefs.current) {
    //         console.log("LOL")
    //         var moduleRef = moduleRefs.current[index];

    //         switch (moduleRef.moduleName) {
    //             case "AudioPlayer":
    //                 // var newWidth = Math.floor(moduleRef.ref.clientWidth / 123);
    //                 // var newHeight = Math.floor(moduleRef.ref.clientHeight / 17);
    //                 // setAudioPlayerDimensions({width: newWidth, height: newHeight})
    //                 break;
    //             case "AnnotationText":
    //                 console.log("¨setting anno")
    //                 //var newWidth = Math.floor((moduleRef.ref.scrollWidth + 10) / 20);
    //                 var newHeight = Math.floor((moduleRef.ref.clientHeight + 10) / 20);
    //                 console.log(newHeight)
    //                 setAnnotationTextDimensions({width: 6, height: newHeight})
    //                 break;
    //             default:
    //                 break;
    //         }
    //     }
    // }, []);

    const updateElementGridSize = (moduleName: string, height: number) => {
        // (height + margin) / (rowHeight + margin) - margin default is 10
        var newHeight = (height + 10) / 20;
        switch (moduleName) {
            case "AudioPlayer":
                setAudioPlayerDimensions({width: audioPlayerDimensions.width, height: newHeight});
                break;
            case "AnnotationText":
                setAnnotationTextDimensions({width: annotationTextDimensions.width, height: newHeight});
                break;
            case "RecordingDetails":
                setRecordingDetailsDimensions({width: recordingDetailsDimensions.width, height: newHeight});
                break;
            case "TextTags":
                setTextTagsDimensions({width: textTagsDimensions.width, height: newHeight});
                break;
            default:
                break;
        }
    };

    const onLayoutChange = (_: any, changedLayouts: any) => {
        const changedLayoutsLg = changedLayouts.lg;
        for (let i in changedLayoutsLg) {
            let currentLayout = changedLayoutsLg[i];
            switch (currentLayout.i) {
                case "AudioPlayer":
                    setAudioPlayerPosition({x: currentLayout.x, y: currentLayout.y});
                    break;
                case "AnnotationText":
                    setAnnotationTextPosition({x: currentLayout.x, y: currentLayout.y});
                    break;
                case "RecordingDetails":
                    setRecordingDetailsPosition({x: currentLayout.x, y: currentLayout.y});
                    break;
                case "TextTags":
                    setTextTagsPosition({x: currentLayout.x, y: currentLayout.y});
                    break;
                default:
                    break;
            }
        }
    };

    return (
    <ResponsiveGridLayout
        className="layout"
        layouts={layouts}
        breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
        cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}
        rowHeight={10}
        width={width}
        onLayoutChange={onLayoutChange}
        // onRemoveItem={onRemoveModule}
        // onAddItem={onAddModule}
        // originalModules={originalModules}
    >
        <div key="AudioPlayer">
            <AudioPlayer updateElementGridSize={updateElementGridSize} />
        </div>
        <div key="AnnotationText">
            <AnnotationText updateElementGridSize={updateElementGridSize} />
        </div>
        <div key="TextTags">
            <TextTags updateElementGridSize={updateElementGridSize} />
        </div>
        <div key="RecordingDetails">
            <RecordingDetails updateElementGridSize={updateElementGridSize} />
        </div>
    </ResponsiveGridLayout>
    );
}

export default withSize({ refreshMode: 'debounce', refreshRate: 60 })(Dashboard);