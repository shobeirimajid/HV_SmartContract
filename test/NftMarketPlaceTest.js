const { expect } = require("chai");
const { ethers } = require("hardhat");
const { utils } = ethers;
const { bigNumber } = ethers;
const { network } = require("hardhat");

describe("nft market place contract testing", async () => {
    // define erc20 tokens address
    var DAI,
        USDT,
        HVT = null;

    // define 1 million amount
    var amount = 1000000;

    // define erc721 token address
    var NFT_MarketPlace, NFT_contract,
        Opensea_MarketPlace = null;

    // define all clients and owner
    var deployer_Id = 0; //0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266 (10000 ETH)

    // firstOwner address has 1 million token of each erc20 tokens
    var firstOwner_Id = 1; //0x70997970C51812dc3A010C7d01b50e0d17dc79C8 (10000 ETH)

    // second owner has erc721 tokens (1 token in hearverse and 1 in opensea market)
    var secondOwner_Id = 2; //0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC (10000 ETH)

    var thirdOwner_Id = 3; //0x90F79bf6EB2c4f870365E785982E1f101E93b906 (10000 ETH)
    var forthOwner_id = 4; //0x15d34AAf54267DB7D7c367839AAf71A00a2C6A65 (10000 ETH)

    beforeEach("deploy all ERC20 and ERC721 contract", async () => {
        // all hardhat accounts nodes
        ACCOUNTS = await ethers.getSigners();

        // deploy all erc20 tokens
        // deploy DAI token
        const Token1 = await ethers.getContractFactory("MyERC20Token");
        DAI = await Token1.connect(ACCOUNTS[deployer_Id]).deploy("daiToken", "DAI");
        DAI.mint(ACCOUNTS[firstOwner_Id].address, amount);

        // deploy USDT token
        const Token2 = await ethers.getContractFactory("MyERC20Token");
        USDT = await Token2.connect(ACCOUNTS[deployer_Id]).deploy(
            "usdt token",
            "USDT"
        );
        USDT.mint(ACCOUNTS[firstOwner_Id].address, amount);

        // deploy Hearverse erc20 token
        const Token3 = await ethers.getContractFactory("MyERC20Token");
        HVT = await Token3.connect(ACCOUNTS[deployer_Id]).deploy(
            "hearverse",
            "HVT"
        );
        HVT.mint(ACCOUNTS[firstOwner_Id].address, amount);

        // deploy all erc721 tokens

        // deploy opensea erc721 token
        const Token4 = await ethers.getContractFactory("MyERC721Token");
        Opensea_MarketPlace = await Token4.connect(ACCOUNTS[deployer_Id]).deploy(
            "opensea",
            "Mytoken"
        );
        // mint nft token for first owner
        Opensea_MarketPlace.connect(ACCOUNTS[firstOwner_Id]).safeMint(
            "www.opensea.com",
            5
        );

        // deploy NFT MArket place contract token
        const Token5 = await ethers.getContractFactory("NftMarketPlace");
        NFT_MarketPlace = await Token5.connect(ACCOUNTS[deployer_Id]).deploy(
            ethers.utils.parseEther("0.001")
        );
        //mint nft token for 2nd owner

        NFT_contract = await NFT_MarketPlace.connect(ACCOUNTS[secondOwner_Id]).MintNft(
            "hearverse", "HV",
            "www.hearverse.com",
            10
        );
        // await NFT_contract.wait();
    });


    // informational purpose
    it("get all erc20 token and erc721 token details", async () => {
        console.log("address of DAI erc20 token", DAI.address);
        console.log("address of USDT erc20 token", USDT.address);
        console.log("address of Hearverse erc20 token", HVT.address);
        console.log("address of NFT_MarketPlace ", NFT_MarketPlace.address);
        console.log("address of opensea erc721 token", Opensea_MarketPlace);
        console.log(
            "NFT contract address of 2nd owner ",
            await NFT_MarketPlace.connect(ACCOUNTS[secondOwner_Id]).getNftContract()
        );
    });

    // get details of minted nft from NFT marketplace
    it("details of minted NFT", async () => {
        const nftcontract = await NFT_MarketPlace.connect(
            ACCOUNTS[secondOwner_Id]
        ).getNftContract();

        const token=await NFT_MarketPlace.Token_Id();
        console.log("total token in marketplace",token);
        console.log(
            "details of minted nft contract",
            nftcontract
        );
        console.log(
            "total numbers of nft in this contract",
            await NFT_MarketPlace.getNftdetails(nftcontract,ACCOUNTS[secondOwner_Id].address,token)
        );

        expect(token).is.equal.toString(10);


    })

});
