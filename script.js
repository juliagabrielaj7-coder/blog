const formPost = document.querySelector("#form-post");
const listaPosts = document.querySelector("#lista-posts");
const avisoVazio = document.querySelector("#aviso-vazio");
const mensagemPost = document.querySelector("#mensagem-post");

formPost.addEventListener("submit", (event) => {
  event.preventDefault();
  mensagemPost.textContent = "";

  const titulo = document.querySelector("#titulo-post").value.trim();
  const texto = document.querySelector("#texto-post").value.trim();
  const arquivo = document.querySelector("#imagem-post").files[0];

  if (!arquivo || !arquivo.type.startsWith("image/")) {
    mensagemPost.textContent = "Escolha um arquivo de imagem para publicar.";
    return;
  }

  const leitor = new FileReader();
  const botaoPublicar = formPost.querySelector("button");
  botaoPublicar.disabled = true;

  leitor.addEventListener("load", () => {
    if (typeof leitor.result !== "string") {
      mensagemPost.textContent = "Não foi possível carregar esta imagem.";
      botaoPublicar.disabled = false;
      return;
    }

    const post = criarPost(titulo, texto, leitor.result);
    listaPosts.prepend(post);
    avisoVazio.hidden = true;
    formPost.reset();
    botaoPublicar.disabled = false;
  });

  leitor.addEventListener("error", () => {
    mensagemPost.textContent = "Ocorreu um erro ao ler a imagem. Tente outro arquivo.";
    botaoPublicar.disabled = false;
  });

  leitor.readAsDataURL(arquivo);
});

listaPosts.addEventListener("submit", (event) => {
  if (!(event.target instanceof HTMLFormElement) || !event.target.matches(".form-comentario")) {
    return;
  }

  event.preventDefault();
  const campoComentario = event.target.querySelector("input");
  const texto = campoComentario.value.trim();

  if (!texto) {
    return;
  }

  const comentario = document.createElement("p");
  comentario.className = "comentario";
  comentario.textContent = texto;
  event.target.previousElementSibling.append(comentario);
  event.target.reset();
});

function criarPost(titulo, texto, imagem) {
  const post = document.createElement("article");
  post.className = "post";

  const tituloPost = document.createElement("h3");
  tituloPost.textContent = titulo;

  const dataPost = document.createElement("p");
  dataPost.className = "data-post";
  dataPost.textContent = new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "long",
  }).format(new Date());

  const imagemPost = document.createElement("img");
  imagemPost.className = "imagem-publicacao";
  imagemPost.src = imagem;
  imagemPost.alt = titulo;

  const legendaPost = document.createElement("p");
  legendaPost.className = "legenda-post";
  legendaPost.textContent = texto;

  const comentarios = document.createElement("div");
  comentarios.className = "comentarios-lista";

  const secaoComentarios = document.createElement("section");
  secaoComentarios.className = "comentarios";

  const tituloComentarios = document.createElement("h4");
  tituloComentarios.textContent = "Comentários";

  const formularioComentario = document.createElement("form");
  formularioComentario.className = "form-comentario";

  const campoComentario = document.createElement("input");
  campoComentario.type = "text";
  campoComentario.placeholder = "Escreva um comentário";
  campoComentario.setAttribute("aria-label", "Escreva um comentário");
  campoComentario.required = true;

  const botaoComentario = document.createElement("button");
  botaoComentario.className = "botao";
  botaoComentario.type = "submit";
  botaoComentario.textContent = "Comentar";

  formularioComentario.append(campoComentario, botaoComentario);
  secaoComentarios.append(tituloComentarios, comentarios, formularioComentario);
  post.append(tituloPost, dataPost, imagemPost, legendaPost, secaoComentarios);

  return post;
}
