function mostrarPopupEnvio() {
  document.getElementById("popupEnvioArquivo").style.display = "flex";
}

function esconderPopupEnvio() {
  document.getElementById("popupEnvioArquivo").style.display = "none";
}

document.getElementById('btnConcluirRelatorio')?.addEventListener('click', async e => {
  e.preventDefault();

  const fileInput = document.getElementById('arquivo');
  const file = fileInput?.files?.[0];

  if (!file) {
    alert("Selecione um arquivo antes de enviar.");
    return;
  }

  mostrarPopupEnvio();

  try {
    const reader = new FileReader();

    reader.onload = async () => {
      const base64Data = reader.result.split(",")[1];

      const formData = new FormData();
      formData.append("filename", file.name);
      formData.append("mimeType", file.type);
      formData.append("base64", base64Data);

      const uploadRes = await fetch("https://script.google.com/macros/s/AKfycbxgOLqJTW40niiCWWsu6nipAcL5n16LzYVDizuYi872Vcxd3BLnZkmF9j3jgUouBDrdIQ/exec", {
        method: "POST",
        body: formData
      });

      const result = await uploadRes.json();

      if (result.link) {
        document.getElementById('linkVideo').value = result.link;
        document.getElementById('btnEnviarFormulario').style.display = 'inline-block';
        esconderPopupEnvio();
        alert("Arquivo enviado com sucesso. Agora clique em 'Enviar Formulário' para concluir.");
      } else {
        esconderPopupEnvio();
        alert("Erro ao obter o link do vídeo.");
      }
    };

    reader.readAsDataURL(file);
  } catch (err) {
    esconderPopupEnvio();
    alert("Erro ao processar o arquivo.");
    console.error(err);
  }
});
