import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import { Store } from '../../../Store';
import { Button, Form } from 'react-bootstrap';
import { Alert, Avatar, MenuItem, Select } from '@mui/material';
import FormSubmitLoader from '../../../Util/formSubmitLoader';
import { toast } from 'react-toastify';
import { Link, useNavigate } from 'react-router-dom';
import AvatarImage from '../../../Components/Avatar';
import truncateText from '../../../TruncateText';
import { MdAddCircleOutline } from 'react-icons/md';
import ThreeLoader from '../../../Util/threeLoader';

export default function ContractorTasksCreate() {
  const navigate = useNavigate();
  const { state } = useContext(Store);
  const { userInfo } = state;
  const [submiting, setsubmiting] = useState(false);
  const [projectName, setProjectName] = useState('');
  const [SelectProjectName, setSelectProjectName] = useState('');
  const [taskName, setTaskName] = useState('');
  const [taskDesc, setTaskDesc] = useState('');
  const [category, setCategory] = useState('');
  const [categoryData, setCategoryData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModelOpen, setIsModelOpen] = useState(false);
  const [dynamicfield, setDynamicfield] = useState(false);
  const [ProjectData, setProjectData] = useState([]);
  const [ShowErrorMessage, setShowErrorMessage] = useState(false);
  const [filterCategory, setFilterCategory] = useState([]);
  const [agentData, setAgentData] = useState([]);
  const [error, setError] = useState('');
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
        setError(error);
      } finally {
        setLoading(false);
      }
    };
    FatchProject();
  }, [isModelOpen]);

  // Get Category
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

  // {Get Agent User}
  useEffect(() => {
    const FatchContractorData = async () => {
      try {
        const { data } = await axios.post(`/api/user/`, { role: 'agent' });
        setAgentData(data);
      } catch (error) {
        toast.error(error);
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

  // filteried category
  useEffect(() => {
    const fetchData = () => {
      const filteredCategory = agentData.flatMap(
        (agentCate) => agentCate.agentCategory
      );
      console.log('filteredCategory', filteredCategory);

      const matchWithCateData = filteredCategory.map((AgentsCateId) =>
        categoryData.find((cat) => cat._id === AgentsCateId)
      );
      const Category = matchWithCateData ? matchWithCateData : null;
      const finalCategory = Category.filter(Boolean);
      setFilterCategory(finalCategory);
      console.log('matchWithCateData', finalCategory);
    };

    fetchData();
  }, [agentData, categoryData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setsubmiting(true);
    try {
      console.log(
        'submitData',
        SelectProjectName,
        projectName,
        taskName,
        taskDesc,
        category
      );
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
        setProjectName('');
        setTaskName('');
        setTaskDesc('');
        setCategory('');
        setSelectProjectName('');
        toast.success(data.data.message);
        navigate('/contractor/tasks');
        setDynamicfield(false);
      }
      if (data.status === 200) {
        setDynamicfield(false);
        toast.error(data.data.message);
        setProjectName('');
        setTaskName('');
        setTaskDesc('');
        setCategory('');
        setSelectProjectName('');
      }
    } catch (error) {
      toast.error(error.message);
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
              <Link to="/contractor/tasks">
                <a>Tasks</a>
              </Link>
            </li>
            <li>
              <Link to="/contractor/tasks-create">
                <a className="active">Create</a>
              </Link>
            </li>
          </ul>
          {submiting && <FormSubmitLoader />}

          <form onSubmit={handleSubmit}>
            <div className="row">
              <div className="col-md-12">
                <div className="form-group">
                  <label className="form-label fw-semibold">Categories</label>
                  <div className="cateContainerCreate">
                    {filterCategory.map((category) => (
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
                    ))}
                  </div>
                </div>
              </div>

              <div className="col-md-12">
                <div className="form-group">
                  <label className="form-label fw-semibold">
                    Select Project
                  </label>
                  <Select
                    className="form-control"
                    value={SelectProjectName}
                    onChange={(e) => setSelectProjectName(e.target.value)}
                  >
                    <MenuItem
                      disabled={dynamicfield}
                      onClick={() => {
                        addDynamic();
                      }}
                      className="active-option"
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
                </div>
              </div>

              {dynamicfield ? (
                <div className="col-md-12">
                  <div className="form-group">
                    <label className="form-label fw-semibold">
                      Project Name
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
                  <label className="form-label fw-semibold">Task Name</label>
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
                      The first letter of the task should be an alphabet
                    </Alert>
                  )}
                </div>
              </div>
              <div className="col-md-12">
                <div className="form-group">
                  <label className="form-label fw-semibold">Description</label>
                  <textarea
                    className="form-control"
                    name="description"
                    value={taskDesc}
                    onChange={(e) => setTaskDesc(e.target.value)}
                    rows="6"
                  />
                </div>
              </div>
              <div className="col-12">
                <Button
                  className="mt-2 formbtn globalbtnColor model-btn "
                  variant="contained"
                  color="primary"
                  type="submit"
                  disabled={submiting}
                >
                  {submiting ? 'SUBMITTING' : 'SUBMIT '}
                </Button>
              </div>
            </div>
          </form>
        </>
      )}
    </>
  );
}
