import React, { useEffect, useState } from "react";
import Container from "@mui/material/Container";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import axios from "../../axiosAuth";
import TextField from "@mui/material/TextField";
import Chip from "@mui/material/Chip";
import Button from "@mui/material/Button";
import MenuItem from "@mui/material/MenuItem";
import FormGroup from "@mui/material/FormGroup";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import PropTypes from "prop-types";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import { Snackbar } from "@mui/material";
import { useForm } from "react-hook-form";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";

const SettingsConfig = () => {
  const [value, setValue] = useState();
  const [group_settings, setSettings] = useState([]);
  const [tabPanelDataArray, setTabPanelDataArray] = useState([]);
  const [tabPanelSettingArray, setTabPanelSettingArray] = useState([]);
  const [open, setOpen] = React.useState(false);

  const [type, setType] = React.useState(false);
  const { register, getValues, watch, handleSubmit } = useForm();
  const handleRegistration = (data) => {
    data["group"] = tabPanelDataArray[0].group;
    data["order"] = 0;

    axios
      .post(`/definitions`, [data])
      .then((resp) => {
        axios
          .get(`/definitions/groups/${value}`)
          .then((resp) => {
            setTabPanelDataArray(resp.data);
          })
          .catch((err) => {
            console.log(err);
          });

        axios
          .get(`/settings`)
          .then((resp) => {
            setTabPanelSettingArray(resp.data);
          })
          .catch((err) => {
            console.log(err);
          });
      })
      .catch((err) => {
        console.log(err);
      });
    setOpen(false);
  };

  React.useEffect(() => {
    const subscription = watch((value, { name, type }) => setType(value.type));
    return () => subscription.unsubscribe();
  }, [watch]);

  const BootstrapDialogTitle = (props) => {
    const { children, onClose, ...other } = props;

    return (
      <DialogTitle sx={{ m: 0, p: 2 }} {...other}>
        {children}
        {onClose ? (
          <IconButton
            aria-label="close"
            onClick={onClose}
            sx={{
              position: "absolute",
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <CloseIcon />
          </IconButton>
        ) : null}
      </DialogTitle>
    );
  };

  BootstrapDialogTitle.propTypes = {
    children: PropTypes.node,
    onClose: PropTypes.func.isRequired,
  };

  const handleChange = (event, newValue) => {
    setValue(newValue);
    setTabPanelDataArray([]);
    setTabPanelSettingArray([]);

    axios
      .get(`/definitions/groups/${newValue}`)
      .then((resp) => {
        // console.log(resp.data.length);
        //   tabData = resp.data
        setTabPanelDataArray(resp.data);
      })
      .catch((err) => {
        console.log(err);
      });

    axios
      .get(`/settings`)
      .then((resp) => {
        setTabPanelSettingArray(resp.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleTextFieldChange = (event, setting) => {
    let settingIndex = tabPanelSettingArray.findIndex(
      (obj) => obj.key === setting.key
    );
    let tempTabPanelSettingArray = structuredClone(tabPanelSettingArray);
    tempTabPanelSettingArray[settingIndex].value = event.target.value;
    setTabPanelSettingArray(tempTabPanelSettingArray);
  };

  const handleCheckBoxChange = (event, setting) => {
    let settingIndex = tabPanelSettingArray.findIndex(
      (obj) => obj.key === setting.key
    );
    let tempTabPanelSettingArray = structuredClone(tabPanelSettingArray);
    tempTabPanelSettingArray[settingIndex].value = event.target.checked;
    setTabPanelSettingArray(tempTabPanelSettingArray);
    setting.value = event.target.checked;
    onSettingSave(setting);
  };

  const onSettingSave = (setting) => {
    axios
      .put(`/settings`, setting)
      .then((resp) => {
        console.log(setting.key + " saved");
        axios
          .get(`/settings`)
          .then((resp) => {
            setTabPanelSettingArray(resp.data);
          })
          .catch((err) => {
            console.log(err);
          });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const onSettingDelete = (setting) => {
    axios
      .delete(`/settings/${setting.key}`)
      .then((resp) => {
        console.log(setting.key + " deleted");
        axios
          .get(`/settings`)
          .then((resp) => {
            setTabPanelSettingArray(resp.data);
          })
          .catch((err) => {
            console.log(err);
          });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const renderTabPanelData = (setting, i) => {
    return tabPanelDataArray.map((tab_data, index) => (
      <div key={i + index}>
        <Container fluid>
          {tab_data.type === "string" && tab_data.key === setting.key && (
            <>
              <Box display="flex">
                <TextField
                  id="standard-basic"
                  label={tab_data.title}
                  variant="standard"
                  margin="normal"
                  onChange={(e) => handleTextFieldChange(e, setting)}
                  value={setting?.value?.toString() ?? ""}
                  style={{ width: "100%" }}
                />
                <Button
                  color="primary"
                  style={{ minWidth: "40px" }}
                  onClick={() => {
                    onSettingSave(setting);
                  }}
                >
                  Save
                </Button>
                <Button
                  color="primary"
                  style={{ minWidth: "40px" }}
                  onClick={() => {
                    onSettingDelete(setting);
                  }}
                >
                  Delete
                </Button>
              </Box>
              <Chip
                label="required"
                size="small"
                style={{ backgroundColor: "#e86305", color: "#ffffff" }}
              />{" "}
              &nbsp;
              <small style={{ color: "#736f6d" }}>{tab_data.description}</small>
            </>
          )}

          {tab_data.type === "file" && tab_data.key === setting.key && (
            <>
              <Box display="flex">
                <TextField
                  id="standard-basic"
                  label={tab_data.title}
                  variant="standard"
                  margin="normal"
                  onChange={(e) => handleTextFieldChange(e, setting)}
                  value={setting?.value?.toString() ?? ""}
                  style={{ width: "100%" }}
                />
                <Button
                  color="primary"
                  style={{ minWidth: "40px" }}
                  onClick={() => {
                    onSettingSave(setting);
                  }}
                >
                  Save
                </Button>
                <Button
                  color="primary"
                  style={{ minWidth: "40px" }}
                  onClick={() => {
                    onSettingDelete(setting);
                  }}
                >
                  Delete
                </Button>
              </Box>
              <Chip
                label="required"
                size="small"
                style={{ backgroundColor: "#e86305", color: "#ffffff" }}
              />{" "}
              &nbsp;
              <small style={{ color: "#736f6d" }}>{tab_data.description}</small>
            </>
          )}

          {tab_data.type === "uri" && tab_data.key === setting.key && (
            <>
              <Box display="flex">
                <TextField
                  id="standard-basic"
                  label={tab_data.title}
                  variant="standard"
                  margin="normal"
                  onChange={(e) => handleTextFieldChange(e, setting)}
                  value={setting?.value?.toString() ?? ""}
                  style={{ width: "100%" }}
                />
                <Button
                  color="primary"
                  style={{ minWidth: "40px" }}
                  onClick={() => {
                    onSettingSave(setting);
                  }}
                >
                  Save
                </Button>
                <Button
                  color="primary"
                  style={{ minWidth: "40px" }}
                  onClick={() => {
                    onSettingDelete(setting);
                  }}
                >
                  Delete
                </Button>
              </Box>
              <Chip
                label="required"
                size="small"
                style={{ backgroundColor: "#e86305", color: "#ffffff" }}
              />{" "}
              &nbsp;
              <small style={{ color: "#736f6d" }}>{tab_data.description}</small>
            </>
          )}

          {tab_data.type === "boolean" && tab_data.key === setting.key && (
            <FormGroup>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={setting?.value}
                    onChange={(e) => handleCheckBoxChange(e, setting)}
                  />
                }
                label={tab_data.title}
                style={{ marginTop: "1rem" }}
              />
              <small style={{ color: "#736f6d", marginTop: "-0.5rem" }}>
                {tab_data.description}
              </small>
            </FormGroup>
          )}
        </Container>
      </div>
    ));
  };
  const renderTabPanel = () => {
    const handleClickOpen = () => {
      setOpen(true);
    };
    const handleClose = () => {
      setOpen(false);
    };
    return (
      // <TabPanel value={value}>{value}</TabPanel>
      <TabPanel value={value}>
        <Button
          color="primary"
          variant="contained"
          // style={{ minWidth: "40px" }}
          onClick={() => {
            handleClickOpen();
          }}
        >
          Add
        </Button>
        <Dialog
          open={open}
          onClose={handleClose}
          fullWidth={true}
          maxWidth={"sm"}
        >
          <DialogTitle>Add</DialogTitle>
          <DialogContent>
            <TextField
              required
              autoFocus
              margin="dense"
              id="title"
              label="Title"
              type="text"
              fullWidth
              {...register("title")}
            />
            <TextField
              required
              margin="dense"
              id="description"
              label="Description"
              type="text"
              fullWidth
              multiline
              rows={4}
              {...register("description")}
            />
            <br />
            <br />
            <FormControl fullWidth required>
              <InputLabel id="demo-simple-select-label">Type</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                // value={age}
                label="Type"
                {...register("type")}
                // onChange={handleChange}
              >
                <MenuItem value="string">String</MenuItem>
                <MenuItem value="boolean">Boolean (Checkbox)</MenuItem>
                <MenuItem value="file">File</MenuItem>
                <MenuItem value="uri">URI</MenuItem>
              </Select>
            </FormControl>
            <FormGroup>
              <FormControlLabel
                control={<Checkbox defaultChecked />}
                label="Required?"
                {...register("optional")}
              />
            </FormGroup>
            <TextField
              required
              margin="dense"
              id="key"
              label="Key"
              type="text"
              fullWidth
              {...register("key")}
            />
            {getValues("type") !== "boolean" && (
              <TextField
                required
                margin="dense"
                id="defaultValue"
                label="Default Value"
                type="text"
                fullWidth
                {...register("defaultValue")}
              />
            )}
            {getValues("type") === "boolean" && (
              <FormControl fullWidth required style={{ marginTop: "6px" }}>
                <InputLabel id="demo-simple-select-label">
                  Default Value
                </InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  // value={age}
                  label="Type"
                  {...register("defaultValue")}
                  // onChange={handleChange}
                >
                  <MenuItem value={true}>Checked</MenuItem>
                  <MenuItem value={false}>Unchecked</MenuItem>
                </Select>
              </FormControl>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button
              onClick={handleSubmit(handleRegistration)}
              variant="contained"
            >
              Add
            </Button>
          </DialogActions>
        </Dialog>
        {tabPanelSettingArray.map(renderTabPanelData)}
        {/* <TextField id="standard-basic" label="Standard" variant="standard" /> */}
        <div
          style={{
            marginTop: "2rem",
            display: "flex",
            justifyContent: "center",
          }}
        >
          {tabPanelSettingArray.length !== 0}
        </div>
      </TabPanel>
    );
  };

  const settingGroups = () => {
    console.log("Working");
    axios
      .get("definitions/groups")
      .then((response) => {
        // handle success
        console.log(response);
        setSettings(response.data);
      })
      .catch(function (error) {
        // handle error
        console.log(error);
      });
  };

  useEffect(() => {
    settingGroups();
  }, []);

  const render_settings = (tab, index) => {
    // console.log(tab);
    return <Tab key={index} label={tab} value={tab} />;
  };

  return (
    <Container fluid>
      <h1>Change Settings Configuration</h1>
      <h3>You can perform all the operations over the data using the WEB UI</h3>
      <TabContext value={value}>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <TabList
            onChange={handleChange}
            aria-label="lab API tabs example"
            checked
          >
            {group_settings.map(render_settings)}
          </TabList>
        </Box>
        {renderTabPanel()}
      </TabContext>
    </Container>
  );
};

export default SettingsConfig;
