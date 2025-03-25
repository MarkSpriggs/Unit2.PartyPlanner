const apiUrl = 'https://fsa-crud-2aa9294fe819.herokuapp.com/api' 
const cohortCode = "2501-ftb-et-web-pt"
const baseUrl = `${apiUrl}/${cohortCode}/events`


const state = {
    allParties: [],
    singleParty: {},
}

const root = document.querySelector('#root');

const addForm = document.querySelector('#addForm');



const render = (content) => {
    if(Array.isArray(content)){
        root.replaceChildren(...content)
    }else {
        root.replaceChildren(content);
    }
}



const getEvents = async() => {
  const response = await fetch(baseUrl);
  const result = await response.json();
  console.log(result.data)


  const allEvents = result.data;
  state.allParties = allEvents.map((event) => {
    const card = document.createElement('div');
    card.classList.add('card');
    card.innerHTML = `
        <h1>${event.name}</h1>
        <p>${event.description}</p>
        <p>${event.date}</p>
        <p>${event.location}</p>
        <button class="getInfo">Find out more</button>
        <button id="deleteButton">Delete Me</button>
        `
      const getEventInfo = card.querySelector('.getInfo');
      getEventInfo.addEventListener('click', ()=>{
        singleEvent(event)
      });

      const deleteButton = card.querySelector('#deleteButton');
      deleteButton.addEventListener('click', ()=>{
        deleteEvent(event.id)
      })
      return card
    })

    render(state.allParties);

}

async function deleteEvent(id){
    console.log(id);
    const response = await fetch(`${baseUrl}/${id}`, {
        method: 'DELETE'
    });
    getEvents();
}


async function singleEvent(event) {
    console.log(event);
    state.singleParty = document.createElement('div');
    state.singleParty.classList.add('card', 'single');
    state.singleParty.innerHTML = `
        <h1>${event.name}</h1>
        <button class='goBack'>Go Back</button>
    `
    render(state.singleParty);

    const goBack = state.singleParty.querySelector('.goBack');
    goBack.addEventListener('click', ()=>{
        render(state.allParties);
        state.singleParty = {};
    })
}

const addEvent = async(eventInfo) => {
  const response = await fetch(baseUrl, {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(eventInfo)
  });
  const result = await response.json();
  console.log(result);
  getEvents();
}

addForm.addEventListener('submit', (event)=>{
    event.preventDefault();
    const addEventInfo = {name: addForm.name.value, description: addForm.description.value, date: `${addForm.date.value}:00Z`, location: addForm.location.value}
    addEvent(addEventInfo);
})

getEvents();
