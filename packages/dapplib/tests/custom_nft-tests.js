const TestHelpers = require('@openzeppelin/test-helpers');
const BN = TestHelpers.BN;
const DappLib = require('../src/dapp-lib.js');
const DappContract = artifacts.require('Dapp');
const DappStateContract = artifacts.require('DappState');

const constants = TestHelpers.constants;
const expectEvent = TestHelpers.expectEvent;
const expectRevert = TestHelpers.expectRevert;
const { ZERO_ADDRESS } = constants;

const Chai = require('chai');
const expect = Chai.expect;


// truffle test ./tests/custom_nft-tests.js



contract('Dapp Contract Tests', async (testAccounts) => {

    let config = null;

    before('setup contract', async () => {
        let testDappStateContract = await DappStateContract.new();
        let testDappContract = await DappContract.new(testDappStateContract.address);

        // Swap the definition of the DappLib.getConfig() function so it returns
        // dynamic contract addresses from the deployment above instead of the static
        // addresses from the last migration script run. Also, inject test accounts 
        // for contracts and IPFS. The testAccounts variable is initialized by Truffle
        // so we get whatever accounts are provided via the provider in truffle config.
        DappLib.getConfig = Function(`return ${ JSON.stringify(DappLib.getTestConfig(testDappStateContract, testDappContract, testAccounts))}`);

        // Call the re-written function to get the test config values
        config = DappLib.getConfig();
        config.testDappStateContract = testDappStateContract;
        config.testDappContract = testDappContract;
    });

describe('ERC721 testing', function () {
    const tokenIdOne = new BN(123);
    const tokenIdTwo = new BN(124);

    const data = '0x12345678';

    it ('Mints an NFT', async function () {
      await DappLib.safeMint({
        authorized: config.owner,
        to: config.users[1],
        tokenId: tokenIdOne,
        data: data 
      });

      let res = await DappLib.balanceOf({
        owner: config.users[1],
      });
      expect(res.result).to.equal('1');
    });

    it ('Returns correct balance', async function () {
      await DappLib.safeMint({
        authorized: config.owner,
        to: config.users[2],
        tokenId: tokenIdTwo,
        data: data 
      });

      let res1 = await DappLib.balanceOf({
        owner: config.users[1],
      });
      let res2 = await DappLib.balanceOf({
        owner: config.users[2],
      });
      expect(res1.result).to.equal('1');
      expect(res2.result).to.equal('1');
    });

    it('Fails when checking balance of zero address', async function() {
      await expectRevert(
        DappLib.balanceOf({
            owner: ZERO_ADDRESS
        }),
        'ERC721: balance query for the zero address'
      );
    });

    it('Fails when minting two NFTs with same ID', async function() {
      await expectRevert(
        DappLib.safeMint({
          authorized: config.owner,
          to: config.users[1],
          tokenId: tokenIdOne,
          data: data 
        }),
        'ERC721: token already minted'
      );
    });

    it('Fails when minting to a zero address', async function() {
      await expectRevert(
        DappLib.safeMint({
          authorized: config.owner,
          to: ZERO_ADDRESS,
          tokenId: tokenIdOne,
          data: data 
        }),
        'ERC721: mint to the zero address'
      );
    });

    it('Locates the correct owner of an NFT from its token ID', async function() {
      let res = await DappLib.ownerOf({
        from: config.owner,
        tokenId: tokenIdOne
      });

      expect(res.result).to.equal(config.users[1]);
    });

    it('Fails when trying to locate the owner for a nonexistent token ID', async function() {
      let id = 10;

      await expectRevert(
        DappLib.ownerOf({
          from: config.owner,
          tokenId: id
        }),
        'ERC721: owner query for nonexistent token'
      );
    });

    it('Correctly approves account', async function() {
      await DappLib.approve({
        authorized: config.owner,
        to: config.users[3],
        tokenId: tokenIdOne
      });

      let res = await DappLib.getApproved({
        from: config.owner,
        tokenId: tokenIdOne
      });

      expect(res.result).to.equal(config.users[3]);
    });

    it('Correctly cancels approval', async function() {
      await DappLib.approve({
        authorized: config.owner,
        to: ZERO_ADDRESS,
        tokenId: tokenIdOne
      });

      let res = await DappLib.getApproved({
        from: config.owner,
        tokenId: tokenIdOne
      });

      expect(res.result).to.equal(ZERO_ADDRESS);
    });

    it('Fails when trying to get approval for a nonexistent ID', async function() {
      let id = 10;

      await expectRevert(
        DappLib.approve({
          authorized: config.owner,
          to: config.users[3],
          tokenId: id
        }),
        'ERC721: owner query for nonexistent token'
      );
    });

    it('Fails when trying to approve a third account', async function() {
      let id = 10;

      await DappLib.safeMint({
        authorized: config.owner,
        to: config.users[3],
        tokenId: id,
        data: data 
      });

      await expectRevert(
        DappLib.approve({
          authorized: config.users[4],
          to: config.users[4],
          tokenId: id
        }),
        'Caller is not a contract administrator'
      );
    });

    it('Correctly sets an operator', async function() {
      await DappLib.setApprovalForAll({
        authorized: config.users[1],
        operator: config.users[3],
        approved: true
      });

      let res = await DappLib.isApprovedForAll({
        owner: config.users[1],
        operator: config.users[3]
      });

      expect(res.result).to.equal(true);
    });

    it('Correctly cancels an operator', async function() {
      await DappLib.setApprovalForAll({
        authorized: config.users[1],
        operator: config.users[3],
        approved: false
      });

      let res = await DappLib.isApprovedForAll({
        owner: config.users[1],
        operator: config.users[3]
      });

      expect(res.result).to.equal(false);
    });

    it('Correctly transfers NFT from owner', async function() {
      await DappLib.safeTransfer({
        authorized: config.owner,
        from: config.users[1],
        to: config.users[2],
        tokenId: tokenIdOne,
        data: data
      });

      let res1 = await DappLib.balanceOf({
        owner: config.users[1],
      });

      let res2 = await DappLib.balanceOf({
        owner: config.users[2],
      });

      let res = await DappLib.ownerOf({
        from: config.owner,
        tokenId: tokenIdOne
      });

      expect(res1.result).to.equal('0');
      expect(res2.result).to.equal('2');
      expect(res.result).to.equal(config.users[2]);
    });

    it('Correctly transfers NFT as operator', async function() {
      let id = 10;

      await DappLib.setApprovalForAll({
        authorized: config.users[3],
        operator: config.owner,
        approved: true
      });

      await DappLib.safeTransferFrom({
        authorized: config.owner,
        from: config.users[3],
        to: config.users[1],
        tokenId: id
      });

      let res1 = await DappLib.balanceOf({
        owner: config.users[3],
      });

      let res = await DappLib.ownerOf({
        from: config.owner,
        tokenId: id
      });

      expect(res1.result).to.equal('0');
      expect(res.result).to.equal(config.users[1]);
    });

    it('Fails when trying to transfer NFT to a zero address', async function() {
      let id = 11;

      await DappLib.safeMint({
        authorized: config.owner,
        to: config.users[1],
        tokenId: id,
        data: data 
      });

      await expectRevert (
        DappLib.safeTransfer({
        authorized: config.owner,
        from: config.users[1],
        to: ZERO_ADDRESS,
        tokenId: id,
        data: data
      }),
        'ERC721: transfer to the zero address'
      );
    });

    it('Fails when trying to transfer an invalid NFT', async function() {
      let id = 99;
      await expectRevert (
        DappLib.safeTransfer({
        authorized: config.owner,
        from: config.users[1],
        to: ZERO_ADDRESS,
        tokenId: id,
        data: data
      }),
        'ERC721: owner query for nonexistent token'
      );
    });

    it('Burns NFT correctly', async function() {
      let id = 100;

      await DappLib.safeMint({
        authorized: config.owner,
        to: config.users[1],
        tokenId: id,
        data: data 
      });

      await DappLib.burn({
        authorized: config.owner,
        tokenId: id
      });

      await expectRevert (
        DappLib.ownerOf({
        from: config.owner,
        tokenId: id,
      }),
        'ERC721: owner query for nonexistent token'
      );
    });
  }
)});