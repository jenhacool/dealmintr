import { ResourcePicker, useAppBridge } from "@shopify/app-bridge-react";
import { getSessionToken } from "@shopify/app-bridge-utils";
import {
  Button, ButtonGroup, Card, FormLayout, Frame, IndexTable, Layout, Modal, Page, TextContainer, TextField, Toast, useIndexResourceState
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
    setName(name);
    setSymbol(symbol);
    setContractAddress(contractAddress);
    setTimestamp(timestamp);
    setSettingId(id);
    setProductsSelected([{id: "gid://shopify/Product/" + product}]);
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

    setSettings(response.data.data.settings);
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
                    Select Product
                  </Button>
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
            resourceType="Product"
            onSelection={({ selection }) => {
              setProduct(selection[0].id.replace("gid://shopify/Product/", ""));
              setOpenPicker(false);
            }}
            onCancel={() => setOpenPicker(false)}
            initialSelectionIds={productsSelected}
            open={true}
            showVariants={false}
            allowMultiple={false}
          />
        )}
      </Page>
      {messageSuccess()}
      {errorMarkup()}
    </Frame>
  );
};

export default Index;
