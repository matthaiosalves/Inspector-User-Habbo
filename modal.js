const audio = document.querySelector('audio'),
buttons = document.querySelectorAll('.alerta button'),
alertaArea = document.querySelector('.alertaa')

var dobrado = document.getElementById("dobrado");

dobrado.volume = 0.04;

buttons.forEach(button => {
  button.addEventListener('click', () => {
    let tipo = parseInt(button.getAttribute('data-tipo'))
    if(tipo) {
      audio.play()
    }
    alertaArea.style.display = 'none'
  })
})

alertaArea.addEventListener('click', (e) => {
  if(e.target.className === 'alertaa') {
  alertaArea.style.display = 'none'
  }
})

