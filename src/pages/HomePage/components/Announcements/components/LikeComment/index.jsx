import { Col, Collapse, Row, Spin } from 'antd';
import React, { useState } from 'react';
import { connect } from 'umi';
import CommentIcon from '@/assets/homePage/comment.svg';
import DislikeIcon from '@/assets/homePage/dislike.svg';
import DislikedIcon from '@/assets/homePage/disliked.svg';
import LikeIcon from '@/assets/homePage/like.svg';
import LikedIcon from '@/assets/homePage/liked.svg';
import CommentBox from '@/components/CommentBox';
import UserComment from '@/components/UserComment';
import styles from './index.less';

const { Panel } = Collapse;
const ACTION = {
  ADD: 'ADD',
  EDIT: 'EDIT',
};
const LikeComment = ({ user: { currentUser: { employee = {} } = {} } = {} }) => {
  const [activeKey, setActiveKey] = useState('');
  const [commentValue, setCommentValue] = useState('');
  const [likes, setLikes] = useState([]);
  const [dislikes, setDislikes] = useState([]);
  const [action, setAction] = useState(ACTION.ADD);
  const [handlingId, setHandlingId] = useState('');

  const [comments, setComments] = useState([
    {
      id: 1,
      owner: {
        _id: employee?._id,
        generalInfoInfo: {
          legalName: employee?.generalInfo?.legalName,
        },
        titleInfo: {
          name: employee?.title?.name,
        },
      },
      comment: {
        content:
          'Great opportunity, consectetur adipiscing elit. Sollicitudin quis mauris elementum dictum malesuada lorem pellentesque iaculis morbi.',
      },
    },
  ]);

  // function
  const onLikePost = () => {
    if (likes.includes(employee?._id)) {
      setLikes(likes.filter((id) => id !== employee?._id));
    } else {
      setLikes([...likes, employee?._id]);
      setDislikes(dislikes.filter((id) => id !== employee?._id));
    }
  };

  const onDislikePost = () => {
    if (dislikes.includes(employee?._id)) {
      setDislikes(dislikes.filter((id) => id !== employee?._id));
    } else {
      setDislikes([...dislikes, employee?._id]);
      setLikes(likes.filter((id) => id !== employee?._id));
    }
  };

  const onComment = () => {
    if (!commentValue) return;
    const newComment = {
      id: comments.length + 1,
      owner: {
        _id: employee?._id,
        generalInfoInfo: {
          legalName: employee?.generalInfo?.legalName,
        },
        titleInfo: {
          name: employee?.title?.name,
        },
      },
      comment: {
        content: commentValue,
      },
    };
    setCommentValue('');
    setComments([newComment, ...comments]);
  };

  const onEdit = (value) => {
    if (!value) return;
    const temp = comments.map((comment) => {
      if (comment.id === handlingId) {
        return {
          ...comment,
          comment: {
            ...comment.comment,
            content: value,
          },
        };
      }
      return comment;
    });
    setComments(temp);
    setAction(ACTION.ADD);
    setHandlingId('');
    setCommentValue('');
  };

  const onEditCancel = () => {
    setAction(ACTION.ADD);
    setHandlingId('');
    setCommentValue('');
  };

  const onEditComment = (id) => {
    setAction(ACTION.EDIT);
    setHandlingId(id);
    setCommentValue(comments.find((comment) => comment.id === id)?.comment?.content);
  };

  const onRemoveComment = (id) => {
    setComments(comments.filter((comment) => comment.id !== id));
  };

  // render UI
  const renderCommentIcon = (isActive) => {
    return (
      <div
        className={styles.comments}
        onClick={() => {
          setActiveKey(!isActive ? '1' : '');
        }}
      >
        <div>
          <img src={CommentIcon} alt="" />
          <span>{comments.length} Comments</span>
        </div>
      </div>
    );
  };

  const renderLikeBtn = () => {
    const liked = likes.includes(employee?._id);
    const disliked = dislikes.includes(employee?._id);

    return (
      <div className={styles.likes}>
        <div onClick={onLikePost} className={liked ? styles.likes__pressed : null}>
          <img src={liked ? LikedIcon : LikeIcon} alt="" />
          <span>{likes.length}</span>
        </div>
        <div onClick={onDislikePost} className={disliked ? styles.likes__pressed : null}>
          <img src={disliked ? DislikedIcon : DislikeIcon} alt="" />
          <span>{dislikes.length}</span>
        </div>
      </div>
    );
  };

  return (
    <div className={styles.LikeComment}>
      <Collapse
        activeKey={activeKey}
        expandIconPosition="right"
        expandIcon={({ isActive }) => renderCommentIcon(isActive)}
        ghost
        destroyInactivePanel
        bordered={false}
      >
        <Panel header={renderLikeBtn()} key="1">
          <CommentBox
            onChange={action === ACTION.ADD ? setCommentValue : () => {}}
            value={action === ACTION.ADD ? commentValue : null}
            onSubmit={onComment}
            disabled={action === ACTION.EDIT}
          />
          <Row className={styles.commentContainer} gutter={[24, 16]}>
            {comments.length === 0 && (
              <Col span={24}>
                <div className={styles.noComment}>
                  <span>No comment</span>
                </div>
              </Col>
            )}
            {comments.map((x) => (
              <Col span={24} key={x.id}>
                {/* <Spin spinning={handlingId === x.id}> */}
                <UserComment
                  id={x.id}
                  comment={x.comment}
                  owner={x.owner}
                  onEditComment={onEditComment}
                  onRemoveComment={onRemoveComment}
                  isMe={employee?._id === x.owner?._id}
                  isEdit={action === ACTION.EDIT && handlingId === x.id}
                  onEditSubmit={onEdit}
                  onEditCancel={onEditCancel}
                />
                {/* </Spin> */}
              </Col>
            ))}
          </Row>
        </Panel>
      </Collapse>
    </div>
  );
};

export default connect(({ user }) => ({ user }))(LikeComment);
