import React, { PureComponent, useState, Component } from 'react';
import { Table, Row, Col, Button, Modal, Form, Input, Select, DatePicker, Tooltip, Card} from 'antd';
const { TextArea } = Input;
const {Option} = Select;
import moment from 'moment';
import { InfoCircleOutlined } from '@ant-design/icons';
import addAction from '@/assets/resource-action-add1.svg';
import historyIcon from '@/assets/resource-management-edit1.svg';
import datePickerIcon from '@/assets/resource-management-datepicker.svg'
import empty from '@/assets/timeOffTableEmptyIcon.svg';
import styles from './index.less';

class AddActionBTN extends Component {
    constructor(props) {
      super(props);
      this.state = {
        visible: false
      };
    }
    
    showModal = () => {
        this.setState({
           visible: true,
        });
    }
    handleOk = () => {
        this.setState({
            visible: false,
        });
    }

    handleCancel = () => {
        this.setState({
           visible: false,
        });
    }
        
    render () {
        const row = this.props.dataPassRow
        return (
            <div>
                <img src={addAction} alt="attachIcon" onClick={() => this.showModal()} className={styles.buttonAdd}/>       
                <Modal className={styles.modalAdd}
                title="Assign to project"
                width="60%"
                visible={this.state.visible}
                onOk={() => this.handleOk()}
                onCancel={() => this.handleCancel()}
                okText='Assign to project'
                cancelButtonProps={{ style: { color: 'red', border: '1px solid white' } }}
                okButtonProps={{style: {background: '#FFA100', border: '1px solid #FFA100', color: 'white', borderRadius: '25px'}}}
                >
                <Form layout='vertical' className={styles.formAdd}>
                <Row>
                    <Col span={12}>
                    <Form.Item label='Project' name="project">  
                        <Select defaultValue={row.projectName} style={{ width: '95%', borderRadius: '2px' }}>
                        <Option value="jack">project 0</Option>
                        <Option value="lucy">project 1</Option>
                        <Option value="Yiminghe">project 2</Option>
                        </Select>
                    </Form.Item>
                    <Form.Item label='Status'>
                        <Select defaultValue={row.billStatus} style={{ width: '95%', borderRadius: '2px' }}>
                        <Option value="jack">billStatus</Option>
                        <Option value="lucy">billStatus 1</Option>
                        <Option value="Yiminghe">billStatus 2</Option>
                        </Select>
                    </Form.Item>
                    <Form.Item label='Bandwith Allocation (%)'>
                    <Input placeholder="100" style={{width: '95%'}} addonAfter='%'/>
                    </Form.Item>
                    </Col>
                    <Col span={12}>
                    <Form.Item label='Start Date'>
                        <DatePicker placeholder='Enter Start Date' 
                        style={{width: '95%', borderRadius: '2px', color: 'blue'}}
                        suffixIcon={<img src={datePickerIcon}/>}/>
                    </Form.Item>
                    <Form.Item label='End Date'>
                        <DatePicker placeholder='Enter End Date'
                        style={{width: '95%', borderRadius: '2px', color: 'blue'}}
                        suffixIcon={<img src={datePickerIcon}/>}/>
                    </Form.Item>
                    <Form.Item label='Reserved End Date'>
                        <DatePicker placeholder='Enter Date'
                        style={{width: '95%', borderRadius: '2px', color: 'blue', background: '#F4F6F7'}}
                        suffixIcon={<img src={datePickerIcon}/>}/>
                    </Form.Item>
                    </Col>
                </Row>    
                <Form.Item label='Comments (optional)'>
                    <TextArea placeholder="Enter Comments"
                    autoSize={{ minRows: 4, maxRows: 8 }}
                    />
                </Form.Item>  
                <p style={{color: 'lightgray'}}>*Tentative End Date</p>
                <Form.Item label='Project Detail'>
                <Card style={{background: '#F6F7F9'}}>
                    <Row>
                    <Col span={12}>
                        <p>Customer: <span style={{color: '#2C6DF9'}}> {row.employeeName}</span></p> 
                        <p>Project: <span style={{color: '#2C6DF9'}}> {row.projectName}</span></p> 
                        <p>Engagement Type: <span style={{color: '#2C6DF9'}}> {row.billStatus}</span></p> 
                        <p>Start Date: <span style={{color: '#2C6DF9'}}> {row.startDate}</span></p> 
                        <p>End Date: <span style={{color: '#2C6DF9'}}> {row.endDate}</span></p>  
                    </Col>
                    <Col span={12}>
                        <Row>
                        <Col span={12}>
                            Current resource allocation :
                        </Col>
                        <Col span={12}>
                            <p>2/3 UX Designers (Billable)</p>
                            <p>1/2 UI Designer (Billable)</p>
                        </Col>
                        </Row>
                    </Col>
                    </Row>
                </Card>
                </Form.Item>
                </Form>
                </Modal> 
            </div>
        )
    }
}

export default AddActionBTN