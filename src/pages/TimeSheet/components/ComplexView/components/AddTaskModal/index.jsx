import {
  Alert,
  Checkbox,
  Button,
  Col,
  DatePicker,
  Form,
  Input,
  Modal,
  Row,
  Select,
  TimePicker,
} from 'antd';
import React from 'react';
import { connect } from 'umi';
import AddIcon from '@/assets/timeSheet/add.svg';
import styles from './index.less';

const { Option } = Select;
const dateFormat = 'MM/DD/YYYY';
const hourFormat = 'HH:mm a';

const AddTaskModal = (props) => {
  const formRef = React.createRef();
  const {
    visible = false,
    title = 'Add Task',
    onClose = () => {},
    date = '',
    mode = 'single',
  } = props;
  const { dispatch } = props;

  const renderModalHeader = () => {
    return (
      <div className={styles.header}>
        <p className={styles.header__text}>{title}</p>
      </div>
    );
  };

  const handleCancel = () => {
    onClose();
  };

  const handleFinish = () => {
    // finish
  };

  // useEffect(() => {
  //   formRef.setFieldsValue({
  //     tasks: {},
  //   });
  // }, []);

  const renderFormList = () => {
    return (
      <Form.List name="tasks">
        {(fields, { add, remove }) => (
          <>
            {fields.map(({ key, name, fieldKey }) => (
              <>
                {key !== 0 && <div className={styles.divider} />}
                <Row gutter={[24, 0]} className={styles.belowPart}>
                  <Col xs={24} md={12}>
                    <Form.Item
                      label="Project*"
                      labelCol={{ span: 24 }}
                      rules={[{ required: true, message: 'Select a project' }]}
                      name={[name, 'project']}
                      fieldKey={[fieldKey, 'project']}
                    >
                      <Select showSearch placeholder="Select a project">
                        {['A', 'B', 'C'].map((val) => (
                          <Option value={val}>{val}</Option>
                        ))}
                      </Select>
                    </Form.Item>
                  </Col>
                  <Col xs={24} md={12}>
                    <Form.Item
                      label="Task*"
                      labelCol={{ span: 24 }}
                      rules={[{ required: true, message: 'Select a task' }]}
                      name={[name, 'task']}
                      fieldKey={[fieldKey, 'task']}
                    >
                      <Select showSearch placeholder="Select a task">
                        {[].map((val) => (
                          <Option value={val}>{val}</Option>
                        ))}
                      </Select>
                    </Form.Item>
                  </Col>

                  <Col xs={24} md={12}>
                    <Form.Item
                      label="Start time*"
                      labelCol={{ span: 24 }}
                      rules={[{ required: true, message: 'Select start time' }]}
                      name={[name, 'startTime']}
                      fieldKey={[fieldKey, 'startTime']}
                    >
                      <TimePicker format={hourFormat} placeholder="Select start time" />
                    </Form.Item>
                  </Col>

                  <Col xs={24} md={12}>
                    <Form.Item
                      label="End time*"
                      labelCol={{ span: 24 }}
                      rules={[{ required: true, message: 'Select end time' }]}
                      name={[name, 'endTime']}
                      fieldKey={[fieldKey, 'endTime']}
                    >
                      <TimePicker format={hourFormat} placeholder="Select end time" />
                    </Form.Item>
                  </Col>

                  <Col xs={24}>
                    <Form.Item
                      label="Description*"
                      labelCol={{ span: 24 }}
                      rules={[{ required: true, message: 'Please enter Description' }]}
                      name={[name, 'description']}
                      fieldKey={[fieldKey, 'description']}
                    >
                      <Input.TextArea autoSize={{ minRows: 3 }} />
                    </Form.Item>
                  </Col>
                  <Col xs={24}>
                    <Form.Item
                      labelCol={{ span: 24 }}
                      name={[name, 'isClientLocation']}
                      fieldKey={[fieldKey, 'isClientLocation']}
                      valuePropName="checked"
                    >
                      <Checkbox>Client Location</Checkbox>
                    </Form.Item>
                  </Col>
                </Row>
              </>
            ))}
            {mode === 'multiple' && (
              <div className={styles.addButton} onClick={() => add()}>
                <img src={AddIcon} alt="" />
                <span>Add another task</span>
              </div>
            )}
          </>
        )}
      </Form.List>
    );
  };

  const renderModalContent = () => {
    return (
      <div className={styles.content}>
        <Form
          name="basic"
          ref={formRef}
          id="myForm"
          onFinish={handleFinish}
          initialValues={{
            tasks: [''],
            date,
          }}
        >
          <Row gutter={[24, 0]} className={styles.abovePart}>
            <Col xs={24} md={12}>
              <Form.Item
                rules={[{ required: true, message: 'Please select Timesheet Period' }]}
                label="Select Timesheet Period"
                name="date"
                fieldKey="date"
                labelCol={{ span: 24 }}
              >
                <DatePicker format={dateFormat} />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Alert
                message="Info"
                showIcon
                type="info"
                description="The same tasks will be updated for the selected date range"
                closable
              />
            </Col>
          </Row>
          {renderFormList()}
        </Form>
      </div>
    );
  };

  return (
    <>
      <Modal
        className={`${styles.AddTaskModal} ${styles.noPadding}`}
        onCancel={handleCancel}
        destroyOnClose
        width={650}
        footer={
          <>
            <Button className={styles.btnCancel} onClick={handleCancel}>
              Cancel
            </Button>
            <Button
              className={styles.btnSubmit}
              type="primary"
              form="myForm"
              key="submit"
              htmlType="submit"
            >
              Submit
            </Button>
          </>
        }
        title={renderModalHeader()}
        centered
        visible={visible}
      >
        {renderModalContent()}
      </Modal>
    </>
  );
};

export default connect(() => ({}))(AddTaskModal);
