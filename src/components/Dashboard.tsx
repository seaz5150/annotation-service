import { Layouts, Responsive as ResponsiveGridLayout } from 'react-grid-layout';
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
import { useDispatch, useSelector } from 'react-redux';
import { bindActionCreators } from '@reduxjs/toolkit';
import { actionCreators } from '../state';
import { getFromLS, saveToLS } from '../CommonUtilities';

type SizeParams = {
    width: number;
    height: number;
};

function Dashboard({ size: { width, height } }: {size: SizeParams}) {
    const dashboard = useSelector((state: any) => state.dashboard);

    const dispatch = useDispatch();
    const { createActionDashboardInitializeOpenModules, 
            createActionDashboardInitializeModules } = bindActionCreators(actionCreators, dispatch);

    const defaultModules = ["AudioPlayer", "AnnotationText", "TextTags", "RecordingDetails", "Changes", "JobControl", "SpeakerLabels"];
    const [modules, setModules] = useState(defaultModules);

    const defaultLayouts = {
        lg: [
            { i: 'AudioPlayer', x: 3, y: 0, w: 12, h: 7.4, isResizable: false},
            { i: 'AnnotationText', x: 3, y: 0, w: 6, h: 2, isResizable: false},
            { i: 'TextTags', x: 0, y: 2, w: 2.7, h: 11.4, isResizable: false},
            { i: 'RecordingDetails', x: 10, y: 0, w: 2.7, h: 11.4, isResizable: false},
            { i: 'Changes', x: 0, y: 1, w: 2.7, h: 11.4, isResizable: false},
            { i: 'JobControl', x: 0, y: 1, w: 2.7, h: 11.4, isResizable: false},
            { i: 'SpeakerLabels', x: 10, y: 1, w: 2.7, h: 11.4, isResizable: false},
        ]
    };

    const [layouts, setLayouts] = useState(getFromLS("layouts") as Layouts || defaultLayouts);

    const closeModule = (moduleName: string) => {
        setModules(modules.filter((m: string) => m !== moduleName));
    };

    const openModule = (moduleName: string) => {
        setModules([...modules, moduleName]);
    };
    
    useEffect(() => {
        createActionDashboardInitializeModules(defaultModules);
    }, []);

    useEffect(() => {
        createActionDashboardInitializeOpenModules(modules);
    }, [modules]);

    useEffect(() => {
        switch (dashboard.type) {
        case "DASHBOARD_TOGGLE_MODULE":
            if (dashboard.value) {
                openModule(dashboard.moduleName);
            }
            else {
                closeModule(dashboard.moduleName);
            }
            break;
        case "DASHBOARD_RESET_LAYOUT":
            setModules(defaultModules);

            let resetLayouts = JSON.parse(JSON.stringify(defaultLayouts));
            for (let index in resetLayouts.lg) {
                let currentLayout = resetLayouts.lg[index];
                currentLayout.w = layouts.lg[index as unknown as number].w;
                currentLayout.h = layouts.lg[index as unknown as number].h;
            }

            setLayouts(resetLayouts);
            break;
        }
    }, [dashboard]);

    const updateElementGridSize = (moduleName: string, height: number) => {
        // (height + margin) / (rowHeight + margin) - margin default is 10
        var newHeight = (height + 10) / 20;
        let updatedLayouts = JSON.parse(JSON.stringify(layouts));
        let layoutItem = updatedLayouts.lg.find((l: { i: string; }) => l.i === moduleName);
        if (layoutItem) {
            layoutItem.h = newHeight;
        }
        setLayouts(updatedLayouts);
    };

    const onLayoutChange = (_: any, changedLayouts: any) => {
        setLayouts(changedLayouts);
        saveToLS("layouts", changedLayouts);
    };

    return (
        <ResponsiveGridLayout className="layout"
                              layouts={layouts}
                              breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
                              cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}
                              rowHeight={10}
                              width={width}
                              onLayoutChange={onLayoutChange}>
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