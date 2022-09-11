import React from 'react'
import Autocomplete from '@material-ui/lab/Autocomplete';
import { TextField, FormControlLabel, Checkbox } from '@material-ui/core'
import { ListGroup, InputGroup, Button, FormControl, Modal, OverlayTrigger, Tooltip, Tabs, Tab, Form, Image, Card, Row, Container, Col } from 'react-bootstrap'
import { SaveOutlined, LoopOutlined, WifiOutlined, PowerSettingsNew, DoneAll, HighlightOff, SettingsOutlined } from '@material-ui/icons';
import FileBase64 from 'react-file-base64';
import moment from 'moment'
const axios = require('axios');
const electron = window.require('electron');
const ipcRenderer = electron.ipcRenderer;
const publicIp = require('public-ip');

//const url = "http://localhost:5000/";
//const url = "https://api.boykaf.xyz/";
//const url = "https://api.sansliplatform.com/"

const uniqid = require('uniqid');


export default class Content extends React.Component {

    state = {
        permissions: [],
        allPermission: [],
        show: false,
        showShutdown: false,
        ssid: "",
        buttonText: "",
        selectedFile: null,
        imageUrl: "assets/icons/images/sansliplatform3.png",
        username: "",
        password: "",
        info: "",
        error: "",
        newwebsiteadress: "",
        newwebsitename: "",
        newwebsiteLogoUrl: "",
        isChecked: true,
        files: []
    }

    constructor(props) {
        super(props);
    }

    ipv4 = async () => { return publicIp.v4() };

    componentDidMount() {
        let date = moment().format("L");
        var getlocalguiddate = localStorage.getItem('localguiddate');
        if (getlocalguiddate !== date) {
            var getlocalguiddate = localStorage.setItem('localguiddate', date);
            localStorage.setItem('localguid', uniqid());
        }

        this.setState({ permissions: this.props.permission });

        this.setState({ wifiList: JSON.parse(localStorage.getItem("wifis")) });
        this.permissionset();

        window.addEventListener('load', (event) => {
            let webview = document.querySelector('webview');
            let windowWidth = document.documentElement.clientWidth;
            let windowHeight = document.documentElement.clientHeight;
            let controlsHeight = this.getControlsHeight();
            let webviewHeight = windowHeight - controlsHeight;
            //webview.style.width = (windowWidth - 1) + 'px';
            webview.style.height = webviewHeight + 'px';
        });
    }

