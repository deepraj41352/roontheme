import React, { useContext, useState } from 'react';
import { Store } from '../../Store';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Button } from 'react-bootstrap';
import axios from 'axios';
import FormSubmitLoader from '../../Util/formSubmitLoader';
import { useTranslation } from 'react-i18next';

export default function ProfileUpdate() {
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { userInfo } = state;
  const [isSubmiting, setIsSubmiting] = useState(false);
  const { t } = useTranslation();
  const [user, setUser] = useState({
    image_url: '',
  });
  const [imagePreview, setImagePreview] = useState('');

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === 'image_url') {
      const image_url = files[0].size / 1024 / 1024;
      if (image_url > 2) {
        toast.error(
          t('ProfileUpdateErrorMsg'),
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
  const submitHandler = async (e) => {
    e.preventDefault();
    setIsSubmiting(true);
    const formDatas = new FormData();

    formDatas.append('file', user.image_url);

    try {
      const { data } = await axios.put(`/api/user/profile`, formDatas, {
        headers: {
          'content-type': 'multipart/form-data',
          authorization: `Bearer ${userInfo.token}`,
        },
      });

      toast.success(t('profilePicSuccessMsg'));
      ctxDispatch({ type: 'USER_UPDATE', payload: data.userData });
      localStorage.setItem('userInfo', JSON.stringify(data.userData));
    } catch (err) {
      toast.error(t('profilePicUpdateFailError'));
    } finally {
      setIsSubmiting(false);
    }
  };
  return (
    <>
      <ul className="nav-style1">
        <li>
          <Link to="/profile-screen">
            <address>{t('Profile')}</address>
          </Link>
        </li>
        <li>
          <Link to="/profile/picture">
            <a className="active"> {t('picture')}</a>
          </Link>
        </li>
      </ul>
      {isSubmiting && <FormSubmitLoader />}

      <form onSubmit={submitHandler}>
        <div className="row">
          <div className="col-md-12">
            <div className="form-group">
              <label className="form-label fw-semibold"> {t('image')}</label>
              <input
                disabled={isSubmiting}
                type="file"
                className="form-control file-control"
                id="clientImage"
                name="image_url"
                onChange={handleChange}
              />
              <div className="form-text">  {t('Upload image size')} 300x300!</div>

              <div className="mt-2">
                {imagePreview ? (
                  <img
                    src={imagePreview}
                    alt="image"
                    className="img-thumbnail creatForm me-2"
                  />
                ) : (
                  <img
                    src={userInfo.profile_picture}
                    alt="image"
                    className="img-thumbnail creatForm me-2"
                  />
                )}
              </div>
              <div className="col-12">
                <Button
                  className="mt-2  globalbtnColor model-btn "
                  variant="contained"
                  color="primary"
                  type="submit"
                  disabled={isSubmiting}
                >
                  {isSubmiting ? t('submitting') : t('submit')}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </form>
    </>
  );
}
