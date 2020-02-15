import React from 'react'
import { ListGroup, InputGroup, Button, FormControl, Modal, OverlayTrigger, Tooltip } from 'react-bootstrap'
import { SaveOutlined, LoopOutlined, WifiOutlined, PowerSettingsNew, DoneAll, HighlightOff } from '@material-ui/icons';

const axios = require('axios');
const electron = window.require('electron');
const fs = electron.remote.require('fs');
const ipcRenderer = electron.ipcRenderer;
// Make a request for a user with a given ID

export default class Content extends React.Component {

    state = {
        permissions: null,
        show: false,
        showShutdown: false,
        ssid: "",
        password: ""
    }

    constructor(props) {
        super(props);
        this.setState({ permissions: this.props.permission });
    }

    componentDidMount() {
        this.setState({ permissions: this.props.permission });
        this.setState({ wifiList: JSON.parse(localStorage.getItem("wifis")) });

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
            webview.insertCSS(".popupLoginMain,.footerContainer,.headerLogin,.modal-body.blockElement,.lgbtn,.relative,.grid_4,.footer-list,.footerText,.gradient-gold,.bottom-followus,.loggedOut,.admatic_interstitial_iframe_content_main,.page-homepage-index__container-widget,.page-homepage-index__container-widget--social-posts,.widget-footer,.widget-nesine-most-played-coupons,.widget-nesine-most-played-coupons--desktop,.logos,.widget,.footer-nav,.footer-links,[class^='Stage_Rectangle'],.widget-legacy-link-banner,.widget-social-post__follow-button,.adform-adbox,.admatic_interstitial_logo_area_span,iframe,.c,.b,.a,.medyanet-ad-models-pageskin,.mpu,.userbox,.lgnform { display: none !important}");
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
            webview.style.width = (windowWidth - 1) + 'px';
            webview.style.height = webviewHeight + 'px';

        });
    }

    componentWillUpdate() {
        var webview = document.getElementById('webview');
        webview.addEventListener('dom-ready', function () {
            webview.insertCSS(".popupLoginMain,.footerContainer,.headerLogin,.modal-body.blockElement,.lgbtn,.relative,.grid_4,.footer-list,.footerText,.gradient-gold,.bottom-followus,.loggedOut,.admatic_interstitial_iframe_content_main,.page-homepage-index__container-widget,.page-homepage-index__container-widget--social-posts,.widget-footer,.widget-nesine-most-played-coupons,.widget-nesine-most-played-coupons--desktop,.logos,.widget,.footer-nav,.footer-links,[class^='Stage_Rectangle'],.widget-legacy-link-banner,.widget-social-post__follow-button,.adform-adbox,.admatic_interstitial_logo_area_span,iframe,.c,.b,.a,.medyanet-ad-models-pageskin,.mpu,.userbox,.lgnform { display: none !important}");
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
            webview.style.width = (windowWidth - 1) + 'px';
            webview.style.height = webviewHeight + 'px';
        });
    }


    componentDidUpdate() {
        var webview = document.getElementById('webview');
        webview.addEventListener('dom-ready', function () {
            webview.insertCSS(".popupLoginMain,.footerContainer,.headerLogin,.modal-body.blockElement,.lgbtn,.relative,.grid_4,.footer-list,.footerText,.gradient-gold,.bottom-followus,.loggedOut,.admatic_interstitial_iframe_content_main,.page-homepage-index__container-widget,.page-homepage-index__container-widget--social-posts,.widget-footer,.widget-nesine-most-played-coupons,.widget-nesine-most-played-coupons--desktop,.logos,.widget,.footer-nav,.footer-links,[class^='Stage_Rectangle'],.widget-legacy-link-banner,.widget-social-post__follow-button,.adform-adbox,.admatic_interstitial_logo_area_span,iframe,.c,.b,.a,.medyanet-ad-models-pageskin,.mpu,.userbox,.lgnform { display: none !important}");
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
            webview.style.width = (windowWidth - 1) + 'px';
            webview.style.height = webviewHeight + 'px';
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

    handleClose = () => {
        this.setState({ show: false });
    }

    handleCloseShutdown = () => {
        this.setState({ showShutdown: false });
    }

    handleShow = () => {
        this.setState({ show: true });
    }

    handleSave = () => {
        localStorage.setItem("SSID", this.state.ssid);
        localStorage.setItem("Password", this.state.password);
        ipcRenderer.invoke('set-wifi-names', null).then((result) => {
            this.handleClose();
        })
    }

    refresh = (e) => {
        e.preventDefault();
        window.location.reload();
    }

    refreshWifi = () => {
        ipcRenderer.invoke('get-wifi-names', null).then((result) => {
            console.log(result);
            this.setState({ wifiList: result });
        })
    }

    shutdown = () => {
        ipcRenderer.invoke('shutdown_event', null).then((result) => {

        })
    }

    setWifiPassword = (pass) => this.setState({ password: pass });
    setWifiSSID = (id) => this.setState({ ssid: id });

    render() {
        const { permissions } = this.state;
        return (
            <div>
                <header className="main-head" >
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
                        <div className="speedButton" >
                            <OverlayTrigger
                                key="top"
                                placement="top"
                                overlay={
                                    <Tooltip id={`tooltip-PowerSettingsNew`}><strong>Kapat</strong></Tooltip>
                                }>
                                <Button variant="dark" onClick={e => this.setState({ showShutdown: true })} style={{ marginRight: 5 }} >
                                    <PowerSettingsNew ></PowerSettingsNew>
                                </Button>
                            </OverlayTrigger>

                            <OverlayTrigger
                                key="top"
                                placement="top"
                                overlay={
                                    <Tooltip id={`tooltip-LoopOutlined`}><strong>Yenile</strong></Tooltip>
                                }>
                                <Button variant="dark" onClick={e => this.refresh(e)} id="refreshButton" style={{ marginRight: 5 }} >
                                    <LoopOutlined></LoopOutlined>
                                </Button>

                            </OverlayTrigger>

                            <OverlayTrigger
                                key="top"
                                placement="top"
                                overlay={
                                    <Tooltip id={`tooltip-WifiOutlined`}><strong>Wifi</strong></Tooltip>
                                }>
                                <Button variant="dark" onClick={() => this.handleShow()} >
                                    <WifiOutlined></WifiOutlined>
                                </Button>

                            </OverlayTrigger>
                        </div>
                        <Modal show={this.state.show} onHide={this.handleClose}>
                            <Modal.Header closeButton>
                                <Modal.Title>Kablosuz İnternet(Wifi)</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                <ListGroup defaultActiveKey="#link1">
                                    {
                                        this.state.wifiList &&
                                        this.state.wifiList.map((data) =>
                                            <ListGroup.Item key={data.ssid} action style={{ fontSize: 12, padding: 0, margin: 0, height: 39 }} onSelect={() => this.setWifiSSID(data.ssid)}>
                                                <InputGroup className="mb-3">
                                                    <InputGroup.Prepend>
                                                        <InputGroup.Text id="basic-addon3" style={{ width: 250 }}>
                                                            {
                                                                data.ssid
                                                            }
                                                        </InputGroup.Text>
                                                    </InputGroup.Prepend>
                                                    <FormControl id={data.ssid} type="password" aria-describedby="basic-addon3" onChange={(e) => this.setWifiPassword(e.target.value)} onClick={() => this.setWifiSSID(data.ssid)} />
                                                </InputGroup>
                                            </ListGroup.Item>
                                        )
                                    }
                                </ListGroup>
                            </Modal.Body>
                            <Modal.Footer>
                                <OverlayTrigger
                                    key="top"
                                    placement="top"
                                    overlay={
                                        <Tooltip id={`tooltip-LoopOutlineds`}><strong>Wifi Tara</strong></Tooltip>
                                    }>
                                    <Button variant="secondary" onClick={() => this.refreshWifi()} style={{ position: "absolute", left: 10, bottom: 11 }}>
                                        <LoopOutlined></LoopOutlined>
                                    </Button>
                                </OverlayTrigger>
                                <OverlayTrigger
                                    key="top"
                                    placement="top"
                                    overlay={
                                        <Tooltip id={`tooltip-DoneAlls`}><strong>Kaydet</strong></Tooltip>
                                    }>
                                    <Button variant="primary" onClick={() => this.handleSave()}>
                                        <DoneAll></DoneAll>
                                    </Button>
                                </OverlayTrigger>
                            </Modal.Footer>
                        </Modal>
                        <Modal show={this.state.showShutdown} onHide={this.handleCloseShutdown}>
                            <Modal.Header closeButton>
                                <Modal.Title>Kapat</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                <p>Şansder Platformu kapatmak ister misiniz?</p>
                            </Modal.Body>
                            <Modal.Footer>
                                <OverlayTrigger
                                    key="top"
                                    placement="top"
                                    overlay={
                                        <Tooltip id={`tooltip-HighlightOffs`}><strong>İptal Et</strong></Tooltip>
                                    }>
                                    <Button variant="secondary" onClick={() => this.handleCloseShutdown()} >
                                        <HighlightOff></HighlightOff>
                                    </Button>
                                </OverlayTrigger>
                                <OverlayTrigger
                                    key="top"
                                    placement="top"
                                    overlay={
                                        <Tooltip id={`tooltip-PowerSettingsNews`}><strong>Kapat</strong></Tooltip>
                                    }>
                                    <Button variant="primary" onClick={() => this.shutdown()}>
                                        <PowerSettingsNew></PowerSettingsNew>
                                    </Button>
                                </OverlayTrigger>
                            </Modal.Footer>
                        </Modal>
                    </div>
                </header>
            </div >
        )
    }
}