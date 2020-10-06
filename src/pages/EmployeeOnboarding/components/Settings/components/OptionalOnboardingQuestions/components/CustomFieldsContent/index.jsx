import React, { Component } from 'react';
import { Button } from 'antd';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import FieldName from '../FieldName';

import styles from './index.less';

class CustomFieldsContent extends Component {
  constructor(props) {
    super(props);

    this.state = {
      nameList: [
        { id: '0', name: 'Is this a person special part-time (SPT)' },
        { id: '1', name: 'Alternative address' },
        { id: '2', name: 'Alternative address' },
      ],
    };
  }

  reorder = (list, startIndex, endIndex) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);

    return result;
  };

  onDragEnd = (result) => {
    const { nameList } = this.state;
    // dropped outside the list
    console.log(result);
    if (!result.destination) {
      return;
    }

    const items = this.reorder(nameList, result.source.index, result.destination.index);

    this.setState({
      nameList: items,
    });
  };

  getItemStyle = (isDragging, draggableStyle) => ({
    userSelect: 'none',
    padding: 0,

    ...draggableStyle,
  });

  getListStyle = (isDraggingOver) => ({
    padding: 0,
  });

  render() {
    const { nameList } = this.state;

    return (
      <div className={styles.CustomFieldsContent}>
        <div className={styles.CustomFieldsContent_header}>
          <div className={styles.CustomFieldsContent_header_title}>Custom fields</div>
          <div className={styles.CustomFieldsContent_header_buttons}>
            <Button>+ New Section</Button>
            <Button>+ New Field</Button>
          </div>
        </div>
        <hr />
        <div className={styles.CustomFieldsContent_form}>
          <div className={styles.CustomFieldsContent_form_section}>
            <div className={styles.subTitle}>Section name</div>
          </div>

          <div className={styles.CustomFieldsContent_form_name}>
            <div className={styles.subTitle}>Field name</div>
            <div className={styles.list}>
              <DragDropContext onDragEnd={this.onDragEnd}>
                <Droppable droppableId="droppable">
                  {(provided, snapshot) => (
                    <div
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                      style={this.getListStyle(snapshot.isDraggingOver)}
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
      </div>
    );
  }
}

export default CustomFieldsContent;
