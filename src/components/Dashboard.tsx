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
import MapLeaflet from './MapLeaflet';
import AttachedImage from './AttachedImage';
import Plaintext from './Plaintext';
import AttachmentTabs from './AttachmentTabs';

type SizeParams = {
    width: number;
    height: number;
};

function Dashboard({ size: { width, height } }: {size: SizeParams}) {
    const dashboard = useSelector((state: any) => state.dashboard);

    const dispatch = useDispatch();
    const { createActionDashboardInitializeOpenModules, 
            createActionDashboardInitializeModules
          } = bindActionCreators(actionCreators, dispatch);

    const defaultModules = ["AudioPlayer", "AnnotationText", "TextTags", "RecordingDetails", "Changes", "JobControl", "SpeakerLabels"];
    const [modules, setModules] = useState(getFromLS("modules") as string[] || defaultModules);
    const [layoutBackups, setLayoutBackups] = useState(getFromLS("layoutBackups") as any[] || [] as any[]);
    const jobData = useSelector((state: any) => state.job.jobData);

    const defaultLayouts = {
        lg: [
            { i: 'AudioPlayer', x: 3, y: 0, w: 12, h: 7.4, isResizable: false},
            { i: 'AnnotationText', x: 3, y: 2, w: 6, h: 2, isResizable: false},
            { i: 'TextTags', x: 0, y: 3, w: 2.7, h: 11.4, isResizable: false},
            { i: 'RecordingDetails', x: 10, y: 0, w: 2.7, h: 11.4, isResizable: false},
            { i: 'Changes', x: 0, y: 1, w: 2.7, h: 11.4, isResizable: false},
            { i: 'JobControl', x: 0, y: 2, w: 2.7, h: 11.4, isResizable: false},
            { i: 'SpeakerLabels', x: 10, y: 1, w: 2.7, h: 11.4, isResizable: false},
            { i: "AttachmentTabs", x: 4, y: 1, w: 4, h: 11.4, isResizable: false}
        ]
    };

    const [layouts, setLayouts] = useState(getFromLS("layouts") as Layouts || defaultLayouts);

    const closeModule = (moduleName: string) => {
        setModules(modules.filter((m: string) => m !== moduleName));
        let layoutsJSON = JSON.parse(JSON.stringify(layouts));
        let backupLayout = layoutsJSON.lg.find((m: { i: string; }) => m.i === moduleName);
        setLayoutBackups([...layoutBackups, backupLayout]);
    };

    const openModule = (moduleName: string) => {
        let recoveredLayout = layoutBackups.find(m => m.i === moduleName);
        if (!recoveredLayout) {
            recoveredLayout = defaultLayouts.lg.find(m => m.i === moduleName); 
        }
        if (recoveredLayout) {
            let updatedLayouts = JSON.parse(JSON.stringify(layouts));
            updatedLayouts.lg.push(recoveredLayout);
            setLayouts(updatedLayouts);
            setLayoutBackups(layoutBackups.filter(m => m.i !== moduleName));
        }
        // Module is a dynamic attachment.
        else {
            let updatedLayouts = JSON.parse(JSON.stringify(layouts));
            let view = jobData.user_interface.views.find((v: { label: string; }) => v.label === moduleName);
            if (view.type === "text") {
                updatedLayouts.lg.push({ i: moduleName, x: 0, y: 9999, w: 2.7, h: 11.4, isResizable: false});
            }
            setLayouts(updatedLayouts);
        }
        setModules([...modules, moduleName]);
    };
    
    useEffect(() => {
        createActionDashboardInitializeModules(defaultModules);
    }, []);

    useEffect(() => {
        createActionDashboardInitializeOpenModules(modules);
    }, [modules]);

    useEffect(() => {
        let layoutBackupsToSave = JSON.parse(JSON.stringify(layoutBackups));
        for (let index in layoutBackupsToSave) {
            let currentLayout = layoutBackupsToSave[index];
            if (defaultModules.indexOf(currentLayout.i) === -1) {
                layoutBackupsToSave.splice(index, 1);
            }
        }
        saveToLS("layoutBackups", layoutBackups);
    }, [layoutBackups]);

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
        case "DASHBOARD_TOGGLE_MODULE_STATIC":
            let updatedLayouts = JSON.parse(JSON.stringify(layouts));
            let layoutItem = updatedLayouts.lg.find((l: { i: string; }) => l.i === dashboard.moduleName);
            if (layoutItem) {
                layoutItem.static = dashboard.value;
            }
            setLayouts(updatedLayouts);
            break;
        case "DASHBOARD_RESET_LAYOUT":
            setModules(defaultModules);

            let resetLayouts = JSON.parse(JSON.stringify(defaultLayouts));
            for (let index in resetLayouts.lg) {
                let currentLayout = resetLayouts.lg[index];

                let layoutDimensionsSource = layouts.lg.find(m => m.i === currentLayout.i);
                if (layoutDimensionsSource) {
                    currentLayout.w = layoutDimensionsSource.w;
                    currentLayout.h = layoutDimensionsSource.h;
                }
                else {
                    layoutDimensionsSource = layoutBackups.find(m => m.i === currentLayout.i)
                    currentLayout.w = layoutDimensionsSource?.w;
                    currentLayout.h = layoutDimensionsSource?.h;
                }
            }

            setLayouts(resetLayouts);
            setLayoutBackups([]);
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
        delete changedLayouts.sm;
        delete changedLayouts.md;
        delete changedLayouts.xs;
        delete changedLayouts.xxs;
        setLayouts(changedLayouts);

        let changedLayoutsToSave = JSON.parse(JSON.stringify(changedLayouts));
        delete changedLayoutsToSave.sm;
        delete changedLayoutsToSave.md;
        delete changedLayoutsToSave.xs;
        delete changedLayoutsToSave.xxs;

        for (let index in changedLayoutsToSave.lg) {
            let currentLayout = changedLayoutsToSave.lg[index];
            if (defaultModules.indexOf(currentLayout.i) === -1) {
                changedLayoutsToSave.lg.splice(index, 1);
            }
        }
        let modulesToSave = JSON.parse(JSON.stringify(modules));
        for (let index in modulesToSave) {
            let currentModule = modulesToSave[index];

            if (defaultModules.indexOf(currentModule) === -1) {
                modulesToSave.splice(index, 1);
            }
        }
        saveToLS("layouts", changedLayoutsToSave);
        saveToLS("modules", modulesToSave);
    };

    const attachmentRenderSwitch = (label: string) => {
        let view = jobData.user_interface.views.find((v: { label: string; }) => v.label === label);
        switch(view.type) {
            case "text":
                return (<div key={label}>
                           <Plaintext updateElementGridSize={updateElementGridSize} view={view} />
                       </div>);
            default: 
                return null;
        }
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
            {jobData && jobData.user_interface.views.map((v: any) =>
                modules.some(m => m === v.label) && attachmentRenderSwitch(v.label)      
            )}
            {modules.some(m => m === "AttachmentTabs") &&
                <div key="AttachmentTabs">
                    <AttachmentTabs updateElementGridSize={updateElementGridSize} />
                </div>
            }
        </ResponsiveGridLayout>
    );
}

export default withSize({ refreshMode: 'debounce', refreshRate: 60 })(Dashboard);