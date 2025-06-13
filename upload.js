const googleScriptURL = "https://script.google.com/macros/s/AKfycbzfa_oVSCC3li5jRT8LJmmS59FJzmOxHCa66z_zCI8zPeJDIs2elPHrWMtHm6XQQxBpmw/exec";

document.getElementById("inputFile").addEventListener("change", function () {
  const file = this.files[0];
  if (!file) return;

  const reader = new FileReader();

  reader.onload = function (e) {
    const base64 = e.target.result;

    const payload = {
      acao: "uploadArquivo",
      base64: base64,
      mimeType: file.type,
      fileName: file.name
    };

    fetch(googleScriptURL, {
      method: "POST",
      body: JSON.stringify(payload),
      headers: {
        "Content-Type": "application/json"
      }
    })
    .then(res => res.json())
    .then(data => {
      if (data.sucesso) {
        alert("Upload realizado com sucesso! Link: " + data.linkArquivo);
        document.getElementById("linkVideo").value = data.linkArquivo;
      } else {
        alert("Erro no upload: " + data.mensagem);
      }
    })
    .catch(err => {
      alert("Erro ao enviar o arquivo: " + err.message);
    });
  };

  reader.readAsDataURL(file);
});
