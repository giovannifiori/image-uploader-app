import React, { Component } from "react";
import Dropzone from "react-dropzone";
import classNames from "classnames";
import styles from "./Upload.module.css";

export default class Upload extends Component {
  render() {
    return (
      <Dropzone
        accept={["image/jpeg", "image/png", "image/gif", "image/pjpeg"]}
        onDropAccepted={this.props.onDrop}
      >
        {({ getRootProps, getInputProps, isDragAccept, isDragReject }) => {
          return (
            <div
              {...getRootProps()}
              className={classNames(
                styles.dropzone,
                isDragAccept ? styles.activeDropzone : null,
                isDragReject ? styles.rejectDropzone : null
              )}
            >
              <input {...getInputProps()} />
              {isDragAccept ? (
                <p>Drop your files here</p>
              ) : isDragReject ? (
                <p>File type not supported</p>
              ) : (
                <p>
                  Try dropping some files here, or click to select files to
                  upload.
                </p>
              )}
            </div>
          );
        }}
      </Dropzone>
    );
  }
}
