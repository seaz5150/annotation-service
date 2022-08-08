import { Layouts, Responsive as ResponsiveGridLayout } from 'react-grid-layout';
import { withSize } from 'react-sizeme';
import "react-grid-layout/css/styles.css"
import "react-resizable/css/styles.css"

import AudioPlayer from "./AudioPlayer"
import TextLabels from "./TextLabels"
import AnnotationTextSegmentContainer from "./text-segments/AnnotationTextSegmentContainer"
import RecordingDetails from "./RecordingDetails"

import {
    useEffect,
    useState,
  } from "react";
import Changes from './Changes';
import JobControl from './JobControl';
import SpeakerLabels from './SpeakerLabels';
import { useDispatch, useSelector } from 'react-redux';
import { bindActionCreators } from '@reduxjs/toolkit';
import { actionCreators } from '../state/Index';
import { getFromLS, saveToLS } from '../utils/CommonUtilities';
import AttachedPlaintext from './attachments/AttachedPlaintext';
import AttachmentTabs from './attachments/AttachmentTabs';

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

    const defaultModules = ["AudioPlayer", "AnnotationTextSegmentContainer", "TextLabels", "RecordingDetails", "Changes", "JobControl", "SpeakerLabels"];
    const [modules, setModules] = useState(getFromLS("modules") as string[] || defaultModules);
    const [layoutBackups, setLayoutBackups] = useState(getFromLS("layoutBackups") as any[] || [] as any[]);
    const jobData = useSelector((state: any) => state.job.jobData);

    const sidePanelWidth = 8;
    const defaultLayouts = {
        lg: [
            { i: 'AudioPlayer', x: 9, y: 0, w: 36, h: 7.4, isResizable: false},
            { i: 'AnnotationTextSegmentContainer', x: 9, y: 2, w: 18, h: 1, isResizable: false},
            { i: 'TextLabels', x: 0, y: 3, w: sidePanelWidth, h: 1, isResizable: false},
            { i: 'RecordingDetails', x: 30, y: 0, w: sidePanelWidth, h: 1, isResizable: false},
            { i: 'Changes', x: 0, y: 1, w: sidePanelWidth, h: 1, isResizable: false},
            { i: 'JobControl', x: 0, y: 2, w: sidePanelWidth, h: 1, isResizable: false},
            { i: 'SpeakerLabels', x: 30, y: 1, w: sidePanelWidth, h: 1, isResizable: false},
            { i: "AttachmentTabs", x: 12, y: 1, w: 12, h: 1, isResizable: false}
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
            let view = jobData.user_interface.views.find((v: { title: string; }) => v.title === moduleName);
            if (view.type === "text") {
                updatedLayouts.lg.push({ i: moduleName, x: 0, y: 9999, w: sidePanelWidth, h: 11.4, isResizable: true});
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
        layoutBackupsToSave = layoutBackupsToSave.filter((l: { i: string; }) => defaultModules.indexOf(l.i) !== -1);
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
        // case "DASHBOARD_TOGGLE_LOCK_LAYOUT":
        //     if (dashboard.lockLayout) {
                
        //     }
        //     break;
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

        changedLayoutsToSave.lg = changedLayoutsToSave.lg.filter((l: { i: string; }) => defaultModules.indexOf(l.i) !== -1);

        let modulesToSave = JSON.parse(JSON.stringify(modules));
        modulesToSave = modulesToSave.filter((m: string) => defaultModules.indexOf(m) !== -1);

        saveToLS("layouts", changedLayoutsToSave);
        saveToLS("modules", modulesToSave);
    };

    const attachmentRenderSwitch = (title: string) => {
        let view = jobData.user_interface.views.find((v: { title: string; }) => v.title === title);
        switch(view.type) {
            case "text":
                return (<div key={title}>
                           <AttachedPlaintext updateElementGridSize={updateElementGridSize} view={view} />
                       </div>);
            default: 
                return null;
        }
    };

    return (
        <ResponsiveGridLayout className="layout"
                              layouts={layouts}
                              breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
                              cols={{ lg: 36, md: 30, sm: 18, xs: 12, xxs: 6 }}
                              rowHeight={10}
                              width={width}
                              onLayoutChange={onLayoutChange}>
            {modules.some(m => m === "AudioPlayer") &&
                <div key="AudioPlayer">
                    <AudioPlayer updateElementGridSize={updateElementGridSize} />
                </div>
            }
            {modules.some(m => m === "AnnotationTextSegmentContainer") &&
                <div key="AnnotationTextSegmentContainer">
                    <AnnotationTextSegmentContainer updateElementGridSize={updateElementGridSize} />
                </div>
            }
            {modules.some(m => m === "TextLabels") &&
                <div key="TextLabels">
                    <TextLabels updateElementGridSize={updateElementGridSize} />
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
                modules.some(m => m === v.title) && attachmentRenderSwitch(v.title)      
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