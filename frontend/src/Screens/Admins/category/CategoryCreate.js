import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import { Store } from '../../../Store';
import { Button } from 'react-bootstrap';
import { MenuItem, Select } from '@mui/material';
import FormSubmitLoader from '../../../Util/formSubmitLoader';
import { toast } from 'react-toastify';
import { Link, useNavigate } from 'react-router-dom';
import AvatarImage from '../../../Components/Avatar';

export default function CategoryCreate() {
  const navigate = useNavigate();
  const { state } = useContext(Store);
  const { userInfo } = state;
  const [submiting, setsubmiting] = useState(false);
  const [color, setColor] = useState('');
  const [user, setUser] = useState({
    image_url: '',
    name: '',
    description: '',
    status: true,
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

    try {
      const submitData = new FormData();
      submitData.append('categoryName', user.name);
      submitData.append('categoryDescription', user.description);
      submitData.append('categoryStatus', user.status);
      submitData.append('categoryImage', user.image_url);

      console.log('submitData', submitData);

      const { data } = await axios.post(`/api/category/`, submitData, {
        headers: {
          'content-type': 'multipart/form-data',
          authorization: `Bearer ${userInfo.token}`,
        },
      });
      setUser({
        name: '',
        description: '',
        image_url: '',
      });
      toast.success('Category Created Successfully !');
      navigate('/category');
    } catch (error) {
      toast.error(error.response?.data?.message);
    } finally {
      setsubmiting(false);
    }
  };

  useEffect(() => {
    function generateColorFromAscii(str) {
      let color = '#';
      const combination = str
        .split('')
        .map((char) => char.charCodeAt(0))
        .reduce((acc, value) => acc + value, 0);
      color += (combination * 12345).toString(16).slice(0, 6);
      return color;
    }

    if (user && user.name) {
      const name = user.name.toLowerCase().charAt(0);
      const generatedColor = generateColorFromAscii(name);
      setColor(generatedColor);
    }
  }, [user.name]);

  return (
    <>
      <ul className="nav-style1">
        <li>
          <Link to="/category">
            <a>Categories</a>
          </Link>
        </li>
        <li>
          <Link to="/category/create">
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
                ) : user.name ? (
                  <div className="avtarImage">
                    <AvatarImage
                      id="cateEditImgAvatar creatForm"
                      name={user.name}
                      bgColor={color}
                    />
                  </div>
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
              <label className="form-label fw-semibold">Name</label>
              <input
                type="text"
                className="form-control"
                name="name"
                value={user.name}
                onChange={handleChange}
                required={true}
              />
            </div>
          </div>

          <div className="col-md-12">
            <div className="form-group">
              <label className="form-label fw-semibold">Description</label>
              <textarea
                className="form-control"
                name="description"
                value={user.description}
                onChange={handleChange}
                rows="6"
              />
            </div>
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
              disabled={submiting}
            >
              {submiting ? 'SUBMITTING' : 'SUBMIT '}
            </Button>
          </div>
        </div>
      </form>
    </>
  );
}
