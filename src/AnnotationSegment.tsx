export default function AnnotationSegment() {

  return (
    <div className="card card-body module module-content p-0 segment">
        <div className="p-0 segment-play-panel">
            <div className="segment-play-panel-content">
                <button className="icon-button segment-play-button">
                    <i className="bi bi-play-fill"></i>
                </button>
                <div className="segment-times ms-2">
                    <p className="segment-time-start">00:00.0</p>
                    <p className="segment-time-end">00:00.0</p>
                </div>
            </div>
        </div>
        <div className="segment-text-panel">
            <p className="segment-text">Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Phasellus et lorem id felis nonummy placerat. Integer lacinia. Praesent in mauris eu tortor porttitor accumsan.</p>
            {/* <select className="form-select form-select-sm custom-select speaker-select">
                <option selected>Open this select menu</option>
                <option className="custom-select-option" value="1">One</option>
                <option value="2">Two</option>
                <option value="3">Three</option>
            </select> */}
            <div className="segment-tag-bar">
                <div className="dropdown">
                <button className="btn btn-sm btn-secondary dropdown-toggle custom-dropdown" type="button" id="dropdownMenuButton1" data-bs-toggle="dropdown" aria-expanded="false">
                    Speaker
                </button>
                <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton1">
                    <li><a className="dropdown-item" href="#">Action</a></li>
                    <li><a className="dropdown-item" href="#">Another action</a></li>
                    <li><a className="dropdown-item" href="#">Something else here</a></li>
                </ul>
                </div>
            </div>
        </div>
    </div>
  );
}