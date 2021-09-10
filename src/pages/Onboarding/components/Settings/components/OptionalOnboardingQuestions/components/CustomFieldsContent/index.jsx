import React, { Component } from 'react';
import { connect, formatMessage } from 'umi';
import { Button } from 'antd';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import FieldName from '../FieldName';

import styles from './index.less';

@connect(({ onboard: { settings: { optionalOnboardQuestions } = {} } = {} }) => ({
  optionalOnboardQuestions,
}))
class CustomFieldsContent extends Component {
  reorder = (list, startIndex, endIndex) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);

    return result;
  };

  onDragEnd = (result) => {
    const { optionalOnboardQuestions, dispatch } = this.props;
    const { nameList = [] } = optionalOnboardQuestions;
    // const { nameList } = this.state;

    if (!result.destination) {
      return;
    }

    const items = this.reorder(nameList, result.source.index, result.destination.index);
    dispatch({
      type: 'onboard/saveOrderNameField',
      payload: {
        nameList: items,
      },
    });
  };

  getItemStyle = (isDragging, draggableStyle) => ({
    userSelect: 'none',
    padding: 0,

    ...draggableStyle,
  });

  getListStyle = () => ({
    padding: 0,
  });

  onNextModal = () => {
    const { onNextModal = {} } = this.props;
    onNextModal();
  };

  render() {
    // const { nameList } = this.state;
    const { optionalOnboardQuestions } = this.props;
    const { nameList = [] } = optionalOnboardQuestions;
    return (
      <div className={styles.CustomFieldsContent}>
        <div className={styles.CustomFieldsContent_header}>
          <div className={styles.CustomFieldsContent_header_title}>
            {' '}
            {formatMessage({ id: 'component.optionalOnboardingQuestions.customFields' })}
          </div>
          <div className={styles.CustomFieldsContent_header_buttons}>
            <Button type="secondary">
              {' '}
              {formatMessage({ id: 'component.optionalOnboardingQuestions.newSection' })}
            </Button>
            <Button type="secondary">
              {' '}
              {formatMessage({ id: 'component.optionalOnboardingQuestions.newField' })}
            </Button>
          </div>
        </div>
        <hr />
        <div className={styles.CustomFieldsContent_form}>
          <div className={styles.CustomFieldsContent_form_section}>
            <div className={styles.subTitle}>
              {' '}
              {formatMessage({ id: 'component.optionalOnboardingQuestions.sectionName' })}
            </div>
          </div>

          <div className={styles.CustomFieldsContent_form_name}>
            <div className={styles.subTitle}>
              {' '}
              {formatMessage({ id: 'component.optionalOnboardingQuestions.fieldName' })}
            </div>
            <div className={styles.list}>
              <DragDropContext onDragEnd={this.onDragEnd}>
                <Droppable droppableId="droppable">
                  {(provided) => (
                    <div
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                      style={this.getListStyle()}
                    >
                      {nameList.map((item, index) => (
                        <Draggable key={item.id} draggableId={item.id} index={index}>
                          {(newProvided, newSnapshot) => (
                            <div
                              ref={newProvided.innerRef}
                              {...newProvided.draggableProps}
                              {...newProvided.dragHandleProps}
                              style={this.getItemStyle(
                                newSnapshot.isDragging,
                                newProvided.draggableProps.style,
                              )}
                            >
                              <FieldName fieldName={item} />
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </DragDropContext>
            </div>
          </div>
        </div>
        <div className={styles.saveButton}>
          <Button type="primary" onClick={this.onNextModal}>
            {formatMessage({ id: 'component.optionalOnboardingQuestions.saveOrdering' })}
          </Button>
        </div>
      </div>
    );
  }
}

export default CustomFieldsContent;
