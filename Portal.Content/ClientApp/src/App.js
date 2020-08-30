import React from 'react'
import Content from './content'
import { ListGroup, InputGroup, Button, FormControl, Modal, OverlayTrigger, Tooltip, Form } from 'react-bootstrap'
import { SaveOutlined, LoopOutlined, WifiOutlined, PowerSettingsNew, DoneAll, HighlightOff } from '@material-ui/icons';

const axios = require('axios');
const electron = window.require('electron');
const fs = electron.remote.require('fs');
const ipcRenderer = electron.ipcRenderer;

// const url = "http://localhost:5000/";
const url = "https://api.boykaf.xyz/";
export default class App extends React.Component {

    state = {
        permission: null,
        username: "",
        password: "",
        error: "",
        info: "",
        show: true ,
        selectedFile: null
    }

    constructor(props) {
        super(props);
    }

    handleClose = () => {
        this.setState({ show: false });
    }

    handleOpen = () => {
        this.setState({ show: true });
    }

    refreshWifi = () => {
        ipcRenderer.invoke('get-wifi-names', null).then((result) => {
            console.log(result);
            this.setState({ wifiList: result });
        })
    }

    handleSubmit = (event) => {
        axios.get(url + 'users?username=' + this.state.username + '&password=' + this.state.password)
            .then(response => {
                if (response.data) {
                    localStorage.setItem('userPortalId', response.data.id);
                    this.getPermissionHandle(response.data.id);
                }
                else {
                    this.setState({ info: "Kullanıcı adı veya şifre hatalı" });
                }
            }).catch(function (error) {
                // handle error
                this.setState({ error: error });
            });
    }

    getPermissionHandle = (getLocalStorageUser) => {
        if (getLocalStorageUser) {
            axios.get(url + 'webContentPermission?userId=' + getLocalStorageUser)
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
                    this.setState({ error: error });
                });
        }
    }

    handleSave = () => {
        localStorage.setItem("SSID", this.state.ssid);
        localStorage.setItem("Password", this.state.password);
        ipcRenderer.invoke('set-wifi-names', null).then((result) => {
            this.handleClose();
        })
    }

   

    setWifiPassword = (pass) => this.setState({ password: pass });
    setWifiSSID = (id) => this.setState({ ssid: id });

    render() {
        const getLocalStorageUsername = localStorage.getItem('userPortalId');
        const { username, password, info, error } = this.state;
        return (
            <div>
                {
                    getLocalStorageUsername ?
                        (
                            <Content permission={this.state.permission} />
                        )
                        :
                        (
                            <div className="Login" style={{ width: 300, margin: '0px auto' }}>
                                <form>
                                    <Form.Group >
                                        <Form.Label>Kullanıcı Adı</Form.Label>
                                        <Form.Control placeholder="Kullanıcı Adı" value={username} onChange={e => this.setState({ username: e.target.value })} />
                                        <Form.Text className="text-muted">Sans Portalı kullanıcı adınız.</Form.Text>
                                    </Form.Group>

                                    <Form.Group controlId="formBasicPassword">
                                        <Form.Label>Şifre</Form.Label>
                                        <Form.Control value={password} onChange={e => this.setState({ password: e.target.value })} type="password" placeholder="Şifre" />
                                        <Form.Text className="text-muted">Sans Portalı şifreniz.</Form.Text>
                                    </Form.Group>
                                    {
                                        error && (
                                            <Form.Group>
                                                <Form.Label style={{ color: '#FF2100' }}>{error}</Form.Label>
                                            </Form.Group>
                                        )
                                    }
                                    {
                                        info && (
                                            <Form.Group>
                                                <Form.Label style={{ color: '#FF2100' }}>{info}</Form.Label>
                                            </Form.Group>
                                        )
                                    }
                                    <Button variant="primary" type="button" onClick={e => this.handleSubmit(e)} style={{ float: "right" }}>
                                        Giriş
                                    </Button>

                                    {/* <Button variant="secondary" type="button" onClick={e => this.handleOpen(e)} >
                                        Wifi
                                    </Button>

                                    <Modal show={this.state.show} onHide={this.handleClose}>
                                        <Modal.Header closeButton>
                                            <Modal.Title>Kablosuz İnternet(Wifi) - {this.state.ipValue}</Modal.Title>
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
                                            <OverlayTrigger key="top3" placement="top"
                                                overlay={<Tooltip id={`tooltip-LoopOutlineds`}><strong>Wifi Tara</strong></Tooltip>}>
                                                <Button variant="secondary" onClick={() => this.refreshWifi()} style={{ position: "absolute", left: 10, bottom: 11 }}>
                                                    <LoopOutlined></LoopOutlined>
                                                </Button>
                                            </OverlayTrigger>
                                            <OverlayTrigger key="top4" placement="top"
                                                overlay={<Tooltip id={`tooltip-DoneAlls`}><strong>Kaydet</strong></Tooltip>}>
                                                <Button variant="primary" onClick={() => this.handleSave()}>
                                                    <DoneAll></DoneAll>
                                                </Button>
                                            </OverlayTrigger>
                                        </Modal.Footer>
                                    </Modal> */}

                                </form>
                            </div>
                        )
                }
            </div>
        )
    }
}