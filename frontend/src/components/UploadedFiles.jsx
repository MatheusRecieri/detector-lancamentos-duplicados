import React from 'react';
import PropTypes from 'prop-types';
import './UploadedFiles.css';

function UploadedFiles({ files }) {
  console.log(files);

  if (files.length === 0) {
    // console.log(files);

    return (
      <div className="uplodaded-files empty">
        <p>Nenhum arquivo enviado aida</p>
      </div>
    );
  } else {
    return (
      <div className="uploaded-files">
        <h3>Arquivos enviados</h3>
        <ul className="file-list">
          {files.map((file, index) => (
            <li key={index} className="file-item">
              <div className="file-info">
                <span className="filename">{file.name}</span>
                <span className="file-size">
                  {(file.size / 1024).toFixed(1)} KB
                </span>
              </div>
            </li>
          ))}
        </ul>
      </div>
    );
  }
}

UploadedFiles.propTypes = {
  files: PropTypes.arrayOf(PropTypes.object),
};

export default UploadedFiles;
