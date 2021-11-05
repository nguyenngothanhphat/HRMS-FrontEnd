import React, { Component } from 'react';
import { Input, Select, Button } from 'antd';
import styles from './index.less';

const { Option } = Select;
class RightContent extends Component {
    handleChange =()=>{
            
    }

    render() {
        return (
          <div className={styles.RightContent}>
            <div className={styles.RightContent__title}>Action</div>
            <div className={styles.RightContent__content}>
              <div> 
                <p>Time taken:</p>
                <Input placeholder="Time" />
              </div>
              <div>
                <p>Status:</p>
                <Select defaultValue="In Progress" style={{ width: 100 }} onChange={this.handleChange}>
                  <Option value="New">New</Option>
                  <Option value="Assigned">Assigned</Option>
                  <Option value="Resolved">Resolved</Option>
                  <Option value="Closed">Closed</Option>
                </Select>
              </div>
                    
            </div>
            <div className={styles.RightContent__btn}>
              <Button className={styles.btnUpdate}>Update</Button>
            </div>
          </div>
        )
    }
}

export default RightContent
