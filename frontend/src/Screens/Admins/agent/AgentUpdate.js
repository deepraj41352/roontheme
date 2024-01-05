import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import { Store } from '../../../Store';
import { Button } from 'react-bootstrap';
import { MenuItem, Select } from '@mui/material';
import FormSubmitLoader from '../../../Util/formSubmitLoader';
import Validations from '../../../Components/Validations';
import { toast } from 'react-toastify';
import { Link, useNavigate, useParams } from 'react-router-dom';
import ThreeLoader from '../../../Util/threeLoader';
import { useTranslation } from 'react-i18next';
import { MdAddCircleOutline } from 'react-icons/md';

export default function AgentUpdate() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { id } = useParams();
  const { state } = useContext(Store);
  const { userInfo, validationMsg, languageName } = state;
  const [submiting, setsubmiting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [categoryData, setCategoryData] = useState([]);
  const [agentData, setAgentData] = useState([]);
  const [filteredCategories, setFilteredCategories] = useState([]);
  const [currentUserCategories, setCurrentUsercategories] = useState([]);

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

  useEffect(() => {
    const FatchCategory = async () => {
      setIsLoading(true);
      try {
        const { data } = await axios.get(`/api/category/`, {
          headers: {
            'Accept-Language': languageName,
          },
        });
        setCategoryData(data);
      } catch (error) {
        setError(t('An Error Occurred'));
      } finally {
        setIsLoading(false);
      }
    };
    FatchCategory();
  }, [id, languageName]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === 'image_url') {
      const image_url = files[0].size / 1024 / 1024;
      if (image_url > 2) {
        toast.error(t('ProfileErrorMsg'), {
          style: {
            border: '1px solid #ff0033',
            padding: '16px',
            color: '#ff0033',
          },
          iconTheme: {
            primary: '#ff0033',
            secondary: '#FFFAEE',
          },
        });
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
    const FatchAgentData = async () => {
      setIsLoading(true);
      try {
        const { data } = await axios.post(`/api/user/`, { role: 'agent' });
        setAgentData(data);
      } catch (error) {
        setError(t('An Error Occurred'));
      } finally {
        setIsLoading(false);
      }
    };
    FatchAgentData();
  }, [categoryData]);

  useEffect(() => {
    const fetchUserData = async () => {
      setIsLoading(true);
      try {
        const { data } = await axios.get(`/api/user/${id}`);
        setUser({
          firstName: data.first_name,
          lastName: data.last_name,
          email: data.email,
          status: data.userStatus,
          role: 'agent',
          image_url: data.profile_picture,
          selectcategories: data.agentCategory,
        });
      } catch (error) {
        setError(t('An Error Occurred'));
      } finally {
        setIsLoading(false);
      }
    };
    fetchUserData();
  }, [id]);

  useEffect(() => {
    const filteredCategory = () => {
      setIsLoading(true);
      try {
        const assignedCategories = agentData.flatMap(
          (agent) => agent.agentCategory
        );
        const apiCategory = categoryData
          .filter((categoryData) =>
            user.selectcategories.includes(categoryData._id)
          )
          .map((assignedCategory) => assignedCategory);
        setCurrentUsercategories(apiCategory);
        const unassignedCategories = categoryData.filter(
          (category) => !assignedCategories.includes(category._id)
        );
        if (unassignedCategories.length > 0) {
          setFilteredCategories(unassignedCategories);
          return unassignedCategories;
        }
      } catch (error) {
        setError(t('An Error Occurred'));
      } finally {
        setIsLoading(false);
      }
    };
    filteredCategory();
  }, [categoryData, agentData]);

  const newMergedCategory = [...filteredCategories, ...currentUserCategories];

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
      const response = await axios.put(`/api/user/update/${id}`, formDatas, {
        headers: {
          'content-type': 'multipart/form-data',
          authorization: `Bearer ${userInfo.token}`,
        },
      });
      if (response.status === 200) {
        toast.success(`${t('agent')} ${t('update successfully')}`);
        navigate('/agent-screen');
      }
    } catch (error) {
      toast.error(`${t('failedUpdate')} ${t('admin')}`);
    } finally {
      setsubmiting(false);
    }
  };

  return (
    <>
      {isLoading ? (
        <ThreeLoader />
      ) : error ? (
        <div>{error}</div>
      ) : (
        <>
          <ul className="nav-style1">
            <li>
              <Link to="/agent-screen">
                <a>{t('agent')}</a>
              </Link>
            </li>
            <li>
              <Link to="/agent/create-screen">
                <a>{t('create')}</a>
              </Link>
            </li>
            <li>
              <Link to="/agent/:id">
                <a className="active">{t('update')}</a>
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
                      {t('image')}
                    </label>
                    <input
                      type="file"
                      className="form-control file-control"
                      id="clientImage"
                      name="image_url"
                      onChange={handleChange}
                    />
                    <div className="form-text">
                      {t('Upload image size')} 300x300!
                    </div>
                    <div className="mt-2">
                      {imagePreview ? (
                        <img
                          src={imagePreview}
                          alt="image"
                          className="img-thumbnail creatForm me-2"
                        />
                      ) : (
                        <img
                          src={user.image_url}
                          alt="image"
                          className="img-thumbnail creatForm me-2"
                        />
                      )}
                    </div>
                  </div>
                </div>

                <div className="col-md-12">
                  <div className="form-group">
                    <label className="form-label fw-semibold">
                      {t('firstname')}
                    </label>
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
                    <label className="form-label fw-semibold">
                      {t('lastname')}
                    </label>
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
                    <label className="form-label fw-semibold">E-mail</label>
                    <input
                      type="text"
                      className="form-control cursor"
                      name="email"
                      value={user.email}
                      onChange={handleChange}
                      required={true}
                      disabled={true}
                    />
                  </div>
                  <Validations type="email" value={user.email} />
                </div>

                <div className="col-md-12">
                  <div className="form-group">
                    <label className="form-label fw-semibold">
                      {t('status')}
                    </label>
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
                        {t('active')}
                      </MenuItem>
                      <MenuItem value={false} className="active-option">
                        {t('inactive')}
                      </MenuItem>
                    </Select>
                  </div>
                </div>

                <div className="col-md-12">
                  <div className="form-group">
                    <label className="form-label fw-semibold">
                      {t('categories')}
                    </label>
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
                        <Link to={`/adminCategoriesList`} className="addCont">
                          <MdAddCircleOutline /> {t('addNew')} {t('categories')}
                        </Link>
                      </MenuItem>
                      {newMergedCategory &&
                        newMergedCategory.map((option) => (
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
