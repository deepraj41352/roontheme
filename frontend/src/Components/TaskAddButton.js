import Box from '@mui/material/Box';
import {
  Avatar,
  Backdrop,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from '@mui/material';
import { ImCross } from 'react-icons/im';
import Modal from '@mui/material/Modal';
import { Alert, Card, Col, Form, Row } from 'react-bootstrap';
import { Store } from '../Store';
import { MdAddCircleOutline } from 'react-icons/md';
import { Button } from '@mui/material';
import { Link } from 'react-router-dom';
import { useContext, useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import AvatarImage from '../Components/Avatar';
import axios from 'axios';
import { toast } from 'react-toastify';
import { FiPlus } from 'react-icons/fi';
import truncateText from '../TruncateText';
import FormSubmitLoader from '../Util/formSubmitLoader';
import ReactQuill from 'react-quill';
import { useTranslation } from 'react-i18next';

export default function TaskAddButton() {
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { userInfo } = state;
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
  const [selectedContractor, setSelectedContractor] = useState('');
  const [filterCategory, setFilterCategory] = useState([]);
  const [agentData, setAgentData] = useState([]);
  const [toggleNot, setToggleNot] = useState(false);
  const { t } = useTranslation();

  const handleDescription = (html) => {
    setTaskDesc(html);
    console.log(html);
  };

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
        toast.error(t('An Error Ocurred'));
      } finally {
        setLoading(false);
      }
    };
    FatchCategory();
  }, [isModelOpen]);

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
        toast.error(t('An Error Ocurred'));
      } finally {
        setLoading(false);
      }
    };
    FatchProject();
  }, [isModelOpen]);

  useEffect(() => {
    const FatchContractorData = async () => {
      try {
        const { data } = await axios.post(`/api/user/`, { role: 'contractor' });
        setContractorData(data);
      } catch (error) {
        toast.error(t('An Error Ocurred'));
      }
    };
    FatchContractorData();
  }, [isModelOpen]);

  useEffect(() => {
    const FatchContractorData = async () => {
      try {
        const { data } = await axios.post(`/api/user/`, { role: 'agent' });
        setAgentData(data);
      } catch (error) {
        toast.error(t('An Error Ocurred'));
      }
    };
    FatchContractorData();
  }, []);

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
        toast.success(`${t('task')} ${t('created successfully')}`);
        setDynamicfield(false);
        setIsSubmiting(false);
        setIsModelOpen(false);
        ctxDispatch({ type: 'PROJECTDATA', payload: success });
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
      }
    } catch (error) {
      toast.error(`${t('failedCreate')} ${t('task')}`);
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
        toast.success(`${t('task')} ${t('created successfully')}`);
        setDynamicfield(false);
        setIsSubmiting(false);
        setIsModelOpen(false);
        ctxDispatch({
          type: 'CONTRACTORPROJECTDATA',
          payload: success,
        });
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
      }
    } catch (error) {
      toast.error(`${t('failedCreate')} ${t('task')}`);
      setIsModelOpen(false);
      setDynamicfield(false);
    } finally {
      setIsSubmiting(false);
    }
  };

  const handleNew = () => {
    setIsModelOpen(!isModelOpen);
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
    setToggleNot(!toggleNot);
    if (userInfo.role === 'admin' || userInfo.role === 'superadmin') {
      handleAdminSubmit();
    } else if (userInfo.role === 'contractor') {
      handleContractorSubmit();
    }
    ctxDispatch({ type: 'NOTIFICATION_TOGGLE', payload: !toggleNot });
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

  useEffect(() => {
    const fetchData = () => {
      const filteredCategory = agentData.flatMap(
        (agentCate) => agentCate.agentCategory
      );

      const matchWithCateData = filteredCategory.map((AgentsCateId) =>
        categoryData.find((cat) => cat._id === AgentsCateId)
      );
      const Category = matchWithCateData ? matchWithCateData : null;
      const finalCategory = Category.filter(Boolean);
      setFilterCategory(finalCategory);
    };

    fetchData();
  }, [agentData, categoryData]);

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
        const constractorId = contractor[0]._id;
        setSelectedContractor(constractorId);
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
      {isSubmiting && (
        <Backdrop open={true} style={{ zIndex: 9999 }}>
          <FormSubmitLoader />
        </Backdrop>
      )}

      <Modal
        open={isModelOpen}
        onClose={handleCloseRow}
        className="overlayLoading modaleWidthButton p-0"
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
            p: 2,
            borderRadius: 1,
          }}
        >
          <Form
            className="scrollInAdminproject p-2"
            onSubmit={handelBothSubmit}
          >
            <div className="cateContainer mb-3">
              <p className="cateItem"> {t('categories')}</p>
              <div className="d-flex flex-wrap cateborder">
                {filterCategory.length === 0 ? (
                  <div className="p-2">{t('noCategoriesAssigned')}</div>
                ) : (
                  filterCategory.map((category) => (
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
                              {category.categoryImage ? (
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
                  ))
                )}
              </div>
            </div>
            <FormControl
              className={dynamicfield ? 'disable mb-3 w-100' : 'mb-3 w-100'}
            >
              <InputLabel>{`${t('select')} ${t('project')}`}</InputLabel>
              <Select
                value={SelectProjectName}
                onChange={(e) => selectedProjectContractor(e)}
                MenuProps={{
                  PaperProps: {
                    style: {
                      maxHeight: 150,
                      top: 0,
                    },
                  },
                }}
              >
                <MenuItem
                  disabled={dynamicfield}
                  onClick={() => {
                    handleAddNewProject();
                  }}
                >
                  <MdAddCircleOutline /> {`${t('addNew')} ${t('project')}`}
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
            {userInfo.role == 'contractor' ? (
              dynamicfield ? (
                <div className="d-flex align-items-center gap-1">
                  <TextField
                    required
                    className="mb-1"
                    value={projectName}
                    onChange={(e) => setProjectName(e.target.value)}
                    label={` ${t('project')} ${t('name')}`}
                    fullWidth
                  />
                </div>
              ) : null
            ) : (
              <Row>
                <Col md={6} className="TaskBtnFieldLeft">
                  {dynamicfield ? (
                    <div className="d-flex align-items-center gap-1">
                      <TextField
                        required
                        className="mb-1"
                        value={projectName}
                        onChange={(e) => setProjectName(e.target.value)}
                        label={` ${t('project')} ${t('name')}`}
                        fullWidth
                      />
                    </div>
                  ) : null}
                </Col>

                <Col md={6} className="TaskBtnFieldRight">
                  {dynamicfield &&
                    (userInfo.role == 'superadmin' ||
                      userInfo.role == 'admin') && (
                      <FormControl className={'mb-3 w-100'}>
                        <InputLabel>
                          {' '}
                          {t('select')} {t('client')}
                        </InputLabel>
                        <Select
                          value={contractorName}
                          onChange={(e) => setContractorName(e.target.value)}
                          required
                          MenuProps={{
                            PaperProps: {
                              style: {
                                maxHeight: 150,
                                top: 0,
                              },
                            },
                          }}
                        >
                          <MenuItem value="addNew">
                            <Link to={`/contractor/create`} className="addCont">
                              <MdAddCircleOutline /> {t('addNew')} {t('client')}
                            </Link>
                          </MenuItem>
                          {contractorData.map((item) => (
                            <MenuItem key={item._id} value={item._id}>
                              {item.first_name}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    )}
                </Col>
              </Row>
            )}

            <TextField
              required
              className="mb-3"
              value={taskName}
              onChange={validation}
              label={` ${t('task')} ${t('name')}`}
              fullWidth
              type="text"
            />
            {ShowErrorMessage && (
              <Alert variant="danger" className="error nameValidationErrorBox">
                {t('firstLetterAlphabet')}
              </Alert>
            )}
            <div>
              <ReactQuill
                theme="snow"
                value={taskDesc}
                onChange={handleDescription}
                placeholder={t('Write task description')}
              />
            </div>
            <Button
              variant="contained"
              color="primary"
              type="submit"
              className="mt-2 formbtn updatingBtn globalbtnColor"
              disabled={ShowErrorMessage}
            >
              {isSubmiting ? t('submitting') : t('submit')}
            </Button>
          </Form>
        </Box>
      </Modal>
    </div>
  );
}
