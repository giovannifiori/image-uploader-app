import React from "react";
import classNames from "classnames";
import ProgressBar from "react-circular-progressbar";
import styles from "./Image.module.css";
import { MdDelete, MdCheckCircle, MdError } from "react-icons/md";

const Image = props => (
  <div
    className={classNames(
      styles.image,
      props.uploaded ? styles.imageUploaded : null,
      props.error ? styles.imageError : null
    )}
  >
    <a target="_blank" rel="noopener noreferrer" href={props.url}>
      <div
        className={styles.photo}
        style={{ backgroundImage: `url(${props.preview || props.url})` }}
      />
    </a>
    <div className={styles.footer}>
      <div className={styles.imageInfo}>
        <span>{props.name}&nbsp;</span>
        <span>{props.size}</span>
      </div>
      <div className={styles.imageActions}>
        {!props.uploaded && !props.error && (
          <ProgressBar
            styles={{
              root: { width: 20 },
              path: { stroke: "#7159c1" }
            }}
            strokeWidth={10}
            percentage={props.progress}
          />
        )}
        {props.uploaded && <MdCheckCircle size={24} color="lightgreen" />}
        {props.error && <MdError size={24} color="#e57878" />}
        {props.uploaded && !!props.url && (
          <button onClick={() => props.onDelete(props.id)}>
            <MdDelete size={24} color="#e57878" />
          </button>
        )}
      </div>
    </div>
  </div>
);

export default Image;
