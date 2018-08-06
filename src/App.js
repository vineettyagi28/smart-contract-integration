import React, {Component} from 'react';
import './App.css';
import web3 from './web3';
import krpToken from './krpToken';
import Button from 'react-bootstrap/lib/Button';
import FormGroup from 'react-bootstrap/lib/FormGroup';
import Form from 'react-bootstrap/lib/Form';
import FormControl from 'react-bootstrap/lib/FormControl';
import Checkbox from 'react-bootstrap/lib/Checkbox';
import ICOManager from './icoManager';
import Auction from './latestAuction';

let krpTokenContract;
let icoManagerContract;
let auctionContract;

class App extends Component {

    state = {
        owner: '',
        contractBalance: 0,
        value: '',
        address: '',
        message1: '',
        message2: '',
        message3: '',
        icoOwner: '',
        icoLatestAuction: '',
        isMetaMask: false
    };

    async componentDidMount() {

        if (typeof window.web3 !== 'undefined') {
            console.log('web3 is enabled');
            if (web3.currentProvider.isMetaMask === true) {
                await this.setState({isMetaMask: true});
                console.log('MetaMask is active');
            } else {
                console.log('MetaMask is not available')
            }
        } else {
            console.log('web3 is not found')
        }

        if (this.state.isMetaMask) {

            krpTokenContract = new web3.eth.Contract(krpToken.abi, krpToken.address);
            const tokenOwner = await krpTokenContract.methods.owner().call();

            icoManagerContract = new web3.eth.Contract(ICOManager.abi, ICOManager.address);

            auctionContract = new web3.eth.Contract(Auction.abi, Auction.address);

            // this.setState({owner: owner, contractBalance});//, icoOwner, icoLatestAuction: auctionAddress});
        }
    }

    addICOPhase = async (event) => {
        event.preventDefault();

        const accounts = await web3.eth.getAccounts();

        const phaseName = this.state.phaseName;
        const startPrice = this.state.startPrice;
        const reservePrice = this.state.reservePrice;
        const minimumBidInWei = this.state.minimumBid;
        const claimPeriod = this.state.claimPeriod;
        const walletAddress = this.state.walletAddress;
        const intervalDuration = this.state.intervalDuration;
        const offerings = this.state.offerings;

        this.setState({message1: 'Waiting on transaction success..'});
        try {
            await icoManagerContract.methods.addICOPhase(phaseName, startPrice, reservePrice,
                minimumBidInWei, claimPeriod, walletAddress, intervalDuration, offerings).send(
                {
                    from: accounts[0],
                    gas: '1000000'
                }
            );

            this.setState({message1: 'New ICO phase has been successfully started'});
        } catch (err) {
            this.setState({message1: 'Error in adding new ICO phase'});
        }
        this.setState({
            phaseName: '', startPrice: '', reservePrice: '', minimumBid: '',
            claimPeriod: '', walletAddress: '', intervalDuration: '', offerings: ''
        });

    };

    getAuctionAddress = async (event) => {
        event.preventDefault();

        this.setState({message1: 'Getting current auction address...'});

        let currentAuctionAddress = '0x';

        try {
            currentAuctionAddress = await icoManagerContract.methods.currentAuction().call();
        } catch (err) {
            console.log(err);
        }

        this.setState({message1: 'Current auction address fetched successfully : ' + currentAuctionAddress});

    };

    toggleTokenTrade = async (event) => {
        event.preventDefault();

        const accounts = await web3.eth.getAccounts();

        this.setState({message1: 'Switching token trade status...'});

        try {
            await icoManagerContract.methods.toggleTradeOn().send(
                {
                    from: accounts[0],
                    gas: '1000000'
                }
            );
            this.setState({message1: 'Switched token trade status successfully'});
        } catch (err) {
            console.log(err);
            this.setState({message1: 'Error in switching token trade status'});
        }
    };

