import { ResourcePicker, useAppBridge } from "@shopify/app-bridge-react";
import { getSessionToken } from "@shopify/app-bridge-utils";
import {
  Button, ButtonGroup, Card, Checkbox, FormLayout, Frame, IndexTable, Layout, Modal, Page, TextContainer, TextField, Toast, useIndexResourceState
} from "@shopify/polaris";
import axios from "axios";
import { useRouter } from "next/router";
import React, { useCallback, useEffect, useState } from "react";

const Index = () => {
  const app = useAppBridge();
  const [openEditor, setOpenEditor] = useState(false);
  const [idEdit, setIdEdit] = useState("");
  const [slider, setSlider] = useState([]);
  const [plan, setPlan] = useState("");
  const [selected, setSelected] = useState(0);
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [config, setConfig] = useState({});
  const [tosAccepted, setTosAccepted] = useState();
  const [settings, setSettings] = useState([]);
  const [settingId, setSettingId] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [openPicker, setOpenPicker] = useState(false);
  const [name, setName] = useState("");
  const [symbol, setSymbol] = useState("");
  const [contractAddress, setContractAddress] = useState("");
  const [timestamp, setTimestamp] = useState("");
  const [product, setProduct] = useState("");
  const [activeError, setActiveError] = useState(false);
  const [activeSuccess, setActiveSuccess] = useState(0);
  const [productsSelected, setProductsSelected] = useState([]);
  const [isOpenModalConfirmDelete, setIsOpenModalConfirmDelete] = useState(
    false
  );
  const {
    selectedResources,
    allResourcesSelected,
    handleSelectionChange,
  } = useIndexResourceState([]);

  const shop = router.query.shop || "";

  const handleToggleResale = useCallback((newChecked) => {
    let current = config;
    setConfig({...current, noResale: newChecked});
  }, []);

  const handleChangeName = useCallback((newValue) => setName(newValue), []);
  const handleChangeSymbol = useCallback((newValue) => setSymbol(newValue), []);
  const handleChangeContractAddress = useCallback(
    (newValue) => setContractAddress(newValue),
    []
  );
  const handleChangeTimestamp = useCallback(
    (newValue) => setTimestamp(newValue),
    []
  );

  const resetValueSetting = () => {
    setName("");
    setSymbol("");
    setContractAddress("");
    setTimestamp("");
    setSettingId("");
    setProduct("");
  };

  const updateSettings = useCallback(async () => {
    resetValueSetting();
    setOpenModal(false);
    if (!settingId) {
      let newSettings = [
        ...settings,
        {
          name,
          symbol,
          contractAddress,
          timestamp,
          product,
          id: Math.floor(new Date().valueOf() * Math.random()),
        },
      ];
      const data = await saveSettings(newSettings);
      if (data) {
        setActiveSuccess(1);
        setSettings(newSettings);
        return;
      }
      setActiveError(true);
      return;
    }
    let newSettings = settings.map((item) => {
      if (item?.id == settingId) {
        return { ...item, name, symbol, contractAddress, timestamp, product };
      }
      return item;
    });
    const data = await saveSettings(newSettings);
    if (data) {
      setActiveSuccess(2);
      setSettings(newSettings);
      return;
    }
    setActiveError(true);
  }, [settings, name, symbol, contractAddress, timestamp, product, settingId]);

  const handleOpenDeleteSetting = (id) => {
    setSettingId(id);
    setIsOpenModalConfirmDelete(true);
  };

  const errorMarkup = useCallback(() => {
    if (activeError) {
      setTimeout(() => {
        setActiveError(false);
      }, 3000);
      return <Toast error={true} content="Server error" />;
    }
  }, [activeError]);

  const messageSuccess = useCallback(() => {
    let message = "";
    switch (activeSuccess) {
      case 1:
        message = "Add new success";
        break;
      case 2:
        message = "Edit success";
        break;
      case 3:
        message = "Delete success";
        break;
      default:
        message = "Success"
        break;
    }
    if (activeSuccess !== 0 && message) {
      setTimeout(() => {
        setActiveSuccess(0);
      }, 3000);
      return <Toast content={message} />;
    }
  }, [activeSuccess]);

  const handleDeleteSetting = useCallback(async () => {
    const newSettings = settings.filter(
      (item) => item?.id?.toString() !== settingId.toString()
    );
    const data = await saveSettings(newSettings);
    setSettingId("");
    setIsOpenModalConfirmDelete(false);
    if (data) {
      setSettings(newSettings);
      setActiveSuccess(3);
      return;
    }
    setActiveError(true);
  }, [settings, settingId]);

  const handleOpenEditSetting = ({
    name,
    symbol,
    contractAddress,
    timestamp,
    product,
    id,
  }) => {
    setProduct(product);
    setName(name);
    setSymbol(symbol);
    setContractAddress(contractAddress);
    setTimestamp(timestamp);
    setSettingId(id);
    setProductsSelected([{id: "gid://shopify/ProductVariant/" + product}]);
    setOpenModal(true);
  };

  const rowMarkup = settings.map(
    ({ name, symbol, contractAddress, timestamp, product, id }, index) => {
      return (
        <IndexTable.Row id={id?.toString()} key={index} position={index}>
          <IndexTable.Cell>{name}</IndexTable.Cell>
          <IndexTable.Cell>{symbol}</IndexTable.Cell>
          <IndexTable.Cell>{contractAddress}</IndexTable.Cell>
          <IndexTable.Cell>{timestamp}</IndexTable.Cell>
          <IndexTable.Cell>{product}</IndexTable.Cell>
          <IndexTable.Cell>
            <div className="action-group">
              <ButtonGroup>
              <Button
                onClick={() =>
                  handleOpenEditSetting({
                    name,
                    symbol,
                    contractAddress,
                    timestamp,
                    product,
                    id,
                  })
                }
                size="slim"
              >
                Edit
              </Button>
              <Button onClick={() => handleOpenDeleteSetting(id)} size="slim">
                {" "}
                Delete
              </Button>
            </ButtonGroup>
            </div>
            
          </IndexTable.Cell>
        </IndexTable.Row>
      );
    }
  );

  const getSettings = async () => {
    let sessionToken = await getSessionToken(app);

    let data = {
      shop,
    };

    let response = await axios.post("/api/settings", data, {
      headers: {
        Authorization: `Bearer ${sessionToken}`,
      },
    });

    setConfig(response.data.data.config);
    setSettings(response.data.data.settings);
    setTosAccepted(response.data.data.tosAccepted);
  };

  const saveSettings = async (newSettings) => {
    let sessionToken = await getSessionToken(app);

    let data = {
      shop,
      settings: newSettings,
    };

    try {
      let response = await axios.post("/api/settings/save", data, {
        headers: {
          Authorization: `Bearer ${sessionToken}`,
        },
      });
      if (response) {
        return true;
      }
    } catch (error) {
      return false;
    }
  };

  const saveConfig = async () => {
    setLoading(true);
    
    let sessionToken = await getSessionToken(app);

    let data = {
      shop,
      config
    };

    try {
      let response = await axios.post("/api/config/save", data, {
        headers: {
          Authorization: `Bearer ${sessionToken}`,
        },
      });
      setLoading(false);
      if (response) {
        setActiveSuccess(4);
      }
    } catch (error) {
      setActiveError(true);
      setLoading(false);
    }
  }

  const acceptTos = async () => {
    setLoading(true);
    
    let sessionToken = await getSessionToken(app);

    let data = {
      shop,
    };

    try {
      let response = await axios.post("/api/accept_tos", data, {
        headers: {
          Authorization: `Bearer ${sessionToken}`,
        },
      });
      setTosAccepted(true);
      setLoading(false);
      if (response) {
        setActiveSuccess(4);
      }
    } catch (error) {
      setActiveError(true);
      setLoading(false);
    }
  }

  const isSaveSettingDisabled = () => {
    console.log(name, symbol, contractAddress, timestamp, product);
    return !name || !symbol || !contractAddress || !timestamp || !product
  }

  useEffect(() => {
    getSettings();
  }, []);

  return (
    <Frame>
      <Page
        title="DealMintr"
        primaryAction={{
          content: "Add Setting",
          onAction: () => {
            setOpenModal(true);
          },
        }}
      >
        <Layout>
          <Layout.Section>
            <Card>
              <IndexTable
                selectable={false}
                headings={[
                  { title: "Name" },
                  { title: "Symbol" },
                  { title: "Contract Address" },
                  { title: "Timestamp" },
                  { title: "Product" },
                ]}
                resourceName={{ singular: "setting", plural: "settings" }}
                itemCount={settings.length}
                selectedItemsCount={
                  allResourcesSelected ? "All" : selectedResources.length
                }
              >
                {rowMarkup}
              </IndexTable>
            </Card>
            <Card title="Config" sectioned>
              <FormLayout>
                <Checkbox label="Enable Resale" checked={config.noResale} onChange={handleToggleResale}  />
                <Button primary onClick={saveConfig} loading={loading}>Save</Button>
              </FormLayout>
            </Card>
            <Modal
              open={openModal}
              title="Add Setting"
              onClose={() => {
                setOpenModal(false);
                resetValueSetting();
              }}
              primaryAction={{
                content: "Save Setting",
                onAction: () => updateSettings(),
                disabled: isSaveSettingDisabled()
              }}
            >
              <Modal.Section>
                <FormLayout>
                  <TextField
                    value={name}
                    onChange={handleChangeName}
                    autoComplete="off"
                    label="Name"
                  />
                  <TextField
                    value={symbol}
                    onChange={handleChangeSymbol}
                    autoComplete="off"
                    label="Symbol"
                  />
                  <TextField
                    value={contractAddress}
                    onChange={handleChangeContractAddress}
                    autoComplete="off"
                    label="Contract Address"
                  />
                  <TextField
                    value={timestamp}
                    onChange={handleChangeTimestamp}
                    autoComplete="off"
                    label="Timestamp"
                  />
                  <Button onClick={() => setOpenPicker(true)}>
                    {product ? 'Change Product' : 'Select Product'}
                  </Button>
                  {product && <p><strong>Product: </strong>{product}</p>}
                </FormLayout>
              </Modal.Section>
            </Modal>

            {isOpenModalConfirmDelete && (
              <Modal
                open={true}
                title="Remove setting ?"
                onClose={() => setIsOpenModalConfirmDelete(false)}
                secondaryActions={{
                  content: "Cancel",
                  onAction: () => {
                    setIsOpenModalConfirmDelete(false);
                    setSettingId("");
                  },
                }}
                primaryAction={{
                  content: "Delete",
                  onAction: handleDeleteSetting,
                }}
              >
                <Modal.Section>
                  <TextContainer>
                    <p>This can’t be undone</p>
                  </TextContainer>
                </Modal.Section>
              </Modal>
            )}
          </Layout.Section>
        </Layout>
        {openPicker && (
          <ResourcePicker
            resourceType="ProductVariant"
            onSelection={({ selection }) => {
              setProduct(selection[0].id.replace("gid://shopify/ProductVariant/", ""));
              setOpenPicker(false);
            }}
            onCancel={() => setOpenPicker(false)}
            initialSelectionIds={productsSelected}
            open={true}
            showVariants={false}
            allowMultiple={false}
          />
        )}
        {(typeof tosAccepted === 'boolean' && tosAccepted === false) && (
          <Modal open={true} title="Koopon Terms Of Service" primaryAction={{ content: "Accept", onAction: acceptTos}}>
            <Modal.Section>
              <TextContainer>
                <p style={{fontSize: '18px', fontWeight: 'bold'}}>Last Updated: 2/6/2023</p><p>Please read these Terms of Service (the “Agreement”) carefully. Your use of the Site (as defined below) constitutes your consent to this Agreement.</p><p>This Agreement is between you and Koopon Inc. (“Company” or “we” or “us”) concerning your use of (including any access to) the Koopon site currently located at <a href="https://www.koopon.xyz" style={{textDecoration: 'underline'}}>https://www.koopon.xyz</a> (together with any materials and services made available therein or in connection therewith, and successor site(s) thereto, the “Site”). If you use the Site as a Partner Brand (as defined below), you also consent to the Koopon Partner Brands Supplemental Terms located at <a href="https://www.koopon.xyz/brandssup" style={{textDecoration: 'underline'}}>https://www.koopon.xyz/brandssup</a>. This Agreement hereby incorporates by this reference any additional terms and conditions posted by Company through the Site, or otherwise made available to you by Company.</p><p>BY USING THE SITE, YOU AFFIRM THAT YOU ARE OF LEGAL AGE TO ENTER INTO THIS AGREEMENT.</p><p>IF YOU ARE AN INDIVIDUAL ACCESSING OR USING THE SITE ON BEHALF OF, OR FOR THE BENEFIT OF, ANY CORPORATION, PARTNERSHIP OR OTHER ENTITY WITH WHICH YOU ARE ASSOCIATED (AN “ORGANIZATION”), THEN YOU ARE AGREEING TO THIS AGREEMENT ON BEHALF OF YOURSELF AND SUCH ORGANIZATION, AND YOU REPRESENT AND WARRANT THAT YOU HAVE THE LEGAL AUTHORITY TO BIND SUCH ORGANIZATION TO THIS AGREEMENT.</p><p>References to “you” and “your” in this Agreement will refer to both the individual using the Site and to any such Organization.</p><p>THIS AGREEMENT CONTAINS A MANDATORY ARBITRATION PROVISION THAT, AS FURTHER SET FORTH IN SECTION 19 BELOW, REQUIRES THE USE OF ARBITRATION ON AN INDIVIDUAL BASIS TO RESOLVE DISPUTES, RATHER THAN JURY TRIALS OR ANY OTHER COURT PROCEEDINGS, OR CLASS ACTIONS OF ANY KIND.</p><p><b>About the Site.</b> The Site provides a platform where third parties (“Partner Brands”) may make available products or services or related coupons, gift cards or discounts (collectively, “Products”) for purchase by Site users. Records of such purchases are stored on a blockchain and in in users’ blockchain wallets. Coupons, gift cards, and discounts may be subject to other terms and conditions, including, various limitations as to use of a particular coupon, gift card, or discounts; combination with other offers; redemption and voucher use rules; and whether a particular Partner Brands’ coupon, gift card, or discount can be used online, in store or both. These terms and conditions are generally presented with the applicable coupon, gift card, or discount on the Site, and you agree specifically to have read and accepted these particular terms and conditions when you agree to purchase or use the particular coupon, gift card, or discount.</p><p>Users may redeem their Products through the applicable Partner Brand’s website.</p><p><b>1.&nbsp;&nbsp;&nbsp;&nbsp;Changes.</b><span> We may change this Agreement from time to time by notifying you of such changes by any reasonable means, including by posting a revised Agreement through the Site. Any such changes will not apply to any dispute between you and us arising prior to the date on which we posted the revised Agreement incorporating such changes, or otherwise notified you of such changes.</span><br /><br /><span>Your use of the Site following any changes to this Agreement will constitute your acceptance of such changes. The “Last Updated” legend above indicates when this Agreement was last changed. We may, at any time and without liability, modify or discontinue all or part of the Site (including access to the Site via 2 any third-party links); charge, modify or waive any fees required to use the Site; or offer opportunities to some or all Site users.</span></p><p><b>2.&nbsp;&nbsp;&nbsp;&nbsp;Information Submitted Through the Site.</b><span> Your submission of information through the Site is governed by Company’s Privacy Policy, located at <a href="https://www.koopon.xyz/privacy" style={{textDecoration: 'underline'}}>https://www.koopon.xyz/privacy</a> (the “Privacy Policy”). You represent and warrant that any information you provide in connection with the Site is and will remain accurate and complete, and that you will maintain and update such information as needed.</span></p><p><b>3.&nbsp;&nbsp;&nbsp;&nbsp;Jurisdictional Issues.</b><span> The Site is controlled or operated (or both) from the United States, and is not intended to subject Company to any non-U.S. jurisdiction or law. The Site may not be appropriate or available for use in some non-U.S. jurisdictions. Any use of the Site is at your own risk, and you must comply with all applicable laws, rules and regulations in doing so. We may limit the Site’s availability at any time, in whole or in part, to any person, geographic area or jurisdiction that we choose.</span></p><p><b>4.&nbsp;&nbsp;&nbsp;&nbsp;Rules of Conduct.</b><span> In connection with the Site, you must not:</span></p><ul style={{marginLeft: '13px'}}><li>Post, transmit or otherwise make available through or in connection with the Site any materials that are or may be: (a) threatening, harassing, degrading, hateful or intimidating, or otherwise fail to respect the rights and dignity of others; (b)&nbsp;defamatory, libelous, fraudulent, false, misleading, deceptive, or tortious; (c) obscene, indecent, pornographic or otherwise objectionable; or (d) protected by copyright, trademark, trade secret, right of publicity or privacy or any other proprietary right, without the express prior written consent of the applicable owner.</li><li>Post, transmit or otherwise make available through or in connection with the Site any virus, worm, Trojan horse, Easter egg, time bomb, spyware or other computer code, file or program that is or is potentially harmful or invasive or intended to damage or hijack the operation of, or to monitor the use of, any hardware, software or equipment (each, a “Virus”).</li><li>Use the Site for any unauthorized commercial purpose, or for any purpose that is fraudulent or otherwise tortious or unlawful, including buying or selling coupons, gift cards, or discounts for fraudulent or unlawful purposes.</li><li>Harvest or collect information about users of the Site.</li><li>Interfere with or disrupt the operation of the Site or the servers or networks used to make the Site available, including by hacking or defacing any portion of the Site; or violate any requirement, procedure or policy of such servers or networks.</li><li>Use the Site in a manner that results in or may result in complaints, chargebacks, customer refunds, invalid gift cards, fees, penalties or other liability to us, our customers or Partner Brands.</li><li>Make any fraudulent, improper or false refund request or claim under our refund policy located at <a href="https://www.koopon.xyz/refund" style={{textDecoration: 'underline'}}>https://www.koopon.xyz/refund</a> or any similar customer policies provided by us from time- to-time.</li><li>Restrict or inhibit any other person from using the Site.</li><li>Reproduce, modify, adapt, translate, create derivative works of, sell, rent, lease, loan, timeshare, distribute or otherwise exploit any portion of (or any use of) the Site except as expressly authorized herein, without Company’s express prior written consent.</li><li>Reverse engineer, decompile or disassemble any portion of the Site, except where such restriction is expressly prohibited by applicable law.</li><li>Remove any copyright, trademark or other proprietary rights notice from the Site.</li><li>Frame or mirror any portion of the Site, or otherwise incorporate any portion of the Site into any product or service, without Company’s express prior written consent.</li><li>Systematically download and store Site content.</li><li>Use any robot, spider, site search/retrieval application or other manual or automatic device to retrieve, index, “scrape,” “data mine” or otherwise gather Site content, or reproduce or circumvent the navigational structure or presentation of the Site, without Company’s express prior written consent. Notwithstanding the foregoing, and subject to compliance with any instructions posted in the robots.txt file located in the Site’s root directory, Company grants to the operators of public search engines permission to use spiders to copy materials from the Site for the sole purpose of (and solely to the extent necessary for) creating publicly available, searchable indices of such materials, but not caches or archives of such materials. Company reserves the right to revoke such permission either generally or in specific cases, at any time and without notice.</li></ul><span>You are responsible for obtaining, maintaining and paying for all hardware and all telecommunications and other services needed to use the Site.</span><p /><p><b>5.&nbsp;&nbsp;&nbsp;&nbsp;Product.</b> <span>The Site may make available listings, descriptions and images of Products, as well as references and links to Products. Products may be made available by Company or by third parties, including Partner Brands, and may be made available for any purpose, including general information purposes. The availability through the Site of any listing, description or image of a Product does not imply our endorsement of such Product or affiliation with the provider of such Product. We make no representations as to the completeness, accuracy, reliability, validity or timeliness of such listings, descriptions or images (including any features, specifications and prices contained therein). Such information and the availability of any Product (including the validity of any coupon, gift card, or discount) are subject to change at any time without notice. Certain weights, measures and similar descriptions are approximate and are for convenience only. We make reasonable efforts to accurately display the attributes of Products, including the applicable colors, however the actual colors you see will depend on your computer system, and we cannot guarantee that your computer will accurately display such colors. It is your responsibility to ascertain and obey all applicable local, state, federal and foreign laws (including minimum age requirements) regarding the purchase, possession and use of any Product.</span></p><p><b>6.&nbsp;&nbsp;&nbsp;&nbsp;Transactions.</b> <span>We may make available the ability to purchase or otherwise obtain certain Products through the Site (a “Transaction”). If you wish to make a Transaction, you may be asked to supply certain relevant information, such as your credit card number and its expiration date, your billing address and information about your blockchain wallet. You represent and warrant that you have the right to use any credit card that you submit in connection with a Transaction. By submitting such information, you grant to us the right to provide such information to third parties for purposes of facilitating Transactions. Verification of information may be required prior to the acknowledgment or completion of any Transaction. By making a Transaction, you represent that the applicable Products will be used only in a lawful manner. No Transaction is complete until we have received the necessary verification information.</span><br /><br /><span>We are not a party to any transaction that you may enter into with the Partner Brands as a result of your purchase of a coupon, gift card or discount. We are not responsible for the quality of products or services you acquire from a Partner Brand or other entity or otherwise procure using a coupon, gift card, or discount acquired on the Site. In particular, we are not responsible for any Products sold via our Partner Brands. If a Partner Brand or other retailer were to go out of business or go into bankruptcy prior to your use of all the value on their gift card you understand that your sole and exclusive recourse with respect to the unused value of the gift card for that particular Partner Brand is with the Partner Brand in question (and not with us) and, as an unsecured-creditor, you may not be able to recoup the value of any unused gift cards for such Partner Brands. We are not responsible for any loss or damage resulting from the loss of: (i) any coupon, gift card, or discount, (ii) the use of your user account on the Site, or (iii) your wallet (including any coupons, gift cards, or discounts that you have added therein).</span><br /><br /><span>Company reserves the right, including without prior notice, to limit the available quantity of or discontinue making available any Product; to impose conditions on the honoring of any coupon, gift card, or discount; and to bar any user from making any Transaction. Refunds and exchanges may be subject to Company’s refund policy located at <a href="https://www.koopon.xyz/refund" style={{textDecoration: 'underline'}}>https://www.koopon.xyz/refund</a> and/or Partner Brand’s applicable refund and exchange policies. You agree to pay all charges incurred by you or on your behalf through the Site, at the prices in effect when such charges are incurred. In addition, you are responsible for any taxes applicable to your Transactions. While it is our practice to confirm orders by e-mail, the receipt of an e-mail order confirmation does not constitute our acceptance of an order or our confirmation of an offer to sell a product or service.</span><br /><br /><span>Company is not responsible for delivering, shipping, or otherwise providing access to any Products you purchase through the Site. A record of your Transactions will be stored in your crypto wallet, which the applicable Partner Brand may use to verify the Transactions. For information on how to receive or access Products you have purchased, please visit the applicable Partner Brand’s website.</span></p><p><b>7.&nbsp;&nbsp;&nbsp;&nbsp;Registration: User Names and Passwords.</b> <span>You may need to register to use all or part of the Site. Partner Brands are required to register to use the Site. We may reject, or require that you change, any user name, password or other information that you provide to us in registering. Your user name and password are for your personal use only and should be kept confidential; you, and not Company, are responsible for any use or misuse of your user name or password, and you must promptly notify us of any confidentiality breach or unauthorized use of your user name or password, or your Site account.</span></p><p><b>8.&nbsp;&nbsp;&nbsp;&nbsp;Submissions.</b> <span>Partner Brands may make available certain materials (each, a “Submission”) through or in connection with the Site, including listings, descriptions and images of Products. Company has no control over and is not responsible for any use or misuse (including any distribution) by any third party of Submissions. </span><span style={{textTransform: 'uppercase'}}>If you choose to make any of your personally identifiable or other information publicly available through the Site, you do so at your own risk.</span></p><p><b>9.&nbsp;&nbsp;&nbsp;&nbsp;License.</b> <span>For purposes of clarity, you retain ownership of your Submissions. For each Submission, you hereby grant to us a worldwide, royalty-free, fully paid-up, non-exclusive, perpetual, irrevocable, transferable and fully sublicensable (through multiple tiers) license, without additional consideration to you or any third party, to reproduce, distribute, perform and display (publicly or otherwise), create derivative works of, adapt, modify and otherwise use, analyze and exploit such Submission, in any format or media now known or hereafter developed, and for any purpose (including promotional purposes, such as testimonials).</span><br /><br /><span>In addition, if you provide to us any ideas, proposals, suggestions or other materials (“Feedback”), whether related to the Site or otherwise, such Feedback will be deemed a Submission, and you hereby acknowledge and agree that such Feedback is not confidential, and that your provision of such Feedback is gratuitous, unsolicited and without restriction, and does not place Company under any fiduciary or other obligation.</span><br /><br /><span>You represent and warrant that you have all rights necessary to grant the licenses granted in this section, and that your Submissions, and your provision thereof through and in connection with the Site, are complete and accurate, and are not fraudulent, tortious or otherwise in violation of any applicable law or any right of any third party. You further irrevocably waive any “moral rights” or other rights with respect to attribution of authorship or integrity of materials regarding each Submission that you may have under any applicable law under any legal theory.</span></p><p><b>10.&nbsp;&nbsp;&nbsp;&nbsp;Monitoring.</b> <span>We may (but have no obligation to) monitor, evaluate, alter or remove Submissions before or after they appear on the Site, or analyze your access to or use of the Site. We may disclose information regarding your access to and use of the Site, and the circumstances surrounding such access and use, to anyone for any reason or purpose.</span></p><p><b>11.&nbsp;&nbsp;&nbsp;&nbsp;Your Limited Rights.</b> <span>Subject to your compliance with this Agreement, and solely for so long as you are permitted by Company to use the Site, you may view one (1) copy of any portion of the Site to which we provide you access under this Agreement, on any single device, solely for your personal, non-commercial use.</span></p><p><b>12.&nbsp;&nbsp;&nbsp;&nbsp;Company’s Proprietary Rights.</b> <span>We and our suppliers own the Site, which is protected by proprietary rights and laws. Our trade names, trademarks and service marks include KOOPON, KOO! and any associated logos. All trade names, trademarks, service marks and logos on the Site not owned by us are the property of their respective owners. You may not use our trade names, trademarks, service marks or logos in connection with any product or service that is not ours, or in any manner that is likely to cause confusion. Nothing contained on the Site should be construed as granting any right to use any trade names, trademarks, service marks or logos without the express prior written consent of the owner.</span></p><p><b>13.&nbsp;&nbsp;&nbsp;&nbsp;Third Party Materials; Links.</b> <span>Certain Site functionality may make available access to information, products, services and other materials made available by third parties (“Third Party Materials”), or allow for the routing or transmission of such Third Party Materials, including via links. By using such functionality, you are directing us to access, route and transmit to you the applicable Third Party Materials.</span><br /><br /><span>We neither control nor endorse, nor are we responsible for, any Third Party Materials, including the accuracy, validity, timeliness, completeness, reliability, integrity, quality, legality, usefulness or safety of Third Party Materials, or any intellectual property rights therein. Certain Third Party Materials may, among other things, be inaccurate, misleading or deceptive. Nothing in this Agreement shall be deemed to be a representation or warranty by Company with respect to any Third Party Materials. We have no obligation to monitor Third Party Materials, and we may block or disable access to any Third Party Materials (in whole or part) through the Site at any time. In addition, the availability of any Third Party Materials through the Site does not imply our endorsement of, or our affiliation with, any provider of such Third Party Materials, nor does such availability create any legal relationship between you and any such provider.</span><br /><br /><span style={{textTransform: 'uppercase'}}>Your use of Third Party Materials is at your own risk and is subject to any additional terms, conditions and policies applicable to such Third Party Materials (such as Terms Of Service or privacy policies of the providers of such Third Party Materials).</span></p><p><b>14.&nbsp;&nbsp;&nbsp;&nbsp;Promotions.</b> <span>Any sweepstakes, contests, surveys, games or similar promotions (collectively, “Promotions”) made available through the Site may be governed by rules that are separate from this Agreement. If you participate in any Promotions, please review the applicable rules as well as our Privacy Policy. If the rules for a Promotion conflict with this Agreement, the Promotion rules will govern.</span></p><p><b style={{textTransform: 'uppercase'}}>15.&nbsp;&nbsp;&nbsp;&nbsp;Disclaimer of Warranties.</b> <span style={{textTransform: 'uppercase'}}>To the fullest extent permitted under applicable law: (a) the Site, Submissions, any Products and Third Party Materials are made available to you on an “As Is,” “Where Is” and “Where Available” basis, without any warranties of any kind, whether express, implied or statutory; and (b) Company disclaims all warranties with respect to the Site, Submissions, any Products and Third Party Materials, including the warranties of merchantability, fitness for a particular purpose, non-infringement and title. All disclaimers of any kind (including in this section and elsewhere in this Agreement) are made for the benefit of both Company and its affiliates and their respective shareholders, directors, officers, employees, affiliates, agents, representatives, licensors, suppliers and service providers (collectively, the “Affiliated Entities”), and their respective successors and assigns.</span><br /><br /><span>While we try to maintain the timeliness, integrity and security of the Site, we do not guarantee that the Site is or will remain updated, complete, correct or secure, or that access to the Site will be uninterrupted. The Site may include inaccuracies, errors and materials that violate or conflict with this Agreement. Additionally, third parties may make unauthorized alterations to the Site. If you become aware of any such alteration, contact us at <a href="mailto:support@koopon.xyz" style={{textDecoration: 'underline'}}>support@koopon.xyz</a> with a description of such alteration and its location on the Site.</span></p><p><b style={{textTransform: 'uppercase'}}>16.&nbsp;&nbsp;&nbsp;&nbsp;Limitation of Liability.</b> <span style={{textTransform: 'uppercase'}}>To the fullest extent permitted under applicable law: (a) Company will not be liable for any indirect, incidental, consequential, special, exemplary or punitive damages of any kind, under any contract, tort (including negligence), strict liability or other theory, including damages for loss of profits, use or data, loss of other intangibles, loss of security of Submissions (including unauthorized interception by third parties of any Submissions), even if advised in advance of the possibility of such damages or losses; (b) without limiting the foregoing, Company will not be liable for damages of any kind resulting from your use of or inability to use the Site, Submissions, any Products or Third Party Materials, including from any Virus that may be transmitted in connection therewith; (c) your sole and exclusive remedy for dissatisfaction with the Site, Submissions, any Products or Third Party Materials is to stop using the Site; and (d) the maximum aggregate liability of Company for all damages, losses and causes of action, whether in contract, tort (including negligence) or otherwise, will be the greater of (i) the total amount, if any, paid by you to Company to use the Site and (ii) $100. All limitations of liability of any kind (including in this section and elsewhere in this Agreement) are made for the benefit of both Company and the Affiliated Entities, and their respective successors and assigns.</span></p><p><b>17.&nbsp;&nbsp;&nbsp;&nbsp;Indemnity.</b> <span>To the fullest extent permitted under applicable law, you agree to indemnify and hold harmless Company and the Affiliated Entities, and their respective successors and assigns, from and against all claims, liabilities, damages, judgments, awards, losses, costs, expenses and fees (including attorneys’ fees) arising out of or relating to (a) your use of, or activities in connection with, the Site (including all Submissions); and (b) any violation or alleged violation of this Agreement by you.</span></p><p><b>18.&nbsp;&nbsp;&nbsp;&nbsp;Termination.</b> <span>This Agreement is effective until terminated. Company may terminate or suspend your use of the Site at any time and without prior notice, for any or no reason, including if Company believes that you have violated or acted inconsistently with the letter or spirit of this Agreement. Upon any such termination or suspension, your right to use the Site will immediately cease, and Company may, without liability to you or any third party, immediately deactivate or delete your user name, password and account, and all associated materials, without any obligation to provide any further access to such materials. Sections 2–5, 7-10 and 12–24 shall survive any expiration or termination of this Agreement.</span></p><p><b>19.&nbsp;&nbsp;&nbsp;&nbsp;Governing Law; Arbitration.</b> <span>The terms of this Agreement are governed by the laws of the United States (including federal arbitration law) and the State of New York, U.S.A., without regard to its principles of conflicts of law, and regardless of your location.</span> <span style={{textTransform: 'uppercase'}}>Except for disputes that qualify for small claims court, all disputes arising out of or related to this Agreement or any aspect of the relationship between you and Company, whether based in contract, tort, statute, fraud, misrepresentation or any other legal theory, will be resolved through final and binding arbitration before a neutral arbitrator instead of in a court by a judge or jury and you agree that Company and you are each waiving the right to trial by a jury. Except as provided below regarding the class action waiver, such disputes include, without limitation, disputes arising out of or relating to interpretation or application of this arbitration provision, including the enforceability, revocability or validity of the arbitration provision or any portion of the arbitration provision. All such matters shall be decided by an arbitrator and not by a court or judge. However, as set forth below, the preceding arbitration requirement shall not apply to disputes to the extent relating to the interpretation or application of the class action waiver below, including its enforceability, revocability or validity.</span><br /><br /><span><span style={{textTransform: 'uppercase'}}>You agree that any arbitration under this Agreement will take place on an individual basis; class arbitrations and class actions are not permitted and you are agreeing to give up the ability to participate in a class action.</span> <span>Notwithstanding anything to the contrary in this Section or any other provision of this Agreement or in the American Arbitration Association’s Consumer Arbitration Rules, disputes regarding the enforceability, revocability or validity of the foregoing class action waiver may be resolved only by a civil court of competent jurisdiction and not by an arbitrator. In any case in which (1) the dispute is filed as a class, collective, or representative action, and (2) there is a final judicial determination that all or part of such class action waiver is unenforceable, then the class, collective, and/or representative action, to that extent, must be litigated in a civil court of competent jurisdiction, but the portion of such class action waiver that is enforceable shall be enforced in arbitration.</span></span><br /><br /><span>The arbitration will be administered by the American Arbitration Association under its Consumer Arbitration Rules, as amended by this Agreement. The Consumer Arbitration Rules are available online at <a href="https://www.adr.org/sites/default/files/Consumer_Rules_Web_2.pdf" style={{textDecoration: 'underline'}}>https://www.adr.org/sites/default/files/Consumer_Rules_Web_2.pdf</a>. The arbitrator will conduct hearings, if any, by teleconference or video conference, rather than by personal appearances, unless the arbitrator determines upon request by you or by us that an in-person hearing is appropriate. Any in-person appearances will be held at a location which is reasonably convenient to both parties with due consideration of their ability to travel and other pertinent circumstances. If the parties are unable to agree on a location, such determination should be made by the AAA or by the arbitrator. The arbitrator’s decision will follow the terms of this Agreement and will be final and binding. The arbitrator will have authority to award temporary, interim or permanent injunctive relief or relief providing for specific performance of this Agreement, but only to the extent necessary to provide relief warranted by the individual claim before the arbitrator. The award rendered by the arbitrator may be confirmed and enforced in any court having jurisdiction thereof. Notwithstanding any of the foregoing, nothing in this Agreement will preclude you from bringing issues to the attention of federal, state or local agencies and, if the law allows, they can seek relief against us for you.</span></p><p><b>20.&nbsp;&nbsp;&nbsp;&nbsp;Information or Complaints.</b> <span>If you have a question or complaint regarding the Site, please send an e-mail to <a href="mailto:support@koopon.xyz" style={{textDecoration: 'underline'}}>support@koopon.xyz</a>. Please note that e-mail communications will not necessarily be secure; accordingly you should not include credit card information or other sensitive information in your e-mail correspondence with us. California residents may reach Consumer Information Center of the California Department of Consumer Affairs by mail at 1625 North Market Blvd., Suite N-112, Sacramento, CA 95834, or by telephone at (800) 952-5210.</span></p><p><b>21.&nbsp;&nbsp;&nbsp;&nbsp;Copyright Infringement Claims.</b> <span>The Digital Millennium Copyright Act of 1998 (the “DMCA”) provides recourse for copyright owners who believe that material appearing on the Internet infringes their rights under U.S. copyright law. If you believe in good faith that materials available on the Site infringe your copyright, you (or your agent) may send to Company a written notice by mail or e-mail, requesting that Company remove such material or block access to it. If you believe in good faith that someone has wrongly filed a notice of copyright infringement against you, the DMCA permits you to send to Company a counter-notice. Notices and counter-notices must meet the then-current statutory requirements imposed by the DMCA. See <a href="https://www.copyright.gov" style={{textDecoration: 'underline'}}>https://www.copyright.gov</a> for details. Notices and counter-notices must be sent in writing to Matthew Melville as follows: By mail to Matthew Melville 75 Clinton Square Suite 510 Rochester, NY 14604, or by e-mail to <a href="mailto:matthew@lawbylevin.com" style={{textDecoration: 'underline'}}>Matthew@lawbylevin.com</a>. Matthew Melville’s phone number is 347.276.6911.</span><br /><br /><span>We suggest that you consult your legal advisor before filing a DMCA notice or counter-notice.</span></p><p><b>22.&nbsp;&nbsp;&nbsp;&nbsp;Export Controls.</b> <span>You are responsible for complying with United States export controls and for any violation of such controls, including any United States embargoes or other federal rules and regulations restricting exports. You represent, warrant and covenant that you are not (a) located in, or a resident or a national of, any country subject to a U.S. government embargo or other restriction, or that has been designated by the U.S. government as a “terrorist supporting” country; or (b) on any of the U.S. government lists of restricted end users.</span></p><p><b>23.&nbsp;&nbsp;&nbsp;&nbsp;New Jersey Consumers.</b> <span>If you are a consumer residing in New Jersey, the following provisions of this Agreement do not apply to you (and do not limit any rights that you may have) to the extent that they are unenforceable under New Jersey law: (a) the disclaimer of liability for any indirect, incidental, consequential, special, exemplary or punitive damages of any kind (for example, to the extent unenforceable under the New Jersey Punitive Damages Act, New Jersey Products Liability Act, New Jersey Uniform Commercial Code and New Jersey Consumer Fraud Act); (b) the limitations of liability for lost profits or loss or misuse of any data (for example, to the extent unenforceable under the New Jersey Identity Theft Protection Act and New Jersey Consumer Fraud Act); (c) application of the limitations of liability to the recovery of damages that arise under contract and tort, including negligence, strict liability or any other theory (for example, to the extent such damages are recoverable by a consumer under New Jersey law, including the New Jersey Products Liability Act); (d) the requirement that you indemnify Company and the Indemnified Parties (for example, to the extent the scope of such indemnity is prohibited under New Jersey law); (e) the governing law provision (for example, to the extent that your rights as a consumer residing in New Jersey are required to be governed by New Jersey law)</span></p><p><b>24.&nbsp;&nbsp;&nbsp;&nbsp;Miscellaneous.</b> <span>This Agreement does not, and shall not be construed to, create any partnership, joint venture, employer-employee, agency or franchisor-franchisee relationship between you and Company. If any provision of this Agreement is found to be unlawful, void or for any reason unenforceable, that provision will be deemed severable from this Agreement and will not affect the validity and enforceability of any remaining provision. You may not assign, transfer or sublicense any or all of your rights or obligations under this Agreement without our express prior written consent. We may assign, transfer or sublicense any or all of our rights or obligations under this Agreement without restriction. No waiver by either party of any breach or default under this Agreement will be deemed to be a waiver of any preceding or subsequent breach or default. Any heading, caption or section title contained herein is for convenience only, and in no way defines or explains any section or provision. All terms defined in the singular shall have the same meanings when used in the plural, where appropriate and unless otherwise specified. Any use of the term “including” or variations thereof in this Agreement shall be construed as if followed by the phrase “without limitation.” This Agreement, including any terms and conditions incorporated herein, is the entire agreement between you and Company relating to the subject matter hereof, and supersedes any and all prior or contemporaneous written or oral agreements or understandings between you and Company relating to such subject matter. Notices to you (including notices of changes to this Agreement) may be made via posting to the Site or by e-mail (including in each case via links), or by regular mail. Without limitation, a printed version of this Agreement and of any notice given in electronic form shall be admissible in judicial or administrative proceedings based upon or relating to this Agreement to the same extent and subject to the same conditions as other business documents and records originally generated and maintained in printed form. Company will not be responsible for any failure to fulfill any obligation due to any cause beyond its control.</span></p><p>Site © 2023 Koopon Inc., unless otherwise noted. All rights reserved.</p>
              </TextContainer>
            </Modal.Section>
          </Modal>
        )}
      </Page>
      {messageSuccess()}
      {errorMarkup()}
    </Frame>
  );
};

export default Index;
