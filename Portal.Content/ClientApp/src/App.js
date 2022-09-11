import React from 'react'
import Content from './content'
const electron = window.require('electron');
const ipcRenderer = electron.ipcRenderer;

export default class App extends React.Component {

    state = {
        permission: null,
        username: "",
        password: "",
        error: "",
        info: "",
        show: true,
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
        return (
            <Content permission={this.state.permission} />
        )
    }
}