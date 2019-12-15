//weather

const weather = document.querySelector('.js-weather');
const local = document.querySelector('.js-local');
const icon = document.querySelector('.js-icon');

const API_KEY = "9ccf7b852461ae975fd048792a551372";
const COORDS = 'coords';

function getWeather(lat, lng) {
    fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&appid=${API_KEY}&units=metric`
    )
        .then(function(response){
            return response.json();
        })
        .then(function(json) {
            const temperature = json.main.temp;
            const place = json.name;
            const wicon = json.weather[0].icon;
            weather.innerText = `${temperature}℃`;
            local.innerText = `${place}`;
            icon.innerHTML = `<img src=http://openweathermap.org/img/wn/${wicon}@2x.png>`;
        });
}

function saveCoords(coordsObj) {
    localStorage.setItem(COORDS, JSON.stringify(coordsObj));
}

function handleGeoSucces(position){
   const latitude = position.coords.latitude;
   const longitude = position.coords.longitude;
   const coordsObj = {
       latitude,
       longitude
   };
   saveCoords(coordsObj);
   getWeather(latitude, longitude);
}

function handleGeoError() {
    console.log('Cant access geo location');
}

function askForCoords() {
    navigator.geolocation.getCurrentPosition(handleGeoSucces, handleGeoError)
}

function loadCoords() {
    const loadedCoords = localStorage.getItem(COORDS);
    if(loadedCoords === null){
        askForCoords();
    } else {
        const parsedCoords = JSON.parse(loadedCoords);
        getWeather(parsedCoords.latitude, parsedCoords.longitude);
    }
}

//todolist
const toDoForm = document.querySelector('.js-toDoForm'),
    toDoInput = toDoForm.querySelector('.js-toDoForm input'),
    toDoList = document.querySelector('.js-toDoList');

const TODOS_LS = 'toDos';

let toDos = [];

function deleteToDo(event) {
    const btn = event.target;
    const li = btn.parentNode;
    toDoList.removeChild(li);
    const cleanTodos = toDos.filter(function(toDo){
        return toDo.id !== parseInt(li.id);
    });
    toDos = cleanTodos;
    saveToDos();
}

function saveToDos() {
    localStorage.setItem(TODOS_LS, JSON.stringify(toDos));
}

function paintToDo(text) {
    console.log(text)
    const li = document.createElement('li');
    const delBtn = document.createElement('button');    
    const span = document.createElement('span');
    const newId = toDos.length + 1;
    delBtn.innerText = 'X';
    delBtn.addEventListener('click', deleteToDo);
    span.innerText = text;    
    li.appendChild(span);    
    li.appendChild(delBtn);
    li.id = newId;
    toDoList.appendChild(li);
    const toDoObj = {
        text: text,
        id: newId
    };
    toDos.push(toDoObj);
    saveToDos();
}

function todoSubmit(event) {
    event.preventDefault();
    const currentValue = toDoInput.value;
    paintToDo(currentValue);
    toDoInput.value = '';
}

function something(toDo) {
    console.log(toDo.text);
}

function loadTodos() {
    const loadedToDos = localStorage.getItem(TODOS_LS);
    if(loadedToDos !== null) {
        const parsedToDos = JSON.parse(loadedToDos);
        parsedToDos.forEach(function(toDo){
            paintToDo(toDo.text);
        });
    }
}


const form = document.querySelector('.js-form'),
    input = form.querySelector(".js-form input"),
    greetings = document.querySelector('.js-greetings');

const USER_LS = 'currentUser',
    SHOWING_CN = 'showing';

function saveName(text) {
    localStorage.setItem(USER_LS, text);
}

function handleSubmit(event) {
    event.preventDefault();
    const currentValue = input.value;
    paintGreeting(currentValue);
    saveName(currentValue);
}

function askForName() {
    form.classList.add(SHOWING_CN);
    form.addEventListener('submit', handleSubmit)
}

function paintGreeting(text) {
    form.classList.remove(SHOWING_CN);
    greetings.classList.add(SHOWING_CN);
    greetings.innerText = greetingText(text);
}

function loadName() {
    const currentUser = localStorage.getItem(USER_LS);
    if(currentUser === null) {
        askForName();
    } else {
        paintGreeting(currentUser);
    }
}

function greetingText(name) {    
    const now = new Date();
    const inHour = now.getHours();

    if(inHour < 12 && inHour > 6) {
      return `Good morning, ${name}`;
    } else if(inHour < 18 && inHour > 12) {
      return `Good afternoon, ${name}`;
    } else {
      return `Good evening, ${name}`;
    }
  }

//time
const  clockTitle = document.querySelector('.time');

function dayTime() {
  const now = new Date();

  const inHour = now.getHours();
  const inMinute = now.getMinutes();
  const inSecond = now.getSeconds();
  clockTitle.innerText = `${inHour < 10 ? `0${inHour}` : inHour}:${inMinute < 10 ? `0${inMinute}` : inMinute}:${inSecond < 10 ? `0${inSecond}` : inSecond}`;
}
  

//background
const body = document.querySelector('body');

const IMG_NUMBER = 9;

function paintImage(imgNumber) {
    const image = new Image();
    image.src = `images/bg0${imgNumber + 1}.jpg`;
    image.classList.add('bgImage');
    body.appendChild(image);
}

function genRandom() {
    const number = Math.floor(Math.random() * IMG_NUMBER);
    return number;
}

function init() {
    const randomNumber = genRandom();
    paintImage(randomNumber);

    dayTime();
    setInterval(dayTime, 1000);

    loadName();

    loadTodos();
    toDoForm.addEventListener('submit', todoSubmit);

    loadCoords();
}

init();