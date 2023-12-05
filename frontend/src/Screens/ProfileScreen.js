import React, { useContext, useEffect, useState } from 'react';
import { Button, Card, Col, Container, Form, Row } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { Store } from '../Store';
import { toast } from 'react-toastify';
import axios from 'axios';
import Validations from '../Components/Validations';
import { ColorRing } from 'react-loader-spinner';
import {
  Alert,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from '@mui/material';
import { RiImageEditFill } from 'react-icons/ri';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import DatePicker from '@mui/lab/DatePicker';
import dayjs from 'dayjs';
// import { countries } from 'countries-list';

function ProfileScreen() {
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { toggleState, userInfo } = state;
  const theme = toggleState ? 'dark' : 'light';
  const navigate = useNavigate();

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
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedFileName, setSelectedFileName] = useState('');

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

    formDatas.append('file', selectedFile);
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
          'content-type': 'multipart/form-data',

          authorization: `Bearer ${userInfo.token}`,
        },
      });

      toast.success('Profile Updated Successfully !');
      ctxDispatch({ type: 'USER_UPDATE', payload: data.userData });
      localStorage.setItem('userInfo', JSON.stringify(data.userData));
    } catch (err) {
      toast.error(err.response?.data?.message);
    } finally {
      setIsSubmiting(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);
    setSelectedFileName(file ? file.name : '');
  };

  return (
    <Container className="Sign-up-container-regis d-flex w-100 profileDiv  flex-column justify-content-center align-items-center">
      <div className="ProfileScreen-inner px-4 py-3 w-100 d-flex justify-content-center align-items-center flex-column">
        <Row className="mb-3">
          <Col>
            <h4>User Profile</h4>
          </Col>
        </Row>
        <Row>
          <Col>
            <div className="overlayLoading profileContainer">
              <Card className={`${theme}CardBody editCartForm`}>
                <div className="FormContainerEdit2">
                  {isSubmiting && (
                    <div className="overlayLoadingItem1">
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
                    onSubmit={submitHandler}
                    className="w-100 editFormWidth "
                  >
                    <div className="classforprofile">
                      <Form.Group
                        className="mb-2"
                        controlId="formBasicPassword"
                      >
                        <Row className="editImgParent">
                          <Col>
                            <img
                              className="profile-icon-inner editCateImgContainer"
                              src={userInfo.profile_picture}
                              alt="user-image"
                            />
                          </Col>
                          <Col className="editImgChild">
                            <div className="mb-3">
                              <input
                                type="file"
                                onChange={handleFileChange}
                                style={{ display: 'none' }}
                                id="file-input"
                              />
                              <label
                                htmlFor="file-input"
                                className="editImgBtn"
                              >
                                <RiImageEditFill />
                              </label>
                            </div>
                          </Col>
                        </Row>
                      </Form.Group>
                    </div>
                    {selectedFileName && (
                      <Row className="mb-2 selected-img-container">
                        <Col className="selected-img">
                          <Alert className="selected-img-Box">
                            Selected File: {selectedFileName}
                          </Alert>
                        </Col>
                      </Row>
                    )}
                    <div className="d-flex align-items-center gap-2 my-3">
                      <TextField
                        className={`${theme}-user-profile-field`}
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        label="First Name"
                        fullWidth
                        required
                      />

                      <TextField
                        className={`${theme}-user-profile-field`}
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        label="Last Name"
                        fullWidth
                      />
                    </div>
                    <div className="my-3">
                      <TextField
                        className={`${theme}-user-profile-field profile-email-input`}
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        label="Email"
                        type="email"
                        fullWidth
                        disabled
                      />
                    </div>
                    <div className="my-3">
                      <TextField
                        className={`${theme}-user-profile-field`}
                        value={mobileNum}
                        onChange={(e) => setMobileNum(e.target.value)}
                        label="Contact Number"
                        fullWidth
                        type="text"
                      />
                      <Validations type="text" value={mobileNum} />
                    </div>
                    <div className="d-flex align-items-center gap-2 mb-3">
                      <FormControl className={`${theme}-user-profile-field`}>
                        <InputLabel>Gender</InputLabel>
                        <Select
                          className={`m-0 text-start ${theme}-user-profile-field`}
                          value={gender}
                          onChange={(e) => setGender(e.target.value)}
                        >
                          <MenuItem value="female">Female</MenuItem>
                          <MenuItem value="male">Male</MenuItem>
                          <MenuItem value="others">Others</MenuItem>
                        </Select>
                      </FormControl>
                      {/* <LocalizationProvider dateAdapter={AdapterDateFns}>
                        <DatePicker
                          label="Date Of Birth"
                          value={dob}
                          onChange={(e) => setDob(e.target.value)}
                          renderInput={(params) => <TextField {...params} />}
                        />
                      </LocalizationProvider> */}
                      <LocalizationProvider dateAdapter={AdapterDateFns}>
                        <div
                          className={`m-0 d-flex flex-column mbDate ${theme}-user-profile-field  ${theme}-user-profile-field-dob`}
                        >
                          <DatePicker
                            label="Date Of Birth"
                            className="m-0 "
                            value={dob}
                            required
                            error={false}
                            onChange={(date) => setDob(date)}
                            renderInput={(params) => <TextField {...params} />}
                          />
                        </div>
                      </LocalizationProvider>
                      {/* <TextField

                        value={dob}
                        onChange={(e) => setDob(e.target.value)}
                        label="DOB"
                        fullWidth
                      /> */}
                    </div>
                    <div className="my-3">
                      <TextField
                        className={`${theme}-user-profile-field`}
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        label="Address"
                        fullWidth
                      />
                    </div>
                    <div className="my-3">
                      <FormControl
                        className={`text-start ${theme}-user-profile-field`}
                      >
                        <InputLabel>Country</InputLabel>
                        <Select
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
                          {countrylist.map((countryName) => (
                            <MenuItem key={countryName} value={countryName}>
                              {countryName}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </div>
                    <div className="d-flex justify-content-start mt-4">
                      <Button
                        className={`py-1  ${theme}-globalbtnColor`}
                        variant="primary"
                        type="submit"
                        disabled={isSubmiting}
                      >
                        {isSubmiting ? 'UPDATING' : 'UPDATE'}
                      </Button>
                    </div>
                  </Form>
                </div>
              </Card>
            </div>
          </Col>
        </Row>
      </div>
    </Container>
  );
}

export default ProfileScreen;
