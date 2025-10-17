import React, { useRef, useState } from 'react';
import PropTypes from 'prop-types';

// Componente De upload de arquivos
//useRef: acessa elementos DOM diretamente
//useState: gerenca oe stado do componente
// Event handlers: função que lidam com eventos

function FileUploader({ onUpload }) {
  //cria uma refencia para o input de arquivo
  const fileInputRef = useRef(null);

  const [isDragOver, setIsDragOver] = useState(false);

  //manipulador de arquivo

  const handlerFileChange = event => {
    const files = Array.from(event.target.files);
    if (files.length > 0) {
      onUpload(files);
    }
  };

  //manipulador de clique no botão
  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  //manipulador de drag and drop
  const handleDragOver = event => {
    event.prefentDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = event => {
    event.preventDefault();
    setIsDragOver(false);
    const files = Array.from(event.dataTransfer.files);
    onUpload(files);
  };

  return (
    <div className="file-upload">
      <h2>Upload de documentos</h2>
      <div
        className={`drop-zone ${isDragOver ? 'drag-over' : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <p>Arraste arquivos aqui ou</p>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handlerFileChange}
          multiple
          accept=".pd, .docx, .xls, xlsx, .txt"
          style={{ display: 'none' }}
        />

        <button
          type="button"
          onClick={handleButtonClick}
          className="upload-button"
        >
          Selecione os arquivos
        </button>

        <p className="file-types">
          Formatos suportados: PDF, DOCX, XLS, XLS, TXT
        </p>
      </div>
    </div>
  );
}

FileUploader.propTypes = {
  onUpload: PropTypes.func.isRequired,
};

export default FileUploader;
