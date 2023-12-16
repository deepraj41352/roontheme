import React, { useContext } from 'react';
import { Col, Row } from 'react-bootstrap';
import { Store } from '../Store';
import WidgetsDropdown from '../widgets/widgets/WidgetsDropdown';
import WidgetsDropdown2 from '../widgets/widgets/WidgetsDropdown2';

export default function Dashboard() {
  const { state } = useContext(Store);
  const { userInfo } = state;

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
