import React from 'react';
import PropTypes from 'prop-types';

function UploadedFiles({ files }) {
  console.log(files);

  if (files.length === 0) {
    return (
      <div className="mt-6 text-center bg-white/10 backdrop-blur-md rounded-2xl p-6 text-white/80">
        <p className="text-lg">Nenhum arquivo enviado ainda</p>
      </div>
    );
  }

  return (
    <div className="mt-8 bg-white/10 backdrop-blur-md rounded-2xl p-6 shadow-lg border border-white/20">
      <h3 className="text-2xl font-semibold text-white mb-4 text-center">
        Arquivos Enviados
      </h3>
      <ul className="space-y-3">
        {files.map((file, i) => (
          <li
            key={i}
            className="flex justify-between items-center bg-white/20 border border-white/30 rounded-xl p-4 hover:bg-[#f28c28]/10 transition"
          >
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-[#f28c28]/20 rounded-lg flex items-center justify-center">
                <span className="text-[#f28c28] font-bold text-sm">
                  {file.name.split('.').pop()?.toUpperCase()}
                </span>
              </div>
              <span className="font-medium text-white">{file.name}</span>
            </div>
            <span className="text-sm text-white/70">
              {(file.size / 1024).toFixed(1)} KB
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

UploadedFiles.propTypes = {
  files: PropTypes.arrayOf(PropTypes.object),
};

export default UploadedFiles;
