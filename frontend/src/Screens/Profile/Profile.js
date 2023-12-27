import React, { useContext, useState } from 'react';
import { Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';
import { MenuItem, Select } from '@mui/material';
import { Store } from '../../Store';
import Validations from '../../Components/Validations';
import FormSubmitLoader from '../../Util/formSubmitLoader';
import { useTranslation } from 'react-i18next';

function Profile() {
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { userInfo } = state;
  const [firstName, setFirstName] = useState(
    userInfo.first_name ? userInfo.first_name : ''
  );
  const [lastName, setLastName] = useState(
    userInfo.last_name ? userInfo.last_name : ''
  );
  const [email, setEmail] = useState(userInfo.email ? userInfo.email : '');
  const [mobileNum, setMobileNum] = useState(
    userInfo.phone_number ? userInfo.phone_number : ''
  );
  const [gender, setGender] = useState(userInfo.gender ? userInfo.gender : '');
  const [dob, setDob] = useState(userInfo.dob ? userInfo.dob : '');
  const [address, setAddress] = useState(
    userInfo.address ? userInfo.address : ''
  );
  const [country, setCountry] = useState(
    userInfo.country ? userInfo.country : ''
  );
  const [isSubmiting, setIsSubmiting] = useState(false);
  const { t } = useTranslation();

  var countrylist = [
    'Afghanistan',
    'Albania',
    'Algeria',
    'Andorra',
    'Angola',
    'Anguilla',
    'Antigua &amp; Barbuda',
    'Argentina',
    'Armenia',
    'Aruba',
    'Australia',
    'Austria',
    'Azerbaijan',
    'Bahamas',
    'Bahrain',
    'Bangladesh',
    'Barbados',
    'Belarus',
    'Belgium',
    'Belize',
    'Benin',
    'Bermuda',
    'Bhutan',
    'Bolivia',
    'Bosnia &amp; Herzegovina',
    'Botswana',
    'Brazil',
    'British Virgin Islands',
    'Brunei',
    'Bulgaria',
    'Burkina Faso',
    'Burundi',
    'Cambodia',
    'Cameroon',
    'Cape Verde',
    'Cayman Islands',
    'Chad',
    'Chile',
    'China',
    'Colombia',
    'Congo',
    'Cook Islands',
    'Costa Rica',
    'Cote D Ivoire',
    'Croatia',
    'Cruise Ship',
    'Cuba',
    'Cyprus',
    'Czech Republic',
    'Denmark',
    'Djibouti',
    'Dominica',
    'Dominican Republic',
    'Ecuador',
    'Egypt',
    'El Salvador',
    'Equatorial Guinea',
    'Estonia',
    'Ethiopia',
    'Falkland Islands',
    'Faroe Islands',
    'Fiji',
    'Finland',
    'France',
    'French Polynesia',
    'French West Indies',
    'Gabon',
    'Gambia',
    'Georgia',
    'Germany',
    'Ghana',
    'Gibraltar',
    'Greece',
    'Greenland',
    'Grenada',
    'Guam',
    'Guatemala',
    'Guernsey',
    'Guinea',
    'Guinea Bissau',
    'Guyana',
    'Haiti',
    'Honduras',
    'Hong Kong',
    'Hungary',
    'Iceland',
    'India',
    'Indonesia',
    'Iran',
    'Iraq',
    'Ireland',
    'Isle of Man',
    'Israel',
    'Italy',
    'Jamaica',
    'Japan',
    'Jersey',
    'Jordan',
    'Kazakhstan',
    'Kenya',
    'Kuwait',
    'Kyrgyz Republic',
    'Laos',
    'Latvia',
    'Lebanon',
    'Lesotho',
    'Liberia',
    'Libya',
    'Liechtenstein',
    'Lithuania',
    'Luxembourg',
    'Macau',
    'Macedonia',
    'Madagascar',
    'Malawi',
    'Malaysia',
    'Maldives',
    'Mali',
    'Malta',
    'Mauritania',
    'Mauritius',
    'Mexico',
    'Moldova',
    'Monaco',
    'Mongolia',
    'Montenegro',
    'Montserrat',
    'Morocco',
    'Mozambique',
    'Namibia',
    'Nepal',
    'Netherlands',
    'Netherlands Antilles',
    'New Caledonia',
    'New Zealand',
    'Nicaragua',
    'Niger',
    'Nigeria',
    'Norway',
    'Oman',
    'Pakistan',
    'Palestine',
    'Panama',
    'Papua New Guinea',
    'Paraguay',
    'Peru',
    'Philippines',
    'Poland',
    'Portugal',
    'Puerto Rico',
    'Qatar',
    'Reunion',
    'Romania',
    'Russia',
    'Rwanda',
    'Saint Pierre &amp; Miquelon',
    'Samoa',
    'San Marino',
    'Satellite',
    'Saudi Arabia',
    'Senegal',
    'Serbia',
    'Seychelles',
    'Sierra Leone',
    'Singapore',
    'Slovakia',
    'Slovenia',
    'South Africa',
    'South Korea',
    'Spain',
    'Sri Lanka',
    'St Kitts &amp; Nevis',
    'St Lucia',
    'St Vincent',
    'St. Lucia',
    'Sudan',
    'Suriname',
    'Swaziland',
    'Sweden',
    'Switzerland',
    'Syria',
    'Taiwan',
    'Tajikistan',
    'Tanzania',
    'Thailand',
    "Timor L'Este",
    'Togo',
    'Tonga',
    'Trinidad &amp; Tobago',
    'Tunisia',
    'Turkey',
    'Turkmenistan',
    'Turks &amp; Caicos',
    'Uganda',
    'Ukraine',
    'United Arab Emirates',
    'United Kingdom',
    'Uruguay',
    'Uzbekistan',
    'Venezuela',
    'Vietnam',
    'Virgin Islands (US)',
    'Yemen',
    'Zambia',
    'Zimbabwe',
  ];
  const submitHandler = async (e) => {
    e.preventDefault();
    setIsSubmiting(true);
    const formDatas = new FormData();

    formDatas.append('first_name', firstName);
    formDatas.append('last_name', lastName);
    formDatas.append('email', email);
    formDatas.append('phone_number', mobileNum);
    formDatas.append('gender', gender);
    formDatas.append('dob', dob);
    formDatas.append('address', address);
    formDatas.append('country', country);

    try {
      const { data } = await axios.put(`/api/user/profile`, formDatas, {
        headers: {
          authorization: `Bearer ${userInfo.token}`,
        },
      });

      toast.success(t('profileSuccessMsg'));

      ctxDispatch({ type: 'USER_UPDATE', payload: data.userData });
      localStorage.setItem('userInfo', JSON.stringify(data.userData));
    } catch (err) {
      toast.error(t('profileUpdateFailError'));
    } finally {
      setIsSubmiting(false);
    }
  };

  return (
    <>
      <ul className="nav-style1">
        <li>
          <Link to="/profile-screen">
            <a className="active">{t('Profile')}</a>
          </Link>
        </li>
        <li>
          <Link to="/profile/picture">
            <a> {t('picture')}</a>
          </Link>
        </li>
      </ul>
      {isSubmiting && <FormSubmitLoader />}
      <form onSubmit={submitHandler}>
        <div className="row">
          <div className="col-md-12">
            <div className="form-group">
              <label className="form-label fw-semibold">{t('firstname')}</label>
              <input
                type="text"
                className="form-control"
                name="firstName"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required={true}
              />
            </div>
          </div>

          <div className="col-md-12">
            <div className="form-group">
              <label className="form-label fw-semibold"> {t('lastname')}</label>
              <input
                type="text"
                className="form-control"
                name="lastName"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
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
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required={true}
                disabled={true}
              />
            </div>
            <Validations type="email" value={email} />
          </div>

          <div className="col-md-12">
            <div className="form-group">
              <label className="form-label fw-semibold"> {t('Mobile Number')}</label>
              <input
                type="text"
                className="form-control"
                placeholder={t('Mobile Number')}
                value={mobileNum}
                onChange={(e) => setMobileNum(e.target.value)}
              />
            </div>
            <Validations type="text" value={mobileNum} />
          </div>
          <div className="col-md-12">
            <div className="form-group">
              <label className="form-label fw-semibold"> {t('Gender')}</label>
              <Select
                className="form-control"
                value={gender}
                onChange={(e) => setGender(e.target.value)}
              >
                <MenuItem value="" disabled>
                  {t('status')}
                </MenuItem>
                <MenuItem value="female">  {t('female')}</MenuItem>
                <MenuItem value="male"> {t('male')}</MenuItem>
                <MenuItem value="others"> {t('others')}</MenuItem>
              </Select>
            </div>
          </div>
          <div className="col-md-12">
            <div className="form-group">
              <label className="form-label fw-semibold"> {t('address')}</label>
              <input
                type="text"
                className="form-control"
                placeholder={t('address')}
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
            </div>
          </div>

          <div className="col-md-12">
            <div className="form-group">
              <label className="form-label fw-semibold"> {t('country')}</label>
              <Select
                className="form-control"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                MenuProps={{
                  PaperProps: {
                    style: {
                      maxHeight: 150,
                      top: 474,
                    },
                  },
                }}
              >
                <MenuItem value="" disabled>
                  {t('status')}
                </MenuItem>
                {countrylist.map((countryName) => (
                  <MenuItem key={countryName} value={countryName}>
                    {countryName}
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
              disabled={isSubmiting}
            >
              {isSubmiting ? t('submitting') : t('submit')}
            </Button>
          </div>
        </div>
      </form>
    </>
  );
}

export default Profile;
