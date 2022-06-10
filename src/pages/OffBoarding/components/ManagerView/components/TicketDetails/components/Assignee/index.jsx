import { Card, Col, Row } from 'antd';
import React from 'react';
import CustomEmployeeTag from '@/components/CustomEmployeeTag';
import CustomPrimaryButton from '@/components/CustomPrimaryButton';
import { getEmployeeName } from '@/utils/offboarding';
import styles from './index.less';

const Assignee = (props) => {
  const { item: { assigneeHR = {}, manager = {} } = {} } = props;

  const renderContent = () => {
    const assignees = [
      {
        label: 'HR approval',
        members: [
          {
            type: 'Primary',
            name: getEmployeeName(assigneeHR?.generalInfo),
            title: assigneeHR?.title?.name,
            userId: assigneeHR?.generalInfo?.userId,
          },
        ],
      },
      {
        label: 'Manager approval',
        members: [
          {
            type: 'Secondary',
            name: getEmployeeName(manager?.generalInfo),
            title: manager?.title?.name,
            userId: manager?.generalInfo?.userId,
          },
        ],
      },
    ];

    return (
      <div className={styles.container}>
        {assignees.map((x) => {
          return (
            <div className={styles.block}>
              <p className={styles.block__title}>{x.label}</p>
              <div className={styles.block__members}>
                <Row align="middle">
                  {x.members.map((y) => (
                    <>
                      <Col span={19}>
                        <CustomEmployeeTag
                          name={y.name}
                          title={y.title}
                          avatar={y.avatar}
                          userId={y.userId}
                        />
                      </Col>
                      <Col span={5}>
                        <span className={styles.type}>{y.type}</span>
                      </Col>
                    </>
                  ))}
                </Row>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  const renderButtons = () => {
    return (
      <div className={styles.actions}>
        <p>
          In case of your unavailability, you may assign this request to someone from the superior
          officers.
        </p>
        <CustomPrimaryButton title="Delegate this request" />
      </div>
    );
  };

  return (
    <Card title="This request is assigned to:" className={styles.Assignee}>
      {renderContent()}
      {renderButtons()}
    </Card>
  );
};

export default Assignee;
