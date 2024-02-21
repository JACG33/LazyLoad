const contPublicaciones = document.querySelector('.publicaciones');
const contLoad = document.getElementById("contLoad")
let cont = 0
let lastCard
let totalPost = 0

const createCard = (user, cont) => {
  // Cracion de elementos
  const card = document.createElement('div'); card.className = 'card-publicacion';
  const divUser = document.createElement('div'); divUser.className = 'div-user';
  const img = document.createElement('div'); img.className = 'img';
  const span = document.createElement('span'); span.className = 'user-name'; span.textContent = user;
  const textCont = document.createElement('div'); textCont.className = 'text-cont';
  const p = document.createElement('p'); p.textContent = cont;
  const interactionCont = document.createElement('div'); interactionCont.className = 'interaction-cont';
  const reactions = document.createElement('div'); reactions.className = 'reactions-cont hidden';

  const like = document.createElement('i'); like.textContent = 'like';
  const like2 = document.createElement('i'); like2.textContent = 'like2';
  const like3 = document.createElement('i'); like3.textContent = 'like3';

  const btn = document.createElement('button'); btn.setAttribute('id', 'likeBtn'); btn.textContent = 'Like'
  const btn2 = document.createElement('button'); btn2.textContent = 'Comment'
  // Asignacion de elementos
  divUser.append(img); divUser.append(span);
  textCont.append(p);
  reactions.append(like); reactions.append(like2); reactions.append(like3)
  interactionCont.append(reactions);
  interactionCont.append(btn); interactionCont.append(btn2);
  card.append(divUser); card.append(textCont); card.append(interactionCont);
  // Retorno de la card
  return card;
}

const observer = new IntersectionObserver((entradas) => {
  if (cont >= totalPost) {
    contPublicaciones.innerHTML += `
    <div class="card-publicacion message">
      <h3 style="text-align:center;"> No hay mas <strong>POST</strong> por cargar</h3> 
    </div>
  `
    setTimeout(() => {
      document.querySelector('.message').classList.toggle('hidden')
    }, 5000);
    return
  }
  if (entradas[0].isIntersecting) {
    contLoad.classList.add('cont-load-show')
    setTimeout(() => {
      contLoad.classList.remove('cont-load-show')
      cargarPost(5)
    }, 1500);
  }
}, {
  // Representa el margen del Viewport
  rootMargin: '0px 0px 0px 0px',
  // Evalua la posicion del elemento 1.0 seria totalmete visible, 0.5 la mitad del elemento
  threshold: 1.0
});


// Esta funcion sera quien cargue los post, recibe una cantidad de post a catgar
const cargarPost = async (cantidad) => {
  const req = await fetch('data/data.json');
  const resp = await req.json();
  totalPost = resp.length
  for (let i = cantidad; i > 0; i--) {
    if (resp[cont] != undefined) {
      const post = createCard(resp[cont].user, resp[cont].content)
      contPublicaciones.append(post)
      cont++;
    }
  }

  // En caso de que lastCard sea true se dejara de observar la ultima card
  if (lastCard) {
    observer.unobserve(lastCard)
  }
  const cards = document.querySelectorAll('.publicaciones .card-publicacion')
  // Se asigan un valor a lastCard
  lastCard = cards[cards.length - 1]
  // Se observa la ultima card
  observer.observe(lastCard);
  reactionsFloat()
}

contLoad.classList.add('cont-load-show')
setTimeout(() => {
  contLoad.classList.remove('cont-load-show')
  cargarPost(5)
}, 1000);


const reactionsFloat = () => {
  let btn = document.querySelectorAll('#likeBtn');
  for (let i = 0; i < btn.length; i++) {
    btn[i].addEventListener('mouseover', () => {
      document.querySelectorAll('.reactions-cont')[i].classList.toggle('hidden')
    })
    document.querySelectorAll('.reactions-cont')[i].addEventListener('mouseout', () => {
      document.querySelectorAll('.reactions-cont')[i].classList.toggle('hidden')
    })

  }
}