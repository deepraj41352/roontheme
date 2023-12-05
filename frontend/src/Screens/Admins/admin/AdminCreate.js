import axios from 'axios';
import React, { useContext, useState } from 'react';
import { Store } from '../../../Store';
import { Button } from 'react-bootstrap';
import { MenuItem, Select } from '@mui/material';
import FormSubmitLoader from '../../../Util/formSubmitLoader';
import Validations from '../../../Components/Validations';
import { toast } from 'react-toastify';
import { Link, useNavigate } from 'react-router-dom';

export default function AdminCreate() {
  const navigate = useNavigate();
  const { state } = useContext(Store);
  const { userInfo, validationMsg } = state;
  const [submiting, setsubmiting] = useState(false);
  const [user, setUser] = useState({
    firstName: '',
    lastName: '',
    email: '',
    image_url: '',
    status: true,
    role: 'admin',
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
          image_url: '',
        });
        toast.success('Admin Created Successfully !');
        navigate('/admin');
      }
    } catch (error) {
      toast.error(error.response?.data?.message);
    } finally {
      setsubmiting(false);
    }
  };

  return (
    <>
      <ul className="nav-style1">
        <li>
          <Link to="/admin">
            <a>Admin</a>
          </Link>
        </li>
        <li>
          <Link to="/admin/create">
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
  );
}
