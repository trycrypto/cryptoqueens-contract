import "../components/page-panel.js";
import "../components/page-body.js";
import "../components/action-card.js";
import "../components/account-widget.js";
import "../components/text-widget.js";
import "../components/number-widget.js";
import "../components/switch-widget.js";
import "../components/custom_nft/generator/generator.js";

import DappLib from "@decentology/dappstarter-dapplib";
import { LitElement, html, customElement, property } from "lit-element";

@customElement('custom-nft-harness')
export default class CustomNFTHarness extends LitElement {
  @property()
  title;
  @property()
  category;
  @property()
  description;

  createRenderRoot() {
    return this;
  }

  constructor(args) {
    super(args);
  }

  render() {
    let content = html`
      <page-body
        title="${this.title}"
        category="${this.category}"
        description="${this.description}"
      >

      <div class="grid grid-cols-2 gap-6">
        <!-- START: SET NAME and GET NAME !-->
        <div>
          <action-card
            title="Set Name"
            description="Set name"
            action="setName"
            method="post"
            fields="authorized name_">

            <account-widget
              field="authorized"
              label="From Account"
              placeholder="Account address">
            </account-widget>

            <text-widget
              field="name_"
              label="Name: "
              placeholder="Enter the name here">
            </text-widget>
          </action-card>
        </div>

        <div>
          <action-card
            title="Get Name"
            description="Get name"
            action="getName"
            method="get"
            fields="">
          </action-card>
        </div>
        <!-- END: SET NAME and GET NAME !-->

        <!-- START: SET SYMBOL and GET SYMBOL !-->
        <div>
          <action-card
            title="Set Symbol"
            description="Set symbol"
            action="setSymbol"
            method="post"
            fields="authorized symbol_">

            <account-widget
              field="authorized"
              label="From Account"
              placeholder="Account address">
            </account-widget>

            <text-widget
              field="symbol_"
              label="Symbol: "
              placeholder="Enter the symbol here">
            </text-widget>
          </action-card>
        </div>

        <div>
          <action-card
            title="Get Symbol"
            description="Get symbol"
            action="getSymbol"
            method="get"
            fields="">
          </action-card>
        </div>
        <!-- END: SET SYMBOL and GET SYMBOL !-->

        <!-- Start: Mint !-->
        <div>
          <action-card
            title="Mint"
            description="Create NFT"
            action="safeMint"
            method="post"
            fields="authorized to tokenId data">

            <account-widget
              field="authorized"
              label="From Account"
              placeholder="Account address">
            </account-widget>

            <account-widget
              field="to"
              label="Account"
              placeholder="Account address">
            </account-widget>

            <text-widget
              field="tokenId"
              label="ID: "
              placeholder="Enter ID here">
            </text-widget>

            <text-widget
              field="data"
              label="Data: "
              placeholder="Enter associated data in hex">
            </text-widget>
          </action-card>
        </div>
      <!-- End: Mint !-->
  </div>

  <div class="grid grid-cols-2 gap-6">

        <!-- START: Balance !-->
        <div>
          <action-card
            title="Get Balance"
            description="Get balance of an account"
            action="balanceOf"
            method="get"
            fields="from owner">

            <account-widget
              field="from"
              label="From account"
              placeholder="Account address">
            </account-widget>

            <account-widget
              field="owner"
              label="Account"
              placeholder="Account address">
            </account-widget>
          </action-card>
        </div>

        <div>
          <action-card
            title="Check owner"
            description="Get owner of an ID"
            action="ownerOf"
            method="get"
            fields="from tokenId">

            <account-widget
              field="from"
              label="From account"
              placeholder="Account address">
            </account-widget>

            <text-widget
              field="tokenId"
              label="ID: "
              placeholder="Enter ID here">
            </text-widget>
          </action-card>
        </div>
        <!-- End: Balance !-->

        <!-- Start: Proxy !-->
        <div>
          <action-card
            title="Get Approved"
            description="Get approved"
            action="getApproved"
            method="post"
            fields="from tokenId">

            <account-widget
              field="from"
              label="From account"
              placeholder="Account address">
            </account-widget>

            <text-widget
              field="tokenId"
              label="ID: "
              placeholder="Enter ID here">
            </text-widget>
          </action-card>
        </div>

        <div>
          <action-card
            title="Set Approval For All"
            description="Set approval for all"
            action="setApprovalForAll"
            method="post"
            fields="authorized operator approved">

            <account-widget
              field="authorized"
              label="Account"
              placeholder="Account address">
            </account-widget>

            <account-widget
              field="operator"
              label="Operator"
              placeholder="Account address">
            </account-widget>

            <switch-widget
              field="approved"
              label="True or false">
            </switch-widget>
          </action-card>
        </div>

        <div>
          <action-card
            title="Check Approval for All"
            description="Get approval"
            action="isApprovedForAll"
            method="get"
            fields="from owner operator">

            <account-widget
              field="from"
              label="Account"
              placeholder="Account address">
            </account-widget>

            <account-widget
              field="owner"
              label="Owner"
              placeholder="Account address">
            </account-widget>

            <account-widget
              field="operator"
              label="Operator"
              placeholder="Account address">
            </account-widget>
          </action-card>
        </div>
        <!-- End: Proxy !-->

        <!-- Start: Transfer !-->
        <div>
          <action-card
            title="Transfer From"
            description="Transfer tokens from one account to another"
            action="safeTransferFrom"
            method="post"
            fields="authorized from to tokenId">

            <account-widget
              field="authorized"
              label="Authorized Account"
              placeholder="Authorized account">
            </account-widget>

            <account-widget
              field="from"
              label="Sender's Account"
              placeholder="Sender's account">
            </account-widget>

            <account-widget
              field="to"
              label="Recipient's Account"
              placeholder="Recipient's account">
            </account-widget>

            <text-widget
              field="tokenId"
              label="ID: "
              placeholder="Enter the ID">
            </text-widget>
          </action-card>
        </div>

        <div>
        <action-card
            title="Transfer"
            description="Transfer tokens from one account to another"
            action="safeTransfer"
            method="post"
            fields="authorized from to tokenId data">

            <account-widget
              field="authorized"
              label="Authorized Account"
              placeholder="Authorized account">
            </account-widget>

            <account-widget
              field="from"
              label="Sender's Account"
              placeholder="Sender's account">
            </account-widget>

            <account-widget
              field="to"
              label="Recipient's Account"
              placeholder="Recipient's account">
            </account-widget>

            <text-widget
              field="tokenId"
              label="ID: "
              placeholder="Enter the ID">
            </text-widget>

            <text-widget
              field="data"
              label="Data: "
              placeholder="Enter the data">
            </text-widget>
          </action-card>
        </div>
        <!-- End: Transfer !-->

        <!-- Start: Burn !-->
        <div>
          <action-card
            title="Burn"
            description="Burn NFT"
            action="burn"
            method="post"
            fields="authorized tokenId">

            <account-widget
              field="authorized"
              label="From Account"
              placeholder="Account address">
            </account-widget>

            <text-widget
              field="tokenId"
              label="ID: "
              placeholder="Enter the ID">
            </text-widget>
          </action-card>
        </div>
        <!-- End: Burn !-->
      </div> 


      </page-body>
      <page-panel id="resultPanel"></page-panel>
    `;

    return content;
  }
}
