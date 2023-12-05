import React, { useContext, useEffect, useState } from 'react';
import { Card, Col, Row } from 'react-bootstrap';
import { MdQueue, MdTask } from 'react-icons/md';
import { GrCompliance } from 'react-icons/gr';
import { HiUserGroup } from 'react-icons/hi';
import data from '../dummyData';
import Chart from 'react-google-charts';
import { Store } from '../Store';
import WidgetsDropdown from '../widgets/widgets/WidgetsDropdown';
import WidgetsDropdown2 from '../widgets/widgets/WidgetsDropdown2';

import axios from 'axios';

export default function AdminDashboard() {
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { toggleState, userInfo } = state;
  const theme = toggleState ? 'dark' : 'light';

  return userInfo.role == 'superadmin' || userInfo.role == 'admin' ? (
    <>
      <div className="mt-3">
        <Row className="px-2 gap-3">
          <Col className=" p-0 ">
            <WidgetsDropdown />
          </Col>
        </Row>
      </div>
    </>
  ) : (
    <>
      <Row>
        <Col className=" p-0 ">
          <WidgetsDropdown2 />
        </Col>
      </Row>
    </>
  );
}
