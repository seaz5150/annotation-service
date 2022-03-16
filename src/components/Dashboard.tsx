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
import Changes from './Changes';
import JobControl from './JobControl';
import SpeakerLabels from './SpeakerLabels';
import { useSelector } from 'react-redux';

type SizeParams = {
    width: number;
    height: number;
};

function Dashboard({ size: { width, height } }: {size: SizeParams}) 
{
    const dashboard = useSelector((state: any) => state.dashboard);

    const originalModules = ["AudioPlayer", "AnnotationText", "TextTags", "RecordingDetails", "Changes", "JobControl", "SpeakerLabels"];
    const [modules, setModules] = useState(originalModules);

    const closeModule = (moduleName: string) => {
        setModules(modules.filter((m: string) => m !== moduleName));
    };

    const openModule = (moduleName: string) => {
        setModules([...modules, moduleName]);
    };

    useEffect(() => {
        switch (dashboard.type) {
          case "DASHBOARD_CLOSE_MODULE":
            closeModule(dashboard.moduleName);
            break;
          case "DASHBOARD_OPEN_MODULE":
            openModule(dashboard.moduleName);
            break;
        }
      }, [modules]);

    useEffect(() => {
        switch (dashboard.type) {
        case "DASHBOARD_CLOSE_MODULE":
            closeModule(dashboard.moduleName);
            break;
        case "DASHBOARD_OPEN_MODULE":
            openModule(dashboard.moduleName);
            break;
        }
    }, [dashboard]);

    const [audioPlayerDimensions, setAudioPlayerDimensions] = useState({width: 12, height: 7.4});
    const [audioPlayerPosition, setAudioPlayerPosition] = useState({x: 3, y: 0});

    const [annotationTextDimensions, setAnnotationTextDimensions] = useState({width: 6, height: 2});
    const [annotationTextPosition, setAnnotationTextPosition] = useState({x: 3, y: 0});

    const [recordingDetailsDimensions, setRecordingDetailsDimensions] = useState({width: 2.7, height: 11.4});
    const [recordingDetailsPosition, setRecordingDetailsPosition] = useState({x: 10, y: 0});

    const [textTagsDimensions, setTextTagsDimensions] = useState({width: 2.7, height: 11.4});
    const [textTagsPosition, setTextTagsPosition] = useState({x: 0, y: 2});
    
    const [changesDimensions, setChangesDimensions] = useState({width: 2.7, height: 11.4});
    const [changesPosition, setChangesPosition] = useState({x: 0, y: 1});

    const [jobControlDimensions, setJobControlDimensions] = useState({width: 2.7, height: 11.4});
    const [jobControlPosition, setJobControlPosition] = useState({x: 0, y: 1});
    
    const [speakerLabelsDimensions, setSpeakerLabelsDimensions] = useState({width: 2.7, height: 11.4});
    const [speakerLabelsPosition, setSpeakerLabelsPosition] = useState({x: 10, y: 1});

    const layouts = {
        lg: [
            { i: 'AudioPlayer', x: audioPlayerPosition.x, y: audioPlayerPosition.y, w: audioPlayerDimensions.width, h: audioPlayerDimensions.height, isResizable: false},
            { i: 'AnnotationText', x: annotationTextPosition.x, y: annotationTextPosition.y, w: annotationTextDimensions.width, h: annotationTextDimensions.height, isResizable: false},
            { i: 'TextTags', x: textTagsPosition.x, y: textTagsPosition.y, w: textTagsDimensions.width, h: textTagsDimensions.height, isResizable: false},
            { i: 'RecordingDetails', x: recordingDetailsPosition.x, y: recordingDetailsPosition.y, w: recordingDetailsDimensions.width, h: recordingDetailsDimensions.height, isResizable: false},
            { i: 'Changes', x: changesPosition.x, y: changesPosition.y, w: changesDimensions.width, h: changesDimensions.height, isResizable: false},
            { i: 'JobControl', x: jobControlPosition.x, y: jobControlPosition.y, w: jobControlDimensions.width, h: jobControlDimensions.height, isResizable: false},
            { i: 'SpeakerLabels', x: speakerLabelsPosition.x, y: speakerLabelsPosition.y, w: speakerLabelsDimensions.width, h: speakerLabelsDimensions.height, isResizable: false},
        ]
    };

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
            case "Changes":
                setChangesDimensions({width: changesDimensions.width, height: newHeight});
                break;
            case "JobControl":
                setJobControlDimensions({width: jobControlDimensions.width, height: newHeight});
                break;
            case "SpeakerLabels":
                setSpeakerLabelsDimensions({width: speakerLabelsDimensions.width, height: newHeight});
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
                case "Changes":
                    setChangesPosition({x: currentLayout.x, y: currentLayout.y});
                    break;
                case "JobControl":
                    setJobControlPosition({x: currentLayout.x, y: currentLayout.y});
                    break;
                case "SpeakerLabels":
                    setSpeakerLabelsPosition({x: currentLayout.x, y: currentLayout.y});
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
        {modules.some(m => m === "AudioPlayer") &&
            <div key="AudioPlayer">
                <AudioPlayer updateElementGridSize={updateElementGridSize} />
            </div>
        }
        {modules.some(m => m === "AnnotationText") &&
            <div key="AnnotationText">
                <AnnotationText updateElementGridSize={updateElementGridSize} />
            </div>
        }
        {modules.some(m => m === "TextTags") &&
            <div key="TextTags">
                <TextTags updateElementGridSize={updateElementGridSize} />
            </div>
        }
        {modules.some(m => m === "RecordingDetails") &&
            <div key="RecordingDetails">
                <RecordingDetails updateElementGridSize={updateElementGridSize} />
            </div>
        }
        {modules.some(m => m === "Changes") &&
            <div key="Changes">
                <Changes updateElementGridSize={updateElementGridSize} />
            </div>
        }
        {modules.some(m => m === "JobControl") &&
            <div key="JobControl">
                <JobControl updateElementGridSize={updateElementGridSize} />
            </div>
        }
        {modules.some(m => m === "SpeakerLabels") &&
            <div key="SpeakerLabels">
                <SpeakerLabels updateElementGridSize={updateElementGridSize} />
            </div>
        }
    </ResponsiveGridLayout>
    );
}

export default withSize({ refreshMode: 'debounce', refreshRate: 60 })(Dashboard);