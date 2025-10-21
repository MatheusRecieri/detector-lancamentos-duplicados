const API_BASE_URL = 'http://localhost:4000/api';

export const fileService = {
  async uploadFile(file) {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(`${API_BASE_URL}/files/upload`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || 'Erro no upload do arquivo');
    }

    return await response.json();
  },

  async downloadExcel(processId) {
    const response = await fetch(
      `${API_BASE_URL}/files/export/excel/${processId}`
    );

    if (!response.ok) {
      throw new Error('Erro ao baixar arquivo Excel');
    }

    const blob = await response.blob();

    // Criar link para download
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.style.display = 'none';
    a.href = url;
    a.download = `analise-duplicatas-${processId}.xlsx`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);

    return blob;
  },
};
