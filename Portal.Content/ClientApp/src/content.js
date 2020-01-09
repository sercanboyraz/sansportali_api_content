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
    setWifiPassword = (pass) => this.setState({ password: pass });
    setWifiSSID = (id) => this.setState({ ssid: id });
    render() {
        const { permissions } = this.state;
        const wifiList = JSON.parse(localStorage.getItem("wifis"));
        return (
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

                    <Button variant="dark" onClick={this.handleShow} style={{ padding: 3, width: '100%', position: 'absolute', bottom: 1 }}>
                        Wifi
                    </Button>

                    <Modal show={this.state.show} onHide={this.handleClose}>
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
                    </Modal>
                </div>
            </header>
        )
    }
}