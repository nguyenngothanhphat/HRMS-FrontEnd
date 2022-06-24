import { Popover, Tag } from 'antd';
import React, { useEffect, useState } from 'react';
import { Link } from 'umi';
import DislikeIcon from '@/assets/homePage/dislike.svg';
import DislikedIcon from '@/assets/homePage/disliked.svg';
import LikeIcon from '@/assets/homePage/like.svg';
import LikedIcon from '@/assets/homePage/liked.svg';
import MenuIcon from '@/assets/homePage/menuDots.svg';
import MockAvatar from '@/assets/timeSheet/mockAvatar.jpg';
import CommentBox from '@/components/CommentBox';
import styles from './index.less';

const UserComment = ({
  id = '',
  owner = {}, // pass the employee
  comment = {},
  onEditComment = () => {},
  onRemoveComment = () => {},
  isMe = false,
  currentUser = {},
  isEdit = false,
  onEditSubmit = () => {},
  onEditCancel = () => {},
}) => {
  const { employee = {} } = currentUser;
  const [likes, setLikes] = useState([]);
  const [dislikes, setDislikes] = useState([]);
  const [dropDownVisible, setDropDownVisible] = useState(false);
  const [commentValue, setCommentValue] = useState('');

  useEffect(() => {
    if (isEdit) {
      setCommentValue(comment.content);
    }
  }, [isEdit]);

  const renderMenuDropdown = () => {
    return (
      <div className={styles.containerDropdown}>
        <div
          className={styles.btn}
          onClick={() => {
            onEditComment(id);
            setDropDownVisible(false);
          }}
        >
          <span>Edit</span>
        </div>
        <div
          className={styles.btn}
          onClick={() => {
            onRemoveComment(id);
            setDropDownVisible(false);
          }}
        >
          <span>Delete</span>
        </div>
      </div>
    );
  };

  // function
  const onLikeComment = () => {
    if (likes.includes(employee?._id)) {
      setLikes(likes.filter((x) => x !== employee?._id));
    } else {
      setLikes([...likes, employee?._id]);
      setDislikes(dislikes.filter((x) => x !== employee?._id));
    }
  };

  const onDislikeComment = () => {
    if (dislikes.includes(employee?._id)) {
      setDislikes(dislikes.filter((x) => x !== employee?._id));
    } else {
      setDislikes([...dislikes, employee?._id]);
      setLikes(likes.filter((x) => x !== employee?._id));
    }
  };

  const renderLikeBtn = () => {
    const liked = likes.includes(employee?._id);
    const disliked = dislikes.includes(employee?._id);

    return (
      <div className={styles.likes}>
        <div onClick={onLikeComment} className={liked ? styles.likes__pressed : null}>
          <img src={liked ? LikedIcon : LikeIcon} alt="" />
          <span>{likes.length}</span>
        </div>
        <div onClick={onDislikeComment} className={disliked ? styles.likes__pressed : null}>
          <img src={disliked ? DislikedIcon : DislikeIcon} alt="" />
          <span>{dislikes.length}</span>
        </div>
      </div>
    );
  };

  return (
    <div className={styles.UserComment}>
      <div className={styles.author}>
        <img src={owner?.generalInfoInfo?.avatar || MockAvatar} alt="" />
      </div>

      <div className={styles.content}>
        <div className={styles.top}>
          <div className={styles.authorName}>
            <Link to={`/directory/employee-profile/${owner?.generalInfoInfo?.userId}`}>
              {owner?.generalInfoInfo?.legalName}
            </Link>
            {isMe && <Tag color="#f50">ME</Tag>}
            <span className={styles.title}>{owner?.titleInfo?.name}</span>
          </div>
          <div className={styles.menu}>
            <Popover
              trigger="click"
              overlayClassName={styles.dropdownPopover}
              content={renderMenuDropdown()}
              visible={dropDownVisible}
              onVisibleChange={(visible) => setDropDownVisible(visible)}
              placement="bottomRight"
            >
              <img src={MenuIcon} alt="" style={{ cursor: 'pointer', padding: '4px 10px' }} />
            </Popover>
          </div>
        </div>

        {isEdit ? (
          <CommentBox
            onChange={setCommentValue}
            value={commentValue}
            onSubmit={() => onEditSubmit(commentValue)}
            onCancel={onEditCancel}
            isEdit={isEdit}
          />
        ) : (
          <p>{comment.content}</p>
        )}

        {renderLikeBtn()}
      </div>
    </div>
  );
};

export default UserComment;