    toggleTokenSale = async (event) => {
        event.preventDefault();

        const accounts = await web3.eth.getAccounts();

        this.setState({message1: 'Switching token sale status...'});

        try {
            await icoManagerContract.methods.toggleSaleStatus().send(
                {
                    from: accounts[0],
                    gas: '1000000'
                }
            );
            this.setState({message1: 'Switched token sale status successfully'});
        } catch (err) {
            console.log(err);
            this.setState({message1: 'Error in switching token sale status'});
        }
    };

    getAuctionList = async (event) => {
        event.preventDefault();

        const accounts = await web3.eth.getAccounts();

        this.setState({message1: 'Fetching auction list...'});

        try {
            const auctionList = await icoManagerContract.methods.getAuctions().call();
            this.setState({message1: 'Fetched auction list successfully : ' + auctionList});
        } catch (err) {
            console.log(err);
            this.setState({message1: 'Error in fetching auction list'});
        }
    };

    isWholeAmount = async (checked) => {
        if (checked) {
            this.setState({numOfToken: 0, useWholeAmount: true});
        } else {
            this.setState({numOfToken: '', useWholeAmount: false});
        }
    };

    submitBid = async (event) => {
        event.preventDefault();

        const accounts = await web3.eth.getAccounts();

        const bidPrice = this.state.bidPrice;
        const useWholeAmount = this.state.useWholeAmount;
        const numOfTokens = this.state.numOfToken;

        this.setState({message2: 'Going to bid..'});
        try {
            await auctionContract.methods.doBid(bidPrice, numOfTokens, useWholeAmount).send(
                {
                    from: accounts[0],
                    gas: '1000000'
                }
            );

            this.setState({message2: 'Bid has been submitted successfully'});
        } catch (err) {
            this.setState({message2: 'Error in bid submission'});
        }
        this.setState({bidPrice: '', useWholeAmount: '', numOfTokens: ''});
    };

    claimTokens = async (event) => {
        event.preventDefault();

        const accounts = await web3.eth.getAccounts();

        this.setState({message2: 'Claiming tokens...'});

        try {
            const response = await auctionContract.methods.claimTokens().send(
                {
                    from: accounts[0],
                    gas: '1000000'
                }
            );
            this.setState({message2: 'Claimed token successfully : ' + response});
        } catch (err) {
            console.log(err);
            this.setState({message2: 'Error in claiming tokens'});
        }
    };

    claimRefunds = async (event) => {
        event.preventDefault();

        const accounts = await web3.eth.getAccounts();

        this.setState({message2: 'Claiming refunds...'});

        try {
            const response = await auctionContract.methods.claimRefund().send(
                {
                    from: accounts[0],
                    gas: '1000000'
                }
            );
            this.setState({message2: 'Claimed refund successfully : ' + response});
        } catch (err) {
            console.log(err);
            this.setState({message2: 'Error in claiming refund'});
        }
    };

    isSaleOn = async (event) => {
        event.preventDefault();

        const accounts = await web3.eth.getAccounts();

        this.setState({message2: 'Getting if sale is on...'});

        try {
            const response = await auctionContract.methods.saleOn().call();
            this.setState({message2: 'Got sale on status successfully : ' + response});
        } catch (err) {
            console.log(err);
            this.setState({message2: 'Error in getting sale on status'});
        }
    };

    getCurrentPrice = async (event) => {
        event.preventDefault();

        const accounts = await web3.eth.getAccounts();

        this.setState({message2: 'Fetching current price...'});

        try {
            const response = await auctionContract.methods.price_current().call();
            this.setState({message2: 'Fetched current price successfully : ' + response});
        } catch (err) {
            console.log(err);
            this.setState({message2: 'Error in fetching current price'});
        }
    };


