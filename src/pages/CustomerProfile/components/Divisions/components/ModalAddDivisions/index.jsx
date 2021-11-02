import { Col, Form, Modal, Row, Input, Select, Button, Popover, Checkbox } from 'antd';
import React, { PureComponent } from 'react';
import { connect } from 'umi';
import styles from './index.less';
import iconNote from '../../../../../../assets/icon-note.svg';

@connect(({ loading, customerProfile: { divisionId = '' } = {} }) => ({
  loadingId: loading.effects['customerProfile/generateDivisionId'],
  divisionId,
}))
class ModalAddDivisions extends PureComponent {
  componentDidMount() {
    const { dispatch, reId } = this.props;
    dispatch({
      type: 'customerProfile/generateDivisionId',
      payload: {
        id: reId,
      },
    });
  }

  render() {
    const {
      isShown,
      onCloseModal = () => {},
      onSubmit,
      listTags = [],
      info: { accountOwner: { generalInfo: { legalName } = {} } = {} } = {},
      divisionId,
      isCountrySelected,
      handelSelectCountry,
      country,
      state,
      loadingId,
    } = this.props;
    return (
      <div className={styles.modalAdd}>
        <Modal
          className={styles.modalAdd}
          title="Add Division"
          footer={[
            <div className={styles.btnForm}>
              <Button className={styles.btnCancel} onClick={onCloseModal}>
                Cancel
              </Button>
              <Button
                className={styles.btnAdd}
                form="formAdd"
                key="submit"
                htmlType="submit"
                // onClick={(values) => handleAddNew(values)}
              >
                Add Division
              </Button>
            </div>,
          ]}
          onCancel={onCloseModal}
          visible={isShown}
        >
          <Form
            name="formAdd"
            layout="vertical"
            initialValues={{ accountOwner: legalName, divisionId }}
            onFinish={(values) => onSubmit(values)}
          >
            {/* Basic Customer Detail */}
            <div className={styles.basicInfoForm}>
              <div className={styles.basicInfoTitle}>
                <p>Basic Division Detail</p>
              </div>
              <Row gutter={48}>
                <Col span={12}>
                  <Form.Item
                    // loading={loadingId}
                    label={
                      <p style={{ marginBottom: '0' }}>
                        Division ID
                        <Popover
                          className={styles.popover}
                          style={{}}
                          placement="right"
                          content={() => (
                            <p style={{ marginBottom: '0' }}>Generate automatically</p>
                          )}
                        >
                          <img className={styles.popopverImg} src={iconNote} alt="note" />
                        </Popover>
                      </p>
                    }
                    name="divisionId"
                  >
                    <Input placeholder="Enter Division ID" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="Division Name" name="divisionName">
                    <Input placeholder="Enter Division Name" />
                  </Form.Item>
                </Col>
              </Row>
            </div>

            {/* Contact Detail */}
            <div className={styles.contactDetail}>
              <div className={styles.contactDetailTitle}>
                <p>Contact Detail</p>
              </div>
              <Row gutter={48}>
                <Col span={12}>
                  <Form.Item label="Primary POC Name" name="primaryPOCName">
                    <Input placeholder="Enter Primary POC Name" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="Primary POC Ph No." name="primaryPOCPhNo">
                    <Input placeholder="Enter Primary POC Ph No." />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={48}>
                <Col span={12}>
                  <Form.Item label="Primary POC Email ID" name="primaryPOCEmail">
                    <Input placeholder="Enter Primary POC Email ID" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="Primary POC Designation" name="primaryPOCDesignation">
                    <Input placeholder="Enter Primary POC Designation" />
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={48}>
                <Col span={12}>
                  <Form.Item label="Secondary POC Name" name="secondaryPOCName">
                    <Input placeholder="Enter Secondary POC Name" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="Secondary POC Ph No." name="secondaryPOCPhNo">
                    <Input placeholder="Enter Secondary POC Ph No." />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={48}>
                <Col span={12}>
                  <Form.Item label="Secondary POC Email ID" name="secondaryPOCEmail">
                    <Input placeholder="Enter Secondary POC Email ID" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="Secondary POC Designation" name="secondaryPOCDesignation">
                    <Input placeholder="Enter Secondary POC Designation" />
                  </Form.Item>
                </Col>
              </Row>

              <Form.Item name="sameAsHQ">
                <Checkbox>Same address as HQ</Checkbox>
              </Form.Item>

              <Form.Item label="Address Line 1" name="addressLine1">
                <Input placeholder="Enter Address Line 1" />
              </Form.Item>
              <Form.Item label="Address Line 2" name="addressLine2">
                <Input placeholder="Enter Address Line 2" />
              </Form.Item>
              <Row gutter={48}>
                <Col span={12}>
                  <Form.Item label="Country" name="country">
                    <Select
                      placeholder="Select Country"
                      onChange={(value) => handelSelectCountry(value)}
                    >
                      {country.map((item) => {
                        return (
                          <Select.Option value={item._id} key={item.name}>
                            {item.name}
                          </Select.Option>
                        );
                      })}
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="State" name="state">
                    <Select disabled={isCountrySelected} placeholder="Select State">
                      {state.map((stateItem) => {
                        return <Select.Option key={stateItem}>{stateItem}</Select.Option>;
                      })}
                    </Select>
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={48}>
                <Col span={12}>
                  <Form.Item label="City" name="city">
                    <Input placeholder="Enter City name" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="Zip/Postal Code" name="zipCode">
                    <Input placeholder="Enter Postal Code" />
                  </Form.Item>
                </Col>
              </Row>
            </div>

            {/* Other Detail */}
            <div className={styles.otherDetail}>
              <div className={styles.otherDetailTitle}>
                <p>Other Details</p>
              </div>
              <Row gutter={48}>
                <Col span={12}>
                  <Form.Item label="Account Owner" name="accountOwner">
                    <Input placeholder="Enter Account Owner" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="Tags (Optional)" name="tags">
                    <Select mode="multiple" placeholder="Enter tags">
                      {listTags.map((item) => {
                        return <Select.Option key={item.id}>{item.tag_name}</Select.Option>;
                      })}
                    </Select>
                  </Form.Item>
                </Col>
              </Row>
            </div>
          </Form>
        </Modal>
      </div>
    );
  }
}

export default ModalAddDivisions;
