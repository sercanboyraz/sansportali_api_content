import React from 'react'
import Content from './content'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import Bootstrap from "react-bootstrap";

const axios = require('axios');
// Make a request for a user with a given ID

export default class App extends React.Component {

    state = {
        permission: null,
        username: "",
        password: "",
        error: "",
        info: "",
    }

    constructor(props) {
        super(props);
    }

    navigateTo = (url) => {
        document.querySelector('webview').src = url;
    }

    handleSubmit = (event) => {
        axios.get('https://api.boykaf.xyz/users?username=' + this.state.username + '&password=' + this.state.password)
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
            axios.get('https://api.boykaf.xyz/webContentPermission?userId=' + getLocalStorageUser)
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
                            <div className="Login">
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
                                    <Button variant="primary" type="button" onClick={e => this.handleSubmit(e)}>
                                        Giriş
                                    </Button>
                                </form>
                            </div>
                        )
                }
            </div>
        )
    }
}