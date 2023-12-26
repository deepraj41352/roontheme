import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import { Store } from '../../../Store';
import { Button, Card, Form } from 'react-bootstrap';
import { Alert, Avatar, MenuItem, Select } from '@mui/material';
import FormSubmitLoader from '../../../Util/formSubmitLoader';
import { toast } from 'react-toastify';
import { Link, useNavigate } from 'react-router-dom';
import AvatarImage from '../../../Components/Avatar';
import truncateText from '../../../TruncateText';
import { MdAddCircleOutline } from 'react-icons/md';
import ThreeLoader from '../../../Util/threeLoader';
import { useTranslation } from 'react-i18next';

export default function TasksCreate() {
  const navigate = useNavigate();
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { userInfo } = state;
  const [submiting, setsubmiting] = useState(false);
  const [projectName, setProjectName] = useState('');
  const [SelectProjectName, setSelectProjectName] = useState('');
  const [taskName, setTaskName] = useState('');
  const [taskDesc, setTaskDesc] = useState('');
  const [category, setCategory] = useState('');
  const [contractorName, setContractorName] = useState('');
  const [categoryData, setCategoryData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dynamicfield, setDynamicfield] = useState(false);
  const [ProjectData, setProjectData] = useState([]);
  const [ShowErrorMessage, setShowErrorMessage] = useState(false);
  const [contractorData, setContractorData] = useState([]);
  const [filterCategory, setFilterCategory] = useState([]);
  const [toggleNot, setToggleNot] = useState(false);
  const [selectedContractor, setSelectedContractor] = useState('');
  const [agentData, setAgentData] = useState([]);
  const [error, setError] = useState('');
  const { t } = useTranslation();

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
        setError(t('An Error Occurred'));
      } finally {
        setLoading(false);
      }
    };
    FatchProject();
  }, []);

  useEffect(() => {
    const FatchContractorData = async () => {
      try {
        const { data } = await axios.post(`/api/user/`, { role: 'contractor' });
        setContractorData(data);
      } catch (error) {
        setError(t('An Error Occurred'));
      }
    };
    FatchContractorData();
  }, []);

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
        setError(t('An Error Occurred'));
      } finally {
        setLoading(false);
      }
    };
    FatchCategory();
  }, []);

  useEffect(() => {
    const FatchContractorData = async () => {
      try {
        const { data } = await axios.post(`/api/user/`, { role: 'agent' });
        setAgentData(data);
      } catch (error) {
        setError(t('An Error Occurred'));
      }
    };
    FatchContractorData();
  }, []);

  function generateColorFromAscii(str) {
    let color = '#';
    const combination = str
      .split('')
      .map((char) => char.charCodeAt(0))
      .reduce((acc, value) => acc + value, 0);
    color += (combination * 12345).toString(16).slice(0, 6);
    return color;
  }

  const addDynamic = () => {
    setDynamicfield(true);
  };

  const removeDymanic = () => {
    setDynamicfield(false);
    setProjectName('');
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
        const contractorId = contractor ? contractor[0]._id : 'not avaliable';
        setSelectedContractor(contractor);
      } else {
        setError(t('An Error Occurred'));
      }
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setsubmiting(true);
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
          headers: {
            authorization: `Bearer ${userInfo.token}`,
          },
        }
      );

      if (data.status === 201) {
        setToggleNot(!toggleNot);
        setProjectName('');
        setTaskName('');
        setTaskDesc('');
        setCategory('');
        setContractorName('');
        setSelectProjectName('');
        toast.success(`${t('task')} ${t('created successfully')}`);
        navigate('/admin/task-screen');
        setDynamicfield(false);
        ctxDispatch({ type: 'NOTIFICATION_TOGGLE', payload: !toggleNot });
        // setToggleNot(false);
      }
      if (data.status === 200) {
        setDynamicfield(false);
        toast.error(data.data.message);
      }
    } catch (error) {
      toast.error(`${t('failedCreate')} ${t('task')}`);
    } finally {
      setsubmiting(false);
    }
  };

  return (
    <>
      {loading ? (
        <>
          <ThreeLoader />
        </>
      ) : error ? (
        <div>{error}</div>
      ) : (
        <>
          <ul className="nav-style1">
            <li>
              <Link to="/admin/task-screen">
                <a>{t('tasks')}</a>
              </Link>
            </li>
            <li>
              <Link to="/task/create-screen">
                <a className="active">{t('create')}</a>
              </Link>
            </li>
          </ul>
          {submiting && <FormSubmitLoader />}
          <div className="formWidth">
            <form onSubmit={handleSubmit}>
              <div className="row">
                <div className="col-md-12">
                  <div className="form-group">
                    <label className="form-label fw-semibold">
                      {t('categories')}
                    </label>
                    <div className="cateContainerCreate">
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
                </div>

                <div className="col-md-12">
                  <div className="form-group">
                    <label className="form-label fw-semibold">
                      {t('select')} Project
                    </label>
                    <Select
                      className="form-control"
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
                          addDynamic();
                        }}
                        className="active-option"
                      >
                        <MdAddCircleOutline />
                        {t('addNew')} Project
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
                  </div>
                </div>

                {dynamicfield ? (
                  <div className="col-md-12">
                    <div className="form-group">
                      <label className="form-label fw-semibold">
                        Project {t('name')}
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        name="name"
                        value={projectName}
                        onChange={(e) => setProjectName(e.target.value)}
                        required={true}
                      />
                    </div>
                  </div>
                ) : null}

                <div className="col-md-12">
                  <div className="form-group">
                    <label className="form-label fw-semibold">
                      {t('task')} {t('name')}
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      name="name"
                      value={taskName}
                      onChange={validation}
                      required={true}
                    />
                  </div>
                </div>
                <div className="col-md-12">
                  <div className="form-group">
                    {ShowErrorMessage && (
                      <Alert
                        severity="warning"
                        className="error nameValidationErrorBox"
                      >
                        {t('firstLetterAlphabet')}
                      </Alert>
                    )}
                  </div>
                </div>
                <div className="col-md-12">
                  <div className="form-group">
                    <label className="form-label fw-semibold">
                      {t('description')}
                    </label>
                    <textarea
                      className="form-control"
                      name="description"
                      value={taskDesc}
                      onChange={(e) => setTaskDesc(e.target.value)}
                      rows="6"
                    />
                  </div>
                </div>
                {(userInfo.role == 'superadmin' ||
                  userInfo.role == 'admin') && (
                  <div className="col-md-12">
                    <div className="form-group">
                      <label className="form-label fw-semibold">
                        {t('select')} {t('client')}
                      </label>
                      {SelectProjectName && selectedContractor ? (
                        <Select
                          className={`form-control`}
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
                          className={`form-control`}
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
                              <MdAddCircleOutline />
                              {t('addNew')} {t('client')}
                            </Link>
                          </MenuItem>
                          {contractorData.map((item) => (
                            <MenuItem key={item._id} value={item._id}>
                              {item.first_name}
                            </MenuItem>
                          ))}
                        </Select>
                      )}
                    </div>
                  </div>
                )}

                <div className="col-12">
                  <Button
                    className="mt-2 formbtn globalbtnColor model-btn "
                    variant="contained"
                    color="primary"
                    type="submit"
                    disabled={submiting}
                  >
                    {submiting ? t('submitting') : t('submit')}
                  </Button>
                </div>
              </div>
            </form>
          </div>
        </>
      )}
    </>
  );
}
