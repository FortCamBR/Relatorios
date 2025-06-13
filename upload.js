function mostrarPopupEnvio() {
  document.getElementById("popupEnvioArquivo").style.display = "flex";
}

function esconderPopupEnvio() {
  document.getElementById("popupEnvioArquivo").style.display = "none";
}

document.getElementById('formRelatorio')?.addEventListener('submit', async e => {
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

      const uploadRes = await fetch("https://script.google.com/macros/s/AKfycbyvu5h874SwkCaXc_Drji5JO_ukq0c3wlLnSibON6sV_SZeA2PYOwjE1lP41NK-BYIVgg/exec", {
        method: "POST",
        body: formData
      });

      const result = await uploadRes.json();

      if (result.link) {
        // coloca o link no campo oculto do formulário
        document.getElementById('linkVideo').value = result.link;

        // agora envia o restante do relatório para a planilha
        esconderPopupEnvio();
        enviarRelatorio();
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