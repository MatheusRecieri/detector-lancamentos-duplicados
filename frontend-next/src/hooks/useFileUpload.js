import { useState } from 'react';
import { fileService } from '@/services/api';

export const useFileUpload = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);

  const uploadFile = async file => {
    setLoading(true);
    setError(null);

    try {
      console.log('Enviando arquivo:', file.name);
      const data = await fileService.uploadFile(file);
      setResults(data);
      return data;
    } catch (err) {
      console.error('Erro no upload:', err);
      setError(err.message);
      throw err;
    } finally {
      setUploading(false);
    }
  };

  const downloadExcel = async processId => {
    try {
      const blob = await fileService.downloadExcel(processId);

      // Criar link para download
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = `analise-lancamentos-${processId}.xlsx`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      return true;
    } catch (err) {
      console.error('Erro no download:', err);
      throw err;
    }
  };

  const reset = () => {
    setLoading(false);
    setError(null);
    setResult(null);
  };

  return {
    uploadFile,
    loading,
    error,
    result,
    reset,
  };
};
