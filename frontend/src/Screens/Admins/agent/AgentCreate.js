import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import { Store } from '../../../Store';
import { Button } from 'react-bootstrap';
import { MenuItem, Select } from '@mui/material';
import FormSubmitLoader from '../../../Util/formSubmitLoader';
import Validations from '../../../Components/Validations';
import { toast } from 'react-toastify';
import { Link, useNavigate } from 'react-router-dom';
import { MdAddCircleOutline } from 'react-icons/md';
import ThreeLoader from '../../../Util/threeLoader';

export default function AgentCreate() {
  const navigate = useNavigate();
  const { state } = useContext(Store);
  const { userInfo, validationMsg } = state;
  const [submiting, setsubmiting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [categoryData, setCategoryData] = useState([]);
  const [agentData, setAgentData] = useState([]);
  const [filteredCategories, setFilteredCategories] = useState([]);

  const [user, setUser] = useState({
    firstName: '',
    lastName: '',
    email: '',
    image_url: '',
    status: true,
    role: 'agent',
    selectcategories: [],
  });
  const [imagePreview, setImagePreview] = useState('');

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === 'image_url') {
      const image_url = files[0].size / 1024 / 1024;
      if (image_url > 2) {
        toast.error(
          'The photo size greater than 2 MB. Make sure less than 2 MB.',
          {
            style: {
              border: '1px solid #ff0033',
              padding: '16px',
              color: '#ff0033',
            },
            iconTheme: {
              primary: '#ff0033',
              secondary: '#FFFAEE',
            },
          }
        );
        e.target.value = null;
        return;
      }
      setUser((prevState) => ({
        ...prevState,
        image_url: files[0],
      }));
      setImagePreview(window.URL.createObjectURL(files[0]));
    } else {
      setUser((prevState) => ({ ...prevState, [name]: value }));
    }
  };

  useEffect(() => {
    const FatchCategory = async () => {
      setIsLoading(true);
      try {
        const { data } = await axios.get(`/api/category/`, {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        });
        setCategoryData(data);
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    };
    FatchCategory();
  }, []);

  useEffect(() => {
    const FatchAgentData = async () => {
      setIsLoading(true);
      try {
        const { data } = await axios.post(`/api/user/`, { role: 'agent' });
        setAgentData(data);
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    };
    FatchAgentData();
  }, [categoryData]);

  useEffect(() => {
    const filteredCategory = () => {
      const assignedCategories = agentData.flatMap(
        (agent) => agent.agentCategory
      );
      const unassignedCategories = categoryData.filter(
        (category) => !assignedCategories.includes(category._id)
      );
      if (unassignedCategories) {
        setFilteredCategories(unassignedCategories);
        return unassignedCategories;
      }
    };
    filteredCategory();
  }, [categoryData, agentData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setsubmiting(true);
    const formDatas = new FormData();

    formDatas.append('file', user.image_url);
    formDatas.append('first_name', user.firstName);
    formDatas.append('last_name', user.lastName);
    formDatas.append('email', user.email);
    formDatas.append('role', user.role);
    formDatas.append('userStatus', user.status);
    user.selectcategories.forEach((categoryId) => {
      formDatas.append('agentCategory', categoryId);
    });
    try {
      const response = await axios.post(`/api/user/add`, formDatas, {
        headers: {
          'content-type': 'multipart/form-data',
          authorization: `Bearer ${userInfo.token}`,
        },
      });
      if (response.status === 200) {
        setUser({
          firstName: '',
          lastName: '',
          email: '',
          status: true,
          role: '',
          selectcategories: [],
          image_url: '',
        });
        toast.success('Agent Created Successfully !');
        navigate('/agent');
      }
    } catch (error) {
      toast.error(error.response?.data?.message);
    } finally {
      setsubmiting(false);
    }
  };

  return (
    <>
      {isLoading ? (
        <>
          <ThreeLoader />
        </>
      ) : error ? (
        <div>{error}</div>
      ) : (
        <>
          <ul className="nav-style1">
            <li>
              <Link to="/agent">
                <a>Agent</a>
              </Link>
            </li>
            <li>
              <Link to="/agent/create">
                <a className="active">Create</a>
              </Link>
            </li>
          </ul>
          {submiting && <FormSubmitLoader />}

          <form onSubmit={handleSubmit}>
            <div className="row">
              <div className="col-md-12">
                <div className="form-group">
                  <label className="form-label fw-semibold">Image</label>
                  <input
                    type="file"
                    className="form-control file-control"
                    id="clientImage"
                    name="image_url"
                    onChange={handleChange}
                  />
                  <div className="form-text">Upload image size 300x300!</div>

                  <div className="mt-2">
                    {imagePreview ? (
                      <img
                        src={imagePreview}
                        alt="image"
                        className="img-thumbnail creatForm me-2"
                      />
                    ) : (
                      <img
                        src="https://res.cloudinary.com/dmhxjhsrl/image/upload/v1698911473/r5jajgkngwnzr6hzj7vn.jpg"
                        alt="image"
                        className="img-thumbnail creatForm me-2"
                      />
                    )}
                  </div>
                </div>
              </div>

              <div className="col-md-12">
                <div className="form-group">
                  <label className="form-label fw-semibold">First Name</label>
                  <input
                    type="text"
                    className="form-control"
                    name="firstName"
                    value={user.firstName}
                    onChange={handleChange}
                    required={true}
                  />
                </div>
              </div>

              <div className="col-md-12">
                <div className="form-group">
                  <label className="form-label fw-semibold">Last Name</label>
                  <input
                    type="text"
                    className="form-control"
                    name="lastName"
                    value={user.lastName}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="col-md-12">
                <div className="form-group">
                  <label className="form-label fw-semibold">Email</label>
                  <input
                    type="text"
                    className="form-control"
                    name="email"
                    value={user.email}
                    onChange={handleChange}
                    required={true}
                  />
                </div>
                <Validations type="email" value={user.email} />
              </div>

              <div className="col-md-12">
                <div className="form-group">
                  <label className="form-label fw-semibold">Status</label>
                  <Select
                    className={`form-control ${user.status ? 'active' : ''}`}
                    value={user.status}
                    onChange={handleChange}
                    inputProps={{
                      name: 'status',
                      id: 'status',
                    }}
                    required
                  >
                    <MenuItem value={true} className="active-option">
                      Active
                    </MenuItem>
                    <MenuItem value={false} className="active-option">
                      Inactive
                    </MenuItem>
                  </Select>
                </div>
              </div>

              <div className="col-md-12">
                <div className="form-group">
                  <label className="form-label fw-semibold">Categories</label>
                  <Select
                    className={`form-control ${
                      user.selectcategories ? 'active' : ''
                    }`}
                    required
                    multiple
                    value={user.selectcategories}
                    onChange={handleChange}
                    inputProps={{
                      name: 'selectcategories',
                      id: 'categories',
                    }}
                  >
                    <MenuItem value="addNew">
                      <Link to={`/adminCategoriesList`} className="addCont">
                        <MdAddCircleOutline /> Add New Category
                      </Link>
                    </MenuItem>
                    {filteredCategories &&
                      filteredCategories.map((option) => (
                        <MenuItem key={option._id} value={option._id}>
                          {option.categoryName}
                        </MenuItem>
                      ))}
                  </Select>
                </div>
              </div>

              <div className="col-12">
                <Button
                  className="mt-2 formbtn globalbtnColor model-btn "
                  variant="contained"
                  color="primary"
                  type="submit"
                  disabled={submiting || validationMsg !== null}
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