    render() {

        if (this.state.isMetaMask) {
            return (
                <div className="App">
                    <div className="Border">
                        <h2>ICO Interface for Admin</h2>

                        <h2 className="display-1 text-muted">{this.state.message1}</h2>

                        <Form inline onSubmit={this.addICOPhase}>
                            <FormGroup>
                                <FormControl
                                    type="text"
                                    name="phaseName"
                                    placeholder="enter phase name"
                                    value={this.state.phaseName}
                                    onChange={event => this.setState({phaseName: event.target.value})}/>

                                <FormControl
                                    type="text"
                                    name="startPrice"
                                    placeholder="start price for this phase"
                                    value={this.state.startPrice}
                                    onChange={event => this.setState({startPrice: event.target.value})}/>

                                <FormControl
                                    type="text"
                                    name="reservePrice"
                                    placeholder="reserve price for this phase"
                                    value={this.state.reservePrice}
                                    onChange={event => this.setState({reservePrice: event.target.value})}/>
                            </FormGroup>
                            <FormGroup>
                                <FormControl
                                    type="text"
                                    name="minimumBid"
                                    placeholder="minimum bid in wei"
                                    value={this.state.minimumBid}
                                    onChange={event => this.setState({minimumBid: event.target.value})}/>

                                <FormControl
                                    type="text"
                                    name="claimPeriod"
                                    placeholder="number of periods after which user can claim tokens and refund"
                                    value={this.state.claimPeriod}
                                    onChange={event => this.setState({claimPeriod: event.target.value})}/>

                                <FormControl
                                    type="text"
                                    name="walletAddress"
                                    placeholder="wallet address where unused tokens will be sent"
                                    value={this.state.walletAddress}
                                    onChange={event => this.setState({walletAddress: event.target.value})}/>

                                <FormControl
                                    type="text"
                                    name="intervalDurations"
                                    placeholder="duration in seconds between intervals"
                                    value={this.state.intervalDuration}
                                    onChange={event => this.setState({intervalDuration: event.target.value})}/>

                                <FormControl
                                    type="text"
                                    name="offering"
                                    placeholder="number of tokens available for sale in this phase"
                                    value={this.state.offerings}
                                    onChange={event => this.setState({offerings: event.target.value})}/>

                                <Button bsSize="large" bsStyle="warning" type="submit">
                                    Add ICO Phase
                                </Button>
                            </FormGroup>
                        </Form>

                        <br/>
                        <hr width="100"/>


                        <Button bsSize="large" bsStyle="info" onClick={this.getAuctionAddress}>Get Current Auction
                            Address</Button>

                        <br/><br/>

                        <hr width="100"/>

                        <Button bsSize="large" bsStyle="danger" onClick={this.toggleTokenTrade}>Toggle Token Trade
                            On/Off</Button>

                        <br/><br/>

                        <hr width="100"/>

                        <Button bsSize="large" bsStyle="danger" onClick={this.toggleTokenSale}>Toggle Token Sale
                            On/Off</Button>

                        <br/><br/>

                        <hr width="100"/>

                        <Button bsSize="large" bsStyle="info" onClick={this.getAuctionList}>Get Auction List</Button>

                        <hr width="100"/>


                    </div>

                    <br/><br/>

                    {/*  User Auction Section */}
                    <div className="Border">
                        <h2>User Auction Interface for Auction</h2>
                        <p>This is the section user should see to take part in ICO</p>

                        <h2 className="display-1 text-muted">{this.state.message2}</h2>

                        <Form onSubmit={this.submitBid}>
                            <FormGroup>
                                <FormControl
                                    type="text"
                                    name="price"
                                    placeholder="enter your bid price"
                                    value={this.state.bidPrice}
                                    onChange={event => this.setState({bidPrice: event.target.value})}/>

                                <FormControl
                                    disabled={this.state.useWholeAmount}
                                    type="text"
                                    name="numOfToken"
                                    placeholder="enter number of tokens you want to bid for"
                                    value={this.state.numOfToken}
                                    onChange={event => this.setState({numOfToken: event.target.value})}
                                />
                            </FormGroup>
                            <FormGroup>
                                <Checkbox onClick={e => this.isWholeAmount(e.target.checked)}>Do you want to invest your
                                    whole account?</Checkbox>
                                <Button bsSize="large" bsStyle="warning" type="submit">
                                    Bid
                                </Button>
                            </FormGroup>
                        </Form>

                        <br/>
                        <hr width="100"/>


                        <Button bsSize="large" bsStyle="warning" onClick={this.claimTokens}>Claim Tokens</Button>

                        <br/><br/>

                        <hr width="100"/>

                        <Button bsSize="large" bsStyle="warning" onClick={this.claimRefunds}>Claim Refunds</Button>

                        <br/><br/>

                        <hr width="100"/>

                        <Button bsSize="large" bsStyle="info" onClick={this.isSaleOn}>Get Sale On Status</Button>

                        <br/><br/>

                        <hr width="100"/>

                        <Button bsSize="large" bsStyle="info" onClick={this.getCurrentPrice}>Get Current Price</Button>

                        <hr width="100"/>

                    </div>

                    <br/><br/>

                    {/*  Admin Auction Section */}
                    <div className="Border">
                        <h2>Admin Auction Interface for Auction</h2>
                        <p>This is the section admin should see to manage auction</p>

                        <Form inline onSubmit={this.onSubmit}>
                            <FormGroup>
                                <FormControl
                                    type="text"
                                    name="bidderAddress"
                                    placeholder="enter the bidder address"
                                    value={this.state.bidderAddress}
                                    onChange={event => this.setState({bidderAddress: event.target.value})}/>

                                <Button bsSize="large" bsStyle="info">
                                    Get Bid
                                </Button>
                            </FormGroup>
                        </Form>

                        <Form inline onSubmit={this.onSubmit}>
                            <FormGroup>
                                <FormControl
                                    type="text"
                                    name="bidPrice"
                                    placeholder="enter the bid price"
                                    value={this.state.bidPrice}
                                    onChange={event => this.setState({bidPrice: event.target.value})}/>

                                <Button bsSize="large" bsStyle="info">
                                    Check Absentee Bid
                                </Button>
                            </FormGroup>
                        </Form>


                        <br/>
                        <hr width="100"/>


                        <Button bsSize="large" bsStyle="warning">Start Auction</Button>

                        <br/><br/>

                        <hr width="100"/>

                        <Button bsSize="large" bsStyle="warning">End Auction</Button>

                        <br/><br/>

                        <hr width="100"/>

                        <Button bsSize="large" bsStyle="danger">Toggle Sale On/Off</Button>

                        <br/><br/>

                        <hr width="100"/>

                        <Button bsSize="large" bsStyle="warning">Transfer Back</Button>

                        <hr width="100"/>

                        <Button bsSize="large" bsStyle="info">Amount In Bid</Button>

                        <hr width="100"/>

                        <Button bsSize="large" bsStyle="info">Tokens in Bid</Button>

                        <hr width="100"/>

                        <Button bsSize="large" bsStyle="info">Claimed Wei</Button>

                        <hr width="100"/>

                        <Button bsSize="large" bsStyle="info">Current Stage</Button>

                        <hr width="100"/>

                        <Button bsSize="large" bsStyle="info">Need to be updated?</Button>

                        <hr width="100"/>

                        <Button bsSize="large" bsStyle="warning">Update Price</Button>

                        <hr width="100"/>

                        <Button bsSize="large" bsStyle="info">Start Price</Button>

                        <hr width="100"/>

                        <Button bsSize="large" bsStyle="info">Reserve Price</Button>

                        <hr width="100"/>

                        <Button bsSize="large" bsStyle="info">Final Price</Button>

                        <hr width="100"/>

                        <Button bsSize="large" bsStyle="info">Current Price</Button>

                        <hr width="100"/>

                        <Button bsSize="large" bsStyle="info">Is Sale On?</Button>

                        <hr width="100"/>

                        <Button bsSize="large" bsStyle="info">Get Token Address</Button>

                        <hr width="100"/>

                        <Button bsSize="large" bsStyle="info">Get Auction Start Time</Button>

                        <hr width="100"/>


                    </div>

                </div>
            );
        } else {
            return (
                <div className="App">
                    <h2>You are using a decentralized application, for which you need metamask</h2>
                    <br/><br/><br/><br/><br/>
                    <a href="https://metamask.io">
                        <img src="download-metamask-dark.png"></img>
                    </a>
                </div>
            );
        }
    }
}

export default App;
