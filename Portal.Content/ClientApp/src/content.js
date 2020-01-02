import React from 'react'

const axios = require('axios');
// Make a request for a user with a given ID

export default class Content extends React.Component {

    state = {
        permissions: null
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

    render() {
        const { permissions } = this.state;
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
                            )
                            )
                        }
                        {/* <li>
                            <a href="#" id="iddaa">
                                <img src="assets/icons/images/iddaacom.png" width="40" style="margin-left: 20px;" />
                                <span>İddaa</span>
                            </a>
                        </li>

                        <li>
                            <a href="#" id="nesine">
                                <img src="assets/icons/images/nesinecom.png" width="40" style="margin-left: 20px;" />
                                <span>Nesine</span>
                            </a>
                        </li>

                        <li>
                            <a href="#" id="iddaatv">
                                <img src="assets/icons/images/iddaatvcom.png" width="40" style="margin-left: 20px;" />
                                <span>İddaa Tv</span>
                            </a>
                        </li>

                        <li>
                            <a href="#" id="sahadan">
                                <img src="assets/icons/images/sahadancom.png" width="40" style="margin-left: 20px;" />
                                <span>Sahadan</span>
                            </a>
                        </li>

                        <li>
                            <a href="#" id="mackolik">
                                <img src="assets/icons/images/mackolikcom.png" width="40" style="margin-left: 20px;" />
                                <span>Maçkolik</span>
                            </a>
                        </li>

                        <li>
                            <a href="#" id="tjk">
                                <img src="assets/icons/images/tjk.png" width="40" style="margin-left: 20px;" />
                                <span>TJK</span>
                            </a>
                        </li>

                        <li>
                            <a href="#" id="sayisalloto">
                                <img src="assets/icons/images/millipiyangocom.png" width="40" style="margin-left: 20px;" />
                                <span>Sayısal Loto</span>
                            </a>
                        </li>

                        <li>
                            <a href="#" id="onnumara">
                                <img src="assets/icons/images/millipiyangocom.png" width="40" style="margin-left: 20px;" />
                                <span>On Numara</span>
                            </a>
                        </li>

                        <li>
                            <a href="#" id="sanstopu">
                                <img src="assets/icons/images/millipiyangocom.png" width="40" style="margin-left: 20px;" />
                                <span>Sans Topu</span>
                            </a>
                        </li>

                        <li>
                            <a href="#" id="superloto">
                                <img src="assets/icons/images/millipiyangocom.png" width="40" style="margin-left: 20px;" />
                                <span>Super Loto</span>
                            </a>
                        </li>

                        <li>
                            <a href="#" id="piyango">
                                <img src="assets/icons/images/millipiyangocom.png" width="40" style="margin-left: 20px;" />
                                <span>Milli Piyango</span>
                            </a>
                        </li> */}
                    </ul>
                </nav>
            </header>
        )
    }
}