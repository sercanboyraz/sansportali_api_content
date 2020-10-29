import React from 'react'
import Autocomplete from '@material-ui/lab/Autocomplete';
import { TextField, FormControlLabel, Checkbox } from '@material-ui/core'
import { ListGroup, InputGroup, Button, FormControl, Modal, OverlayTrigger, Tooltip, Tabs, Tab, Form, Image, Card, Row, Container, Col } from 'react-bootstrap'
import { SaveOutlined, LoopOutlined, WifiOutlined, PowerSettingsNew, DoneAll, HighlightOff,SettingsOutlined } from '@material-ui/icons';
import FileBase64 from 'react-file-base64';
const axios = require('axios');
const electron = window.require('electron');
const ipcRenderer = electron.ipcRenderer;
const publicIp = require('public-ip');

//const url = "http://localhost:5000/";
const url = "https://api.boykaf.xyz/";

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
        islogin: false,
        username: "",
        password: "",
        info: "",
        error: "",
        newwebsiteadress: "",
        newwebsitename: "",
        isChecked: false,
        files: []
    }

    constructor(props) {
        super(props);
        this.setState({ permissions: this.props.permission });
    }

    ipv4 = async () => { return publicIp.v4() };
    ipv6 = async () => { return publicIp.v6() };
    componentDidMount() {
        var getLocalStorageUserId = localStorage.getItem('userPortalId');

        localStorage.setItem('localguid', uniqid());
        this.setState({ permissions: this.props.permission });
        this.setState({ wifiList: JSON.parse(localStorage.getItem("wifis")) });

        this.permissionset();

        axios.get(url + 'webcontent/allpermission?userid=' + getLocalStorageUserId)
            .then(responsePermission => {
                if (responsePermission.data) {
                    this.setState({ allPermission: responsePermission.data });
                }
            })

        this.ipv4().then(result => {
            axios.post(url + 'raspianip?userId=' + getLocalStorageUserId + '&ipv4=' + result + '&ipv6=' + localStorage.getItem("localguid"))
                .then(ip => {
                    if (ip.data) {
                        this.setState({ ipValue: result });
                        this.setState({ ipAddress: '' });
                    }
                })
        });

        this.ipv4().then(result => {
            axios.post(url + 'raspianip?userId=' + getLocalStorageUserId + '&ipv4=' + result + '&ipv6=' + localStorage.getItem("localguid"))
                .then(ip => {
                    if (ip.data) {
                        this.setState({ ipValue: result });
                        this.setState({ ipAddress: '' });
                    }
                })
        });

        axios.get(url + 'image?userId=' + getLocalStorageUserId)
            .then(responsePermission => {
                if (responsePermission.data) {
                    this.setState({ imageUrl: responsePermission.data.DataUrl });
                }
            });

        // var webview = document.getElementById('webview');
        // webview.addEventListener('dom-ready', function () {
        //     webview.insertCSS(".popupLoginMain,.footerContainer,.headerLogin,.modal-body.blockElement,.lgbtn,.relative,.grid_4,.footer-list,.footerText,.gradient-gold,.bottom-followus,.loggedOut,.admatic_interstitial_iframe_content_main,.page-homepage-index__container-widget,.page-homepage-index__container-widget--social-posts,.widget-footer,.widget-nesine-most-played-coupons,.widget-nesine-most-played-coupons--desktop,.logos,.widget,.footer-nav,.footer-links,[class^='Stage_Rectangle'],.widget-legacy-link-banner,.widget-social-post__follow-button,.adform-adbox,.admatic_interstitial_logo_area_span,iframe,.c,.b,.a,.medyanet-ad-models-pageskin,.mpu,.userbox,.lgnform { display: none !important}");
        //     webview.insertCSS(".coupon__bottom-line  { display:block; } ");
        //     webview.insertCSS(".coupon__select-input  { padding-left: 45px; text-align:right !important; }");
        //     webview.insertCSS(".coupon__select-box  { width: 100%; } ");
        // });

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
        var getLocalStorageUserId = localStorage.getItem('userPortalId');
        var dataPermission = localStorage.getItem('localPermissionSetting');
        if (dataPermission) {
            this.setState({ permissions: JSON.parse(dataPermission), isChecked: true });
        }
        else {
            if (getLocalStorageUserId && !this.props.permission) {
                if (getLocalStorageUserId) {
                    axios.get(url + 'webcontentpermission?userId=' + getLocalStorageUserId)
                        .then(responsePermission => {
                            if (responsePermission.data) {
                                this.setState({ permissions: responsePermission.data });
                            }
                        })
                }
            }
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


    handleCloseSetting = () => {
        this.setState({ showSetting: false });
        this.setState({ islogin: false });
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

    handleSaveSetting = (datas) => {
        const data = new FormData();
        data.append('file', datas);

        axios.post(url + 'image/setimage?userId=' + parseInt(localStorage.getItem('userPortalId')) + "&ext=" + "dsfdsfdfs" + "&datebase64=" + this.state.selectedFile)
            .then(responsePermission => {
                if (responsePermission.data) {
                    this.setState({ permission: responsePermission.data });
                    this.setState({ username: "" });
                    this.setState({ password: "" });
                    this.setState({ error: "" });
                    this.setState({ info: "" });
                }
                else {
                    this.setState({ info: "Yetkileriniz çekilemedi" });
                }
            }).catch(function (error) {
                // handle error
                // this.setState({ error: error });
            });
    }

    onChangeHandler = event => {
        this.setState({
            selectedFile: event.target.files[0]
        })
    }

    handlelogin = (event) => {
        axios.get(url + 'users?username=' + this.state.username + '&password=' + this.state.password)
            .then(response => {
                if (response.data) {
                    this.setState({ islogin: true });
                }
                else {
                    this.setState({ info: "Kullanıcı adı veya şifre hatalı" });
                }
            })
    }

    handleisPrivateChange = (e) => {
        if (e.target.checked) {
            localStorage.setItem('localPermissionSetting', JSON.stringify(this.state.permissions));
            this.setState({ isChecked: true });
        }
        else {
            localStorage.removeItem('localPermissionSetting');//düzenle
            this.setState({ isChecked: false });
        }
    }

    changeWebSite = (e, website, userid) => {

        var tt = localStorage.getItem('localPermissionSetting');
        if (tt) {
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
        else {
            axios.get(url + 'webcontentpermission/addordelete?websiteid=' + website.id + '&userid=' + userid + '&isadd=' + e.target.checked)
                .then(response => {
                    if (response.data) {
                        var getLocalStorageUserId = localStorage.getItem('userPortalId');
                        if (getLocalStorageUserId) {
                            axios.get(url + 'webContentPermission?userId=' + getLocalStorageUserId)
                                .then(responsePermission => {
                                    if (responsePermission.data) {
                                        this.setState({ permissions: responsePermission.data });
                                    }
                                })
                        }
                    }
                })
        }
    }

    addnewwebsite = () => {
        var getLocalStorageUserId = localStorage.getItem('userPortalId');
        axios.get(url + 'webcontent/addwebcontent?websitename=' + this.state.newwebsitename + '&websiteaddress=' + this.state.newwebsiteadress + '&userid=' + getLocalStorageUserId)
            .then(response => {
                if (response.data) {
                    this.setState({ allPermission: [...this.state.allPermission, response.data], newwebsitename: "", newwebsiteadress: "" })
                    this.permissionset();
                }
            })
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
                                key="top1"
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
                                    !this.state.islogin ?
                                        (
                                            <div className="Login" style={{ width: 500, margin: '0px auto' }}>
                                                <form>
                                                    <Form.Group >
                                                        <Form.Label>Kullanıcı Adı</Form.Label>
                                                        <Form.Control placeholder="Kullanıcı Adı" value={this.state.username} onChange={e => this.setState({ username: e.target.value })} />
                                                        <Form.Text className="text-muted">Sans Portalı kullanıcı adınız.</Form.Text>
                                                    </Form.Group>

                                                    <Form.Group controlId="formBasicPassword">
                                                        <Form.Label>Şifre</Form.Label>
                                                        <Form.Control value={this.state.password} onChange={e => this.setState({ password: e.target.value })} type="password" placeholder="Şifre" />
                                                        <Form.Text className="text-muted">Sans Portalı şifreniz.</Form.Text>
                                                    </Form.Group>
                                                    {
                                                        this.state.error && (
                                                            <Form.Group>
                                                                <Form.Label style={{ color: '#FF2100' }}>{this.state.error}</Form.Label>
                                                            </Form.Group>
                                                        )
                                                    }
                                                    {
                                                        this.state.info && (
                                                            <Form.Group>
                                                                <Form.Label style={{ color: '#FF2100' }}>{this.state.info}</Form.Label>
                                                            </Form.Group>
                                                        )
                                                    }
                                                    <Button variant="primary" type="button" onClick={e => this.handlelogin(e)} style={{ float: "right" }}>
                                                        Giriş
                                                    </Button>
                                                </form>
                                            </div>
                                        )
                                        :
                                        (
                                            <Tabs defaultActiveKey="permission" id="uncontrolled-tab-example" >
                                                <Tab eventKey="main" title="Ana Sayfa Resimi" disabled>
                                                    <Form.Group controlId="formBasicEmail" aria-disabled>
                                                        <Form.File name="file" id="file" label="Giriş Resmi" onChange={this.onChangeHandler} accept=".jpg, .png, .jpeg" lang="tr" />
                                                        <FileBase64 multiple={ false } onDone={ this.handleSaveSetting.bind(this) } label="Giriş Resmi" />
                                                        <Form.Text className="text-muted">
                                                            Resimler 1920*1080 çözünürlükte olmalıdır.
                                                        </Form.Text>
                                                        <Image src={this.state.imageUrl} rounded width={700} height={500} />
                                                    </Form.Group>
                                                    <Form.Group>
                                                        <OverlayTrigger key="top3" placement="top"
                                                            overlay={<Tooltip id={`tooltip-LoopOutlineds`}><strong>İptal</strong></Tooltip>}>
                                                            <Button variant="secondary" onClick={() => this.handleCloseSetting()}>
                                                                <LoopOutlined></LoopOutlined>
                                                            </Button>
                                                        </OverlayTrigger>
                                                        <OverlayTrigger key="top4" placement="top"
                                                            overlay={<Tooltip id={`tooltip-DoneAlls`}><strong>Upload</strong></Tooltip>}>
                                                            <Button variant="primary" onClick={() => this.handleSaveSetting()}>
                                                                <DoneAll></DoneAll>
                                                            </Button>
                                                        </OverlayTrigger>
                                                    </Form.Group>
                                                </Tab>
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
                                                                        <Button variant="primary" onClick={() => this.addnewwebsite()}>
                                                                            <DoneAll></DoneAll>
                                                                        </Button>
                                                                    </Card>
                                                                </Col>
                                                                <Col>
                                                                    <Form.Group>
                                                                        <Form.Check inline label="Sadece bu bilgisayar için ayarlansın." type="switch" id="isPrivate" onChange={(e) => this.handleisPrivateChange(e)} checked={this.state.isChecked} />
                                                                    </Form.Group>
                                                                    <Form.Group>
                                                                        <Form.Label>Web Siteleri</Form.Label>
                                                                        <ListGroup style={{ backgroundColor: "#708090" }} color="#708090">
                                                                            {
                                                                                this.state.allPermission && this.state.allPermission.map(data => {
                                                                                    var isCheckedValue = this.state.permissions.some(x => x.webContentId == data.id);
                                                                                    var getLocalStorageUserId = localStorage.getItem('userPortalId');
                                                                                    return (
                                                                                        <ListGroup.Item action variant="light" eventKey={data.id}>
                                                                                            <FormControlLabel control={<Checkbox checked={isCheckedValue} onChange={(e) => this.changeWebSite(e, data, getLocalStorageUserId)} name="gilad" />} />
                                                                                            {/* <input  checked={isCheckedValue} inline id="isPrivate" onChange={(e) => this.changeWebSite(e, data.id, getLocalStorageUserId)} /> */}
                                                                                            <img src={data.logoUrl} width="40" style={{ marginLeft: 20 }} />
                                                                                            <span>{data.displayName}</span>
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
                                        )
                                }
                            </Modal.Body>
                        </Modal>
                    </div>
                </header>
            </div >
        )
    }
}