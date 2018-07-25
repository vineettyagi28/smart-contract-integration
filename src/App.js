import React, {Component} from 'react';
import './App.css';
import web3 from './web3';
import krpToken from './krpToken';
import 'bootstrap/dist/css/bootstrap.css';

class App extends Component {

    state = {
        owner: '',
        contractBalance: 0,
        value: '',
        address: '',
        message: ''
    };

    async componentDidMount() {
        const owner = await krpToken.methods.owner().call();
        let contractBalance = await krpToken.methods.totalSupply().call();

        this.setState({owner: owner, contractBalance});
    }

    onSubmit = async (event) => {
        event.preventDefault();

        const accounts = await web3.eth.getAccounts();

        this.setState({message: 'Waiting on transaction success..'});

        await krpToken.methods.mint(this.state.address, this.state.value).send(
            {
                from: accounts[0],
                gas: '1000000'
            }
        );

        this.setState({message: 'You have been successfully entered to the krpToken'});
        this.setState({value: ''});
        let contractBalance = await krpToken.methods.totalSupply().call();

        this.setState({contractBalance});
    };

    onClick = async (event) => {
        event.preventDefault();

        const accounts = await web3.eth.getAccounts();

        this.setState({message: 'Winner is being picked....'});

        await krpToken.methods.pickWinner().send(
            {
                from: accounts[0]
            }
        );

        this.setState({message: 'A winner has been picked'});
    };

    render() {

        return (
            <div className="App">
                <h2>Token Contract</h2>
                <p>This contract is managed by {this.state.owner}</p>
                <p>
                    Total Supply : {this.state.contractBalance}</p>
                <hr/>

                <form onSubmit={this.onSubmit}>
                    <div class="form-group row">
                        <label class="col-sm-2 col-form-label">Amount of KrpTokens</label>
                        <div class="col-sm-10">
                        <input
                            className="form-control"
                            placeholder="Amount of tokens to mint"
                            value={this.state.value}
                            onChange={event => this.setState({value: event.target.value})}
                        />
                        </div>
                    </div>
                    <div class="form-group row">
                        <label class="col-sm-2 col-form-label">Recipient Address</label>
                        <div class="col-sm-10">
                        <input
                            className="form-control"
                            placeholder="address of recipient"
                            value={this.state.address}
                            onChange={event => this.setState({address: event.target.value})}
                        />
                        </div>
                    </div>
                    <button className="btn btn-primary mb-2">Mint</button>
                </form>


            </div>
        );
    }
}

export default App;