    permissionset = () => {
        var dataPermission = localStorage.getItem('localPermissionSetting');
        if (dataPermission) {
            this.setState({ permissions: JSON.parse(dataPermission), isChecked: true });
        }
        else {
            this.setState({ permissions: 
                [
                    { displayName: "İddaa.com", websiteaddress: "https://www.iddaa.com/program/canli/futbol", logoUrl: "https://seeklogo.com/images/I/Iddaa-logo-0CB65BC5F0-seeklogo.com.png" },
                    { displayName: "Nesine.com", websiteaddress: "https://nesine.com", logoUrl: "https://is2-ssl.mzstatic.com/image/thumb/Purple115/v4/67/64/11/67641179-193b-67af-a444-ba03ded8a5a1/source/512x512bb.jpg" }
            ], isChecked: true });
            localStorage.setItem('localPermissionSetting', JSON.stringify([{ displayName: "İddaa.com", websiteaddress: "https://www.iddaa.com/program/canli/futbol", logoUrl: "https://seeklogo.com/images/I/Iddaa-logo-0CB65BC5F0-seeklogo.com.png" },
            { displayName: "Nesine.com", websiteaddress: "https://nesine.com", logoUrl: "https://is2-ssl.mzstatic.com/image/thumb/Purple115/v4/67/64/11/67641179-193b-67af-a444-ba03ded8a5a1/source/512x512bb.jpg" }]));

        }
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

    handleClose = () => {
        this.setState({ show: false });
    }

    handleCloseShutdown = () => {
        this.setState({ showShutdown: false });
    }

    handleCloseSetting = () => {
        this.setState({ showSetting: false });
        this.setState({ username: "" });
        this.setState({ password: "" });
    }

    handleShow = () => {
        this.setState({ show: true });
    }

    handleSave = () => {
        ipcRenderer.invoke('main-url', null).then((result) => {
        })
    }

    refresh = (e) => {
        e.preventDefault();
        window.location.reload();
        ipcRenderer.invoke('refresh-internet', null).then((result) => {
            this.handleClose();
        })
    }

    linkClick = () => {
        ipcRenderer.invoke('otherlink', null).then((result) => {
        })
    }

    shutdown = () => {
        ipcRenderer.invoke('shutdown_event', null).then((result) => {

        })
    }

    onChangeHandler = event => {
        this.setState({
            selectedFile: event.target.files[0]
        })
    }

    handleisPrivateChange = (e) => {
        if (e.target.checked) {
            localStorage.setItem('localPermissionSetting', JSON.stringify(this.state.permissions));
            this.setState({ isChecked: true });
        }
    }

    changeWebSite = (e, website, userid) => {
        if (e.target.checked) {
            var data = { webContentId: website.id, webContent: website, userId: userid };
            var dataSty = [...this.state.permissions, data]
            this.setState({ permissions: dataSty });
            localStorage.setItem('localPermissionSetting', JSON.stringify(dataSty));
        }
        else {
            var tss = this.state.permissions.filter(x => x.webContentId !== website.id);
            this.setState({ permissions: tss });
            localStorage.setItem('localPermissionSetting', JSON.stringify(tss));
        }
    }

    addnewwebsite = () => {
        var getLocalStoragePermission = JSON.parse(localStorage.getItem('localPermissionSetting'));

        localStorage.setItem('localPermissionSetting', JSON.stringify([...getLocalStoragePermission, { displayName: this.state.newwebsitename, websiteaddress: this.state.newwebsiteadress, logoUrl: this.state.newwebsiteLogoUrl }]));

        var getLocalStoragePermission2 = JSON.parse(localStorage.getItem('localPermissionSetting'));
        this.setState({ permissions: getLocalStoragePermission2 })
    }

    remove = (params) => {
        var getLocalStoragePermission = JSON.parse(localStorage.getItem('localPermissionSetting'));
        var resultNewData = getLocalStoragePermission.map(x => {
            if (x != null && x != undefined && x.displayName != params)
                return x
        })
        localStorage.setItem('localPermissionSetting', JSON.stringify(resultNewData));
        var getLocalStoragePermission2 = JSON.parse(localStorage.getItem('localPermissionSetting'));
        this.setState({ permissions: getLocalStoragePermission2 })
    }

    render() {
        const { permissions } = this.state;
        return (
            <div style={{ backgroundImage: this.state.imageUrl }}>
                <header className="main-head" >
                    <nav className="head-nav">
                        <ul className="menu">
                            {
                                permissions &&
                                permissions.map((data) => (
                                    data &&
                                    <li key={uniqid()} onClick={() => this.navigateTo(data.websiteaddress)}>
                                        <img src={data.logoUrl} width="40" style={{ marginLeft: 20 }} />
                                        <span>{data.displayName}</span>
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
                                    <PowerSettingsNew></PowerSettingsNew>
                                </Button>
                            </OverlayTrigger>

                            <OverlayTrigger
                                key="top1"
                                placement="top"
                                overlay={
                                    <Tooltip id={`tooltip-LoopOutlined`}><strong>Yenile</strong></Tooltip>
                                }>
                                <Button variant="dark" onClick={e => this.refresh(e)} id="refreshButton" style={{ marginRight: 5 }} >
                                    <LoopOutlined></LoopOutlined>
                                </Button>

                            </OverlayTrigger>
                            <OverlayTrigger
                                key="top2"
                                placement="top"
                                overlay={
                                    <Tooltip id={`tooltip-LoopOutlined`}><strong>Ayarlar</strong></Tooltip>
                                }>
                                <Button variant="dark" onClick={e => this.setState({ showSetting: true })} id="refreshButton" style={{ marginRight: 5 }} >
                                    <SettingsOutlined></SettingsOutlined>
                                </Button>

                            </OverlayTrigger>
                            {/* <OverlayTrigger
                                key="top2"
                                placement="top"
                                overlay={
                                    <Tooltip id={`tooltip-WifiOutlined`}><strong>Wifi</strong></Tooltip>
                                }>
                                <Button variant="dark" onClick={() => this.handleShow()} >
                                    <WifiOutlined></WifiOutlined>
                                </Button>

                            </OverlayTrigger> */}
                        </div>

                        <Modal show={this.state.showShutdown} onHide={this.handleCloseShutdown}  >
                            <Modal.Header closeButton>
                                <Modal.Title>Kapat</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                <p>Şansder Platformu kapatmak ister misiniz?</p>
                            </Modal.Body>
                            <Modal.Footer>
                                <OverlayTrigger
                                    key="top5"
                                    placement="top"
                                    overlay={
                                        <Tooltip id={`tooltip-HighlightOffs`}><strong>İptal Et</strong></Tooltip>
                                    }>
                                    <Button variant="secondary" onClick={() => this.handleCloseShutdown()} >
                                        <HighlightOff></HighlightOff>
                                    </Button>
                                </OverlayTrigger>
                                <OverlayTrigger
                                    key="top6"
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

                        <Modal show={this.state.showSetting} onHide={this.handleCloseSetting} size="xl" aria-labelledby="contained-modal-title-vcenter">
                            <Modal.Header closeButton>
                                <Modal.Title>Ayarlar</Modal.Title>
                            </Modal.Header>
                            <Modal.Body >
                                {

                                    <Tabs defaultActiveKey="permission" id="uncontrolled-tab-example" >
                                        <Tab eventKey="permission" title="Siteler" >
                                            <Form.Group controlId="permission">
                                                <Container>
                                                    <Row>
                                                        <Col>
                                                            <Card body title="Web Sitesi Ekle">
                                                                <Form.Group controlId="permission">
                                                                    <Form.Label>Web Site Adı</Form.Label>
                                                                    <Form.Control type="text" placeholder="Adı" value={this.state.newwebsitename} onChange={(e) => this.setState({ newwebsitename: e.target.value })} />
                                                                </Form.Group>
                                                                <Form.Group controlId="permission">
                                                                    <Form.Label>Web Site Adresi</Form.Label>
                                                                    <Form.Control type="text" placeholder="Web Adresi" value={this.state.newwebsiteadress} onChange={(e) => this.setState({ newwebsiteadress: e.target.value })} />
                                                                </Form.Group>

                                                                <Form.Group controlId="permission">
                                                                    <Form.Label>Web Site Logo Url</Form.Label>
                                                                    <Form.Control type="text" placeholder="Web Adresi" value={this.state.newwebsiteLogoUrl} onChange={(e) => this.setState({ newwebsiteLogoUrl: e.target.value })} />
                                                                </Form.Group>

                                                                <Button variant="primary" onClick={() => this.addnewwebsite()}>
                                                                    <DoneAll></DoneAll>
                                                                </Button>
                                                            </Card>
                                                        </Col>
                                                        <Col>
                                                            {/* <Form.Group>
                                                                <Form.Check inline label="Sadece bu bilgisayar için ayarlansın." type="switch" id="isPrivate" onChange={(e) => this.handleisPrivateChange(e)} checked={this.state.isChecked} />
                                                            </Form.Group> */}
                                                            <Form.Group>
                                                                <Form.Label>Web Siteleri</Form.Label>
                                                                <ListGroup style={{ backgroundColor: "#708090" }} color="#708090">
                                                                    {
                                                                        this.state.permissions && this.state.permissions.map(data => {
                                                                            return (
                                                                                data &&
                                                                                <ListGroup.Item action variant="light" eventKey={data.id}>
                                                                                    <img src={data.logoUrl} width="40" style={{ marginLeft: 20 }} />
                                                                                    <span>{data.displayName}</span>
                                                                                    <button onClick={(e) => this.remove(data.displayName)}>SİL</button>
                                                                                </ListGroup.Item>
                                                                            )
                                                                        })
                                                                    }
                                                                </ListGroup>
                                                            </Form.Group>
                                                        </Col>
                                                    </Row>
                                                </Container>
                                            </Form.Group>
                                        </Tab>
                                    </Tabs>
                                }
                            </Modal.Body>
                        </Modal>
                    </div>
                </header>
            </div >
        )
    }
}