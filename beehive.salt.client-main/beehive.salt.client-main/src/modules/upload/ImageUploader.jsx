import { Grid, LinearProgress, makeStyles } from '@material-ui/core';
import React, { useState, useEffect } from 'react';
import useAxios from 'axios-hooks';
import IconButton from '@material-ui/core/IconButton';
import PhotoCamera from '@material-ui/icons/PhotoCamera';
import Skeleton from '@material-ui/lab/Skeleton';
import CancelOutlinedIcon from '@material-ui/icons/CancelOutlined';
import Button from '../../Submission/Controls/Button';

const useStyles = makeStyles((theme) => ({
  imgBtn: {
    [theme.breakpoints.down('sm')]: {
      margin: theme.spacing(1, 1, 2, 1),
      width: '100%',
    },
    margin: theme.spacing(2, 2, 1, 1),
    // width: '360px',
    height: '62px',
    width: '100%',
    flexDirection: 'column',
    alignItems: 'center',
  },
}));

const FileStatus = {
  ACTIVE: 'active',
  DONE: 'done',
  WAITING: 'waiting',
};

const ImageUploader = ({ onUploadComplete }) => {
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [progress, setProgress] = useState(0);
  const [activeUploading, setActiveUploading] = useState(null);
  const classes = useStyles();

  const [{ data: uploadData }, execute] = useAxios({
    manual: true,
    onUploadProgress: (progressEvent) => {
      setProgress(Math.round((progressEvent.loaded * 100) / progressEvent.total));
    },
  });

  useEffect(() => {
    if (!uploadedFiles.length) return;
    if (activeUploading && activeUploading.progress > 0) return;

    const userFromStorage = localStorage.getItem('user');
    const user = userFromStorage ? JSON.parse(userFromStorage) : null;
    const active = uploadedFiles.find(
      (upload) => upload.status === FileStatus.ACTIVE,
    );
    if (!active) return;

    const formData = new FormData();
    formData.append('attachPhoto', active.file, active.file.name);
    execute({
      url: `${process.env.REACT_APP_API_URL}/upload/images`,
      method: 'POST',
      data: formData,
      headers: {
        Authorization: `Bearer ${user.authToken}`,
        'Content-Type': 'multipart/form-data',
        withCredentials: true,
      },
    });
  }, [uploadedFiles, activeUploading]);

  useEffect(() => {
    if (!uploadData) return;

    const indexOfCurrentActiveFile = uploadedFiles.findIndex(
      (uploadedFile) => uploadedFile.status === FileStatus.ACTIVE,
    );
    const updatedUploads = uploadedFiles.map((uploadedFile, index) => {
      if (uploadedFile.status === FileStatus.ACTIVE) {
        uploadedFile.status = FileStatus.DONE;
        uploadedFile.id = uploadData[0].id;
        uploadedFile.uploadedFileName = uploadData[0].fileName;
      } else {
        if (index === indexOfCurrentActiveFile + 1) {
          uploadedFile.status = FileStatus.ACTIVE;
        }
      }

      return uploadedFile;
    });

    const nextUpload = updatedUploads.find(
      (upload) => upload.status === FileStatus.ACTIVE,
    );
    setUploadedFiles(updatedUploads);
    setActiveUploading(nextUpload || null);
    if (!nextUpload)
      onUploadComplete(
        updatedUploads.map((upload) => {
          upload.fileName = upload.uploadedFileName;
          return upload;
        }),
      );
  }, [uploadData]);

  useEffect(() => {
    if (!activeUploading) return;
    setUploadedFiles(
      uploadedFiles.map((upload, index) => {
        if (upload.id === activeUploading.id) upload.progress = progress;

        return upload;
      }),
    );
  }, [activeUploading, progress]);

  const fileChangedHandler = (e) => {
    const files = Array.from(e.target.files).map((file, index) => {
      return {
        file,
        id: index,
        uploadedFileName: null,
        progress: 0,
        status: index === 0 ? FileStatus.ACTIVE : FileStatus.WAITING,
      };
    });

    setActiveUploading(files[0]);
    setUploadedFiles(files);
  };

  return (
    <div>
      <label htmlFor="upload">
        <Grid item xs={12} sm={12} md={12}>
          <Button
            className={classes.imgBtn}
            fullWidth
            variant="outlined"
            color="asa"
            component="span"
            text="Загрузите свой файл"
            startIcon={<PhotoCamera fontSize="medium" />}
          >
            {/* <PhotoCamera /> */}
          </Button>
        </Grid>
      </label>
      <input
        style={{ display: 'none' }}
        name="attachPhoto"
        id="upload"
        type="file"
        accept="image/!*"
        multiple={true}
        capture="filesystem"
        onChange={fileChangedHandler}
      />

      <div style={{ display: 'flex' }}>
        {uploadedFiles.map((file, index) => {
          return (
            <div style={{ marginLeft: '2rem', marginTop: '2 rem' }} key={index}>
              <div>
                {' '}
                {file.uploadedFileName ? (
                  <div>
                    {/* <img
                      alt="image_download"
                      style={{ height: '200px' }}
                      src={`${process.env.REACT_APP_UPLOAD_IMAGE_URL}/${file.uploadedFileName}`}
                      startIcon={<CancelOutlinedIcon fontSize="small" />}
                    />
                    <h4>sdfsdf</h4> */}
                  </div>
                ) : (
                  <Skeleton
                    variant="rect"
                    width={100}
                    height={100}
                    animation="wave"
                  />
                )}{' '}
              </div>

              {file.progress > 0 ? (
                <LinearProgress variant="determinate" value={file.progress} />
              ) : null}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ImageUploader;
