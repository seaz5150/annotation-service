import { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css"
import { Responsive as ResponsiveGridLayout } from 'react-grid-layout';
import { withSize } from 'react-sizeme';
import "react-grid-layout/css/styles.css"
import "react-resizable/css/styles.css"

import AudioPlayer from "./AudioPlayer"

// const [name, setName] = useState("mario");
// setName("luigi");

const url = "https://www.mfiles.co.uk/mp3-downloads/gs-cd-track2.mp3";

function Dashboard({ size: { width } }) 
{
    const layouts = {
    lg: [
        { i: 'a', x: 0, y: 0, w: 1, h: 2 },
        { i: 'b', x: 1, y: 0, w: 3, h: 2 },
        { i: 'c', x: 4, y: 0, w: 1, h: 2 },
        { i: 'd', x: 0, y: 2, w: 2, h: 2 },
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
        <div key="a">
        <AudioPlayer url={url}/>
        </div>
    </ResponsiveGridLayout>
    );
}

export default withSize({ refreshMode: 'debounce', refreshRate: 60 })(Dashboard);