const dataInitial = document.querySelector("#data");
const button = document.querySelector("#search");
const resultado = document.querySelector("#resultado");
const loading = '<div class="d-flex justify-content-center mt-3"><div class="spinner-grow" role="status"><span class="visually-hidden">Loading...</span></div></div>';

const EX_TOKEN_API = '8c315544b6f1040c1a441d136909d1dff5c1503ff0c2b632d70a327ad8b4a5c9';
const habboApi = axios.create({
  baseURL: 'https://www.habbo.com.br/api/public/users',
});


async function loadData() { 

  resultado.innerHTML = loading;

  try {
    const infoUser = await axios.get('http://api.exbrhbofc.net/fe/numero', {
      params: {
        token: EX_TOKEN_API,
        nick: dataInitial.value,
      }
    });

    if(infoUser.data.numero.length === 0){
      throw new Error('Usuário não registrado na FE');
    }

    const responseUserId = await habboApi.get('', {
      params: {
        name: dataInitial.value,
      }
    });

    if(!responseUserId.data.profileVisible){
      throw new Error('Perfil fechado');
    }

    const profileID = responseUserId.data.uniqueId;
    const responseUserData = await habboApi.get(`${profileID}/profile`);
    // console.log(infoUser.data.numero[0].celular,responseUserId.data,responseUserData.data);

    //Encontrar a formula
    const getLastAcess = responseUserData.data.user.lastAccessTime;
    // const getLastAcessTimestamp = new Date(String(getLastAcess));

    const dateTime = new Date(getLastAcess);
    const getDataFormatter = dateTime.toLocaleString('pt-BR', {day: '2-digit', month: '2-digit', year: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric'})
    console.log(getDataFormatter);

    const currentDateTime = new Date();
    const getCurrentDateFormatter = currentDateTime.toLocaleString('pt-BR', {day: '2-digit', month: '2-digit', year: 'numeric'})
    console.log(getCurrentDateFormatter);

    const diff = moment(getCurrentDateFormatter,"DD/MM/YYYY").diff(moment(getDataFormatter,"DD/MM/YYYY"));
    const daysDiff = moment.duration(diff).asDays();


    //Verificar o numero de dias e seu status
    if(daysDiff < 20) {
      var afk = 'Ativo';
    }else{
      var afk = 'Ausente';
    }

    //Revisar o código
    const getPhoneSuspect = infoUser.data.numero[0].celular;
    const getNickSuspect = infoUser.data.numero[0].nick;
    const getSttsSuspect = infoUser.data.numero[0].patente;
    const getSttsPPracas = infoUser.data.numero[0].status_painel_pracas;
    const getToUpperCase = getSttsPPracas[0].toUpperCase() + getSttsPPracas.substring(1);
    const getRemoveGA = infoUser.data.numero[0].removido_aberto;

    if(getRemoveGA === 0){
      var GA ='Ativo';
    }else{
      var GA ='Removido';
    }

    resultado.innerHTML = `
    <div class="container mt-3">
      <a href="//exbrhbofc.net/perfil/${getNickSuspect}" target="_blank" class="results--image-user" data-toggle="tooltip" title="${getNickSuspect}">
        <img src="https://www.habbo.com.br/habbo-imaging/avatarimage?user=${getNickSuspect}&direction=3&head_direction=3&gesture=sml&size=l" />
      </a>
      <div class="button-see-profile d-flex justify-content-center mt-3 mb-3">
        <a href="//exbrhbofc.net/perfil/${getNickSuspect}" target="_blank" class="btn btn-danger">Ver o perfil completo</a>
      </div>
      <div class="table-responsive">
        <table class="table table-dark table-hover">
          <thead>
            <tr>
              <th>Nick</th>
              <th>N°</th>
              <th>Últ. Acesso</th>
              <th>Stts</th>
              <th>Patente</th>
              <th>GA</th>
              <th>P. Praças</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>${getNickSuspect}</td>
              <td>${getPhoneSuspect}</td>
              <td>${getDataFormatter}</td>
              <td>${afk}</td>
              <td>${getSttsSuspect}</td>
              <td>${GA}</td>
              <td>${getToUpperCase}</td>
            </tr>
          </tbody>
        </table>
      </div>  
    </div>
`;

  } catch (err) {
    console.log(err);
    resultado.innerHTML = `<div class="alert alert-danger d-flex align-items-center mt-3" role="alert">
                            <svg class="bi flex-shrink-0 me-2" width="24" height="24" role="img" aria-label="Danger:"><use xlink:href="#exclamation-triangle-fill"/></svg>
                            <div>
                              ${err}
                            </div>
                          </div>`;
  }
}

document.onkeydown=function(evt){
  var keyCode = evt ? (evt.which ? evt.which : evt.keyCode) : event.keyCode;
  if(keyCode == 13) {
    loadData();
  }
}

button.addEventListener("click",(e)=>{
  loadData();
})

