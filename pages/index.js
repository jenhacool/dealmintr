import React, { useCallback, useEffect, useState } from "react";
import { ResourcePicker, useAppBridge } from '@shopify/app-bridge-react';
import { getSessionToken } from "@shopify/app-bridge-utils";
import { useRouter } from "next/router";
import {
  Page,
  EmptyState,
  Card,
  DataTable,
  Form,
  FormLayout,
  Select,
  TextField,
  ButtonGroup,
  Button,
  Layout,
  Icon,
  Stack,
  ResourceList,
  ResourceItem,
  Avatar,
  TextStyle,
  Modal,
  IndexTable,
  useIndexResourceState
} from "@shopify/polaris";
import axios from "axios";

const Index = () => {
  const app = useAppBridge();
  const [openEditor, setOpenEditor] = useState(false);
  const [idEdit, setIdEdit] = useState("");
  const [slider, setSlider] = useState([]);
  const [plan, setPlan] = useState("");
  const [selected, setSelected] = useState(0);
  const router = useRouter();
  const [settings, setSettings] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [openPicker, setOpenPicker] = useState(false);
  const [name, setName] = useState("");
  const [symbol, setSymbol] = useState("");
  const [contractAddress, setContractAddress] = useState("");
  const [timestamp, setTimestamp] = useState("");
  const [product, setProduct] = useState("");
  const {selectedResources, allResourcesSelected, handleSelectionChange} = useIndexResourceState([]);

  const shop = router.query.shop || "";

  const handleChangeName = useCallback((newValue) => setName(newValue), []);
  const handleChangeSymbol = useCallback((newValue) => setSymbol(newValue), []);
  const handleChangeContractAddress = useCallback((newValue) => setContractAddress(newValue), []);
  const handleChangeTimestamp = useCallback((newValue) => setTimestamp(newValue), []);

  const updateSettings = useCallback(async () => {
    let newSettings = [
      ...settings,
      {
        name,
        symbol,
        contractAddress,
        timestamp,
        product
      }
    ]
    setSettings(newSettings);
    setName("");
    setSymbol("");
    setContractAddress("");
    setTimestamp("");
    setProduct("");
    setOpenModal(false);
    await saveSettings(newSettings);
  }, [settings, name, symbol, contractAddress, timestamp, product]);

  const rowMarkup = settings.map(({name, symbol, contractAddress, timestamp, product}, index) => {
    return (
      <IndexTable.Row
        id={index}
        key={index}
        position={index}
      >
        <IndexTable.Cell>{name}</IndexTable.Cell>
        <IndexTable.Cell>{symbol}</IndexTable.Cell>
        <IndexTable.Cell>{contractAddress}</IndexTable.Cell>
        <IndexTable.Cell>{timestamp}</IndexTable.Cell>
        <IndexTable.Cell>{product}</IndexTable.Cell>
        <IndexTable.Cell>
          <ButtonGroup>
            <Button size="slim">Edit</Button>
            <Button size="slim"> Delete</Button>
          </ButtonGroup>
        </IndexTable.Cell>
      </IndexTable.Row>
    )
  });

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
      settings: newSettings
    };

    let response = await axios.post("/api/settings/save", data, {
      headers: {
        Authorization: `Bearer ${sessionToken}`,
      },
    });

    console.log(response);
  };

  useEffect(() => {
    getSettings();
  }, []);

  return (
    <Page title="DealMintr" primaryAction={{ content: "Add Setting", onAction: () => {setOpenModal(true);} }}>
      <Layout>
        <Layout.Section>
          <Card>
            <IndexTable
              selectable={false}
              headings={[
                {title: 'Name'},
                {title: 'Symbol'},
                {title: 'Contract Address'},
                {title: 'Timestamp'},
                {title: 'Product'},
              ]}
              resourceName={{ singular: "setting", plural: "settings" }}
              itemCount={settings.length}
              selectedItemsCount={
                allResourcesSelected ? 'All' : selectedResources.length
              }
            >
              {rowMarkup}
            </IndexTable>
          </Card>
          <Modal open={openModal} title="Add Setting" onClose={() => setOpenModal(false)} primaryAction={{content: 'Save Setting', onAction: () => {updateSettings()}}}>
            <Modal.Section>
              <FormLayout>
                <TextField value={name} onChange={handleChangeName} autoComplete="off" label="Name" />
                <TextField value={symbol} onChange={handleChangeSymbol} autoComplete="off" label="Symbol" />
                <TextField value={contractAddress} onChange={handleChangeContractAddress} autoComplete="off" label="Contract Address" />
                <TextField value={timestamp} onChange={handleChangeTimestamp} autoComplete="off" label="Timestamp" />
                {!product ? <Button onClick={() => setOpenPicker(true)}>Select Product</Button> : <p><strong>Product: </strong>{product}</p>}
              </FormLayout>
            </Modal.Section>
          </Modal>
        </Layout.Section>
      </Layout>
      <ResourcePicker resourceType="Product" onSelection={({selection}) => {
        setProduct(selection[0].id.replace("gid://shopify/Product/", ""))
        setOpenPicker(false);
      }} open={openPicker} showVariants={false} allowMultiple={false} />
    </Page>
  )
};

export default Index;
