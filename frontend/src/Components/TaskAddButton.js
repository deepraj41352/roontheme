import Box from '@mui/material/Box';
import { DataGrid } from '@mui/x-data-grid';
import {
  Avatar,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from '@mui/material';
import { ImCross } from 'react-icons/im';

import Modal from '@mui/material/Modal';
import { Alert, Dropdown, Form } from 'react-bootstrap';
import { BiPlusMedical } from 'react-icons/bi';
import { Store } from '../Store';
import Tab from 'react-bootstrap/Tab';
import { ColorRing, ThreeDots } from 'react-loader-spinner';
import Tabs from 'react-bootstrap/Tabs';
import { MdAddCircleOutline, MdRemoveCircleOutline } from 'react-icons/md';
import { Button } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { useContext, useEffect, useReducer, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import datas from '../dummyData';
import { FaRegClock } from 'react-icons/fa';
import AvatarImage from '../Components/Avatar';
import { CiSettings } from 'react-icons/ci';
import axios from 'axios';
import { toast } from 'react-toastify';
import { FiPlus } from 'react-icons/fi';
import truncateText from '../TruncateText';

export default function TaskAddButton() {
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const {
    toggleState,
    userInfo,
    categoriesDatatrue,
    projectDatatrue,
    contractorDatatrue,
  } = state;
  const [loading, setLoading] = useState(true);
  const [isModelOpen, setIsModelOpen] = useState(false);
  const [isSubmiting, setIsSubmiting] = useState(false);
  const [dynamicfield, setDynamicfield] = useState(false);
  const [categoryData, setCategoryData] = useState([]);
  const [ProjectData, setProjectData] = useState([]);
  const [projectName, setProjectName] = useState('');
  const [SelectProjectName, setSelectProjectName] = useState('');
  const [taskName, setTaskName] = useState('');
  const [taskDesc, setTaskDesc] = useState('');
  const [category, setCategory] = useState('');
  const [contractorName, setContractorName] = useState('');
  const [contractorData, setContractorData] = useState([]);
  const [success, setSuccess] = useState(false);
  const [ShowErrorMessage, setShowErrorMessage] = useState(false);
  const navigate = useNavigate();
  const [selectedContractor, setSelectedContractor] = useState('');

  useEffect(() => {
    setLoading(true);
    const FatchCategory = async () => {
      try {
        const response = await axios.get(`/api/category/`, {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        });
        const datas = response.data;
        setCategoryData(datas);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    FatchCategory();
  }, [isModelOpen]);

  // {Get Project .........
  useEffect(() => {
    setLoading(true);
    const FatchProject = async () => {
      try {
        const { data } = await axios.get(`/api/task/project`, {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        });

        if (userInfo.role == 'contractor') {
          const ContractorProject = data.filter((item) => {
            return item.userId === userInfo._id;
          });
          setProjectData(ContractorProject);
        } else {
          setProjectData(data);
        }
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    FatchProject();
  }, [isModelOpen]);

  // {Get  Contractor User.........
  useEffect(() => {
    const FatchContractorData = async () => {
      try {
        const { data } = await axios.post(`/api/user/`, { role: 'contractor' });
        setContractorData(data);
      } catch (error) {}
    };
    FatchContractorData();
  }, [isModelOpen]);

  const handleAdminSubmit = async () => {
    setIsSubmiting(true);
    try {
      const data = await axios.post(
        `/api/task/admin`,
        {
          selectProjectName: SelectProjectName,
          projectName: projectName,
          contractorId: contractorName || selectedContractor,
          taskName: taskName,
          taskDescription: taskDesc,
          taskCategory: category,
        },
        {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        }
      );
      if (data.status === 201) {
        setSuccess(!success);
        ctxDispatch({ type: 'PROJECTDATA', payload: success });
        toast.success(data.data.message);
        setDynamicfield(false);
        setIsSubmiting(false);
        setIsModelOpen(false);
        setProjectName('');
        setTaskName('');
        setTaskDesc('');
        setCategory('');
        setContractorName('');
        setSelectProjectName('');
      }
      if (data.status === 200) {
        setDynamicfield(false);
        toast.error(data.data.message);
        setIsModelOpen(false);
        setProjectName('');
        setTaskName('');
        setTaskDesc('');
        setCategory('');
        setContractorName('');
        setSelectProjectName('');
      }
    } catch (error) {
      toast.error(error.message);
      setIsModelOpen(false);
      setDynamicfield(false);
    } finally {
      setIsSubmiting(false);
    }
  };

  const handleContractorSubmit = async () => {
    setIsSubmiting(true);
    try {
      const data = await axios.post(
        `/api/task/contractor`,
        {
          selectProjectName: SelectProjectName,
          projectName: projectName,
          taskName: taskName,
          taskDescription: taskDesc,
          taskCategory: category,
        },
        {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        }
      );
      if (data.status === 201) {
        setSuccess(!success);
        ctxDispatch({ type: 'PROJECTDATA', payload: success });
        toast.success(data.data.message);
        setDynamicfield(false);
        setIsSubmiting(false);
        setIsModelOpen(false);
        setProjectName('');
        setTaskName('');
        setTaskDesc('');
        setCategory('');
        setSelectProjectName('');
      }
      if (data.status === 200) {
        setDynamicfield(false);
        toast.error(data.data.message);
        setIsModelOpen(false);
        setProjectName('');
        setTaskName('');
        setTaskDesc('');
        setCategory('');
        setSelectProjectName('');
      }
    } catch (error) {
      toast.error(error.message);
      setIsModelOpen(false);
      setDynamicfield(false);
    } finally {
      setIsSubmiting(false);
    }
  };

  const handleNew = () => {
    setIsModelOpen(true);
  };

  const handleCloseRow = () => {
    setIsModelOpen(false);
  };

  const handleAddNewProject = () => {
    setDynamicfield(true);
  };

  const removeDymanic = () => {
    setDynamicfield(false);
    setProjectName('');
  };

  const handelBothSubmit = (e) => {
    e.preventDefault();
    if (userInfo.role === 'admin' || userInfo.role === 'superadmin') {
      handleAdminSubmit();
    } else if (userInfo.role === 'contractor') {
      handleContractorSubmit();
    }
  };

  const validation = (e) => {
    const inputValue = e.target.value;
    setTaskName(inputValue);
    const firstLetterRegex = /^[a-zA-Z]/;
    if (!firstLetterRegex.test(inputValue.charAt(0))) {
      setShowErrorMessage(true);
    } else {
      setShowErrorMessage(false);
    }
  };

  const selectedProjectContractor = (e) => {
    const selectedProject = e.target.value;
    setSelectProjectName(selectedProject);
    const findProject = ProjectData.find(
      (project) => project.projectName === selectedProject
    );
    if (findProject) {
      const contractor = contractorData.filter(
        (contractor) => contractor._id === findProject.userId
      );
      if (contractor) {
        const contractorName = contractor ? contractor[0]._id : 'not avaliable';
        setSelectedContractor(contractor);
      } else {
        console.log('Contractor not found for the selected project');
      }
    }
  };

  function generateColorFromAscii(str) {
    let color = '#';
    const combination = str
      .split('')
      .map((char) => char.charCodeAt(0))
      .reduce((acc, value) => acc + value, 0);
    color += (combination * 12345).toString(16).slice(0, 6);
    return color;
  }

  return (
    <div>
      {userInfo.role === 'agent' ? null : (
        <div onClick={handleNew} className="TaskAddButton">
          <FiPlus />
        </div>
      )}

      <Modal
        open={isModelOpen}
        onClose={handleCloseRow}
        className="overlayLoading modaleWidth p-0"
      >
        <Box
          className="modelBg modelContainer"
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 400,
            bgcolor: 'background.paper',
            boxShadow: 24,
            p: 4,
            borderRadius: 1,
          }}
        >
          {isSubmiting && (
            <div className="overlayLoadingItem1 y-3">
              <ColorRing
                visible={true}
                height="40"
                width="40"
                ariaLabel="blocks-loading"
                wrapperStyle={{}}
                wrapperClass="blocks-wrapper"
                colors={[
                  'rgba(0, 0, 0, 1) 0%',
                  'rgba(255, 255, 255, 1) 68%',
                  'rgba(0, 0, 0, 1) 93%',
                ]}
              />
            </div>
          )}

          <Form
            className="scrollInAdminproject p-3 "
            onSubmit={handelBothSubmit}
          >
            <ImCross
              color="black"
              className="formcrossbtn"
              onClick={handleCloseRow}
            />
            <h4 className="d-flex justify-content-center">Add Task</h4>

            <div className="cateContainer mb-3">
              <p className="cateItem">Categories</p>
              <div className="d-flex flex-wrap cateborder ">
                {categoryData.map((category) => (
                  <div key={category._id} className="cateItems">
                    <Form.Check
                      className="d-flex align-items-center gap-2"
                      type="radio"
                      required
                      id={`category-${category._id}`}
                      name="category"
                      value={category.categoryName}
                      label={
                        <div className="d-flex align-items-center">
                          <div className="">
                            {category.categoryImage !== 'null' ? (
                              <Avatar src={category.categoryImage} />
                            ) : (
                              <AvatarImage
                                name={category.categoryName}
                                bgColor={generateColorFromAscii(
                                  category.categoryName[0].toLowerCase()
                                )}
                              />
                            )}
                          </div>
                          <div className="d-flex">
                            <span
                              className="ms-2 spanForCate"
                              data-tooltip={category.categoryName}
                            >
                              {truncateText(category.categoryName, 7)}
                            </span>
                          </div>
                        </div>
                      }
                      onChange={(e) => setCategory(e.target.value)}
                    />
                  </div>
                ))}
              </div>
            </div>

            <FormControl className={dynamicfield ? 'disable mb-3' : 'mb-3'}>
              <InputLabel>Select Project </InputLabel>
              <Select
                value={SelectProjectName}
                onChange={(e) => selectedProjectContractor(e)}
                // required
              >
                <MenuItem
                  disabled={dynamicfield}
                  onClick={() => {
                    handleAddNewProject();
                  }}
                >
                  <MdAddCircleOutline /> Add New Project
                </MenuItem>
                {ProjectData &&
                  ProjectData.map((items) => (
                    <MenuItem
                      key={items._id}
                      value={items.projectName}
                      onClick={() => removeDymanic()}
                    >
                      {items.projectName}
                    </MenuItem>
                  ))}
              </Select>
            </FormControl>

            {dynamicfield ? (
              <div className="d-flex align-items-center gap-1">
                <TextField
                  required
                  className="mb-3"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  label="Project Name"
                  fullWidth
                />
              </div>
            ) : null}

            <TextField
              required
              className="mb-3"
              value={taskName}
              onChange={validation}
              label="Task Name"
              fullWidth
              type="text"
            />
            {ShowErrorMessage && (
              <Alert variant="danger" className="error nameValidationErrorBox">
                The first letter of the task should be an alphabet
              </Alert>
            )}

            <TextField
              required
              className="mb-3"
              value={taskDesc}
              onChange={(e) => setTaskDesc(e.target.value)}
              label="Description"
              fullWidth
            />

            {(userInfo.role == 'superadmin' || userInfo.role == 'admin') && (
              <FormControl className={'mb-3'}>
                <InputLabel>Select Contractor</InputLabel>
                {SelectProjectName && selectedContractor ? (
                  <Select
                    value={selectedContractor[0]._id}
                    onChange={(e) => setContractorName(e.target.value)}
                    disabled
                  >
                    <MenuItem value={selectedContractor[0]._id}>
                      {selectedContractor[0].first_name}
                    </MenuItem>
                  </Select>
                ) : (
                  <Select
                    value={contractorName}
                    onChange={(e) => setContractorName(e.target.value)}
                    required
                  >
                    <MenuItem value="" disabled>
                      Select Contractor
                    </MenuItem>
                    <MenuItem value="addNew">
                      <Link to={`/adminContractorList`} className="addCont">
                        <MdAddCircleOutline /> Add New Contractor
                      </Link>
                    </MenuItem>
                    {contractorData.map((item) => (
                      <MenuItem key={item._id} value={item._id}>
                        {item.first_name}
                      </MenuItem>
                    ))}
                  </Select>
                )}
              </FormControl>
            )}

            <Button
              variant="contained"
              color="primary"
              type="submit"
              className="mt-2 formbtn updatingBtn globalbtnColor"
              disabled={ShowErrorMessage}
            >
              {isSubmiting ? 'SUBMITTING' : 'SUBMIT '}
            </Button>
          </Form>
        </Box>
      </Modal>
    </div>
  );
}
