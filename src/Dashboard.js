import { Responsive as ResponsiveGridLayout } from 'react-grid-layout';
import { withSize } from 'react-sizeme';
import "react-grid-layout/css/styles.css"
import "react-resizable/css/styles.css"

import AudioPlayer from "./AudioPlayer"

function Dashboard({ size: { width } }) 
{
    const layouts = {
    lg: [
        { i: 'AudioPlayer', x: 1, y: 0, w: 10, h: 1.5, isResizable: false },
    ],
    };
    return (
    <ResponsiveGridLayout
        className="layout"
        layouts={layouts}
        breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
        cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}
        rowHeight={120}
        width={width}
    >
        <div key="AudioPlayer">
            {/* <AudioPlayer url={url}/> */}
            <AudioPlayer />
        </div>
    </ResponsiveGridLayout>
    );
}

export default withSize({ refreshMode: 'debounce', refreshRate: 60 })(Dashboard);