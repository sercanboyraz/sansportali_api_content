import React from 'react'
import { ListGroup, InputGroup, Button, FormControl, Modal } from 'react-bootstrap'
const axios = require('axios');
// Make a request for a user with a given ID

export default class Content extends React.Component {

    state = {
        permissions: null,
        show: false,
        ssid: "",
        password: ""
    }

    constructor(props) {
        super(props);
        this.setState({ permissions: this.props.permission });
    }

    componentDidMount() {
        this.setState({ permissions: this.props.permission });
        var getLocalStorageUserId = localStorage.getItem('userPortalId');
        if (getLocalStorageUserId && !this.props.permission) {
            if (getLocalStorageUserId) {
                axios.get('https://api.boykaf.xyz/webContentPermission?userId=' + getLocalStorageUserId)
                    .then(responsePermission => {
                        if (responsePermission.data) {
                            this.setState({ permissions: responsePermission.data });
                        }
                    })
            }
        }

        var webview = document.getElementById('webview');
        webview.addEventListener('dom-ready', function () {
            webview.insertCSS(".modal-body.blockElement,.lgbtn,.relative,.grid_4,.footer-list,.footerText,.gradient-gold,.bottom-followus,.loggedOut,.admatic_interstitial_iframe_content_main,.page-homepage-index__container-widget,.page-homepage-index__container-widget--social-posts,.widget-footer,.widget-nesine-most-played-coupons,.widget-nesine-most-played-coupons--desktop,.logos,.widget,.footer-nav,.footer-links,[class^='Stage_Rectangle'],.widget-legacy-link-banner,.widget-social-post__follow-button,.adform-adbox,.admatic_interstitial_logo_area_span,iframe,.c,.b,.a,.medyanet-ad-models-pageskin,.mpu,.userbox,.lgnform { display: none !important}");
            webview.insertCSS(".coupon__bottom-line  { display:block; } ");
            webview.insertCSS(".coupon__select-input  { padding-left: 45px; text-align:right !important; }");
            webview.insertCSS(".coupon__select-box  { width: 100%; } ");
        });

        window.addEventListener('load', (event) => {
            let webview = document.querySelector('webview');
            let windowWidth = document.documentElement.clientWidth;
            let windowHeight = document.documentElement.clientHeight;
            let controlsHeight = this.getControlsHeight();
            let webviewHeight = windowHeight - controlsHeight;
            webview.style.width = (windowWidth - 50) + 'px';
            webview.style.height = controlsHeight + 'px';

        });
    }

    getControlsHeight = () => {
        let controls = document.querySelector('#root');
        if (controls) {
            return controls.offsetHeight;
        }
        return 0;
    }

    navigateTo = (url) => {
        document.querySelector('webview').src = url;
    }

    componentDidUpdate(prevProps) {
        if (this.props.permission && prevProps.permission && this.props.permission.length !== prevProps.permission.length) {
            this.setState({ permissions: this.props.permission });
        }
    }

    handleClose = () => this.setState({ show: false });
    handleShow = () => this.setState({ show: true });
    handleSave = () => {
        localStorage.setItem("SSID", this.state.ssid);
        localStorage.setItem("Password", this.state.password);
        this.handleClose();
    }

    refresh = (e) => {
        e.preventDefault();
        //window.location.reload();
    }

    // setWifiPassword = (pass) => this.setState({ password: pass });
    // setWifiSSID = (id) => this.setState({ ssid: id });
    render() {
        const { permissions } = this.state;
        // const wifiList = JSON.parse(localStorage.getItem("wifis"));
        return (
            <div>
                <header className="main-head">
                    <nav className="head-nav">
                        <ul className="menu">
                            {
                                permissions &&
                                permissions.map((data) => (
                                    <li key={data.id} onClick={() => this.navigateTo(data.webContent.webUrl)}>
                                        <img src={data.webContent.logoUrl} width="40" style={{ marginLeft: 20 }} />
                                        <span>{data.webContent.displayName}</span>
                                    </li>
                                ))
                            }
                        </ul>
                    </nav>
                    <div>
                        {/* <div style={{ padding: 3, width: '100%', position: 'absolute', bottom: 1 }}>
                        <Button variant="dark" onClick={e => this.refresh(e)} id="refreshButton" >
                            y
                    </Button> */}
                        {/* <Button variant="dark" onClick={this.handleShow} style={{ padding: 3, width: '100%', position: 'absolute', bottom: 1 }} >
                        wifi
                    </Button> */}
                        {/* </div> */}
                        {/* <Modal show={this.state.show} onHide={this.handleClose}>
                        <Modal.Header closeButton>
                            <Modal.Title>Wifi</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <ListGroup defaultActiveKey="#link1">
                                {
                                    wifiList &&
                                    wifiList.map((data) =>
                                        <ListGroup.Item action style={{ fontSize: 12, padding: 0, margin: 0, height: 39 }} onSelect={() => this.setWifiSSID(data.ssid)}>
                                            <InputGroup className="mb-3">
                                                <InputGroup.Prepend>
                                                    <InputGroup.Text id="basic-addon3">
                                                        {
                                                            data.ssid
                                                        }
                                                    </InputGroup.Text>
                                                </InputGroup.Prepend>
                                                <FormControl id={data.ssid} aria-describedby="basic-addon3" onChange={(e) => this.setWifiPassword(e.target.value)} onClick={() => this.setWifiSSID(data.ssid)} />
                                            </InputGroup>
                                        </ListGroup.Item>
                                    )
                                }
                            </ListGroup>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="secondary" onClick={this.handleClose}>
                                Close
                            </Button>
                            <Button variant="primary" onClick={() => this.handleSave()}>
                                Save Changes
                            </Button>
                        </Modal.Footer>
                    </Modal> */}
                    </div>
                </header>
                <div className="wrap-all-the-things">
                    <webview id="webview" allowpopups={true}></webview>
                </div>
            </div>
        )
    }
}