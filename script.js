let zapros;

function addList(name,owner,stars) {
  const elemUlrep = document.querySelector('.rep-list__ul')
  const lirep = `<li class="rep-list__el">
   <div class="rep-list__txt">
   <span class="rep-list__elem name">Name: ${name}</span>
   <span class="rep-list__elem owner">Owner: ${owner}</span>
   <span class="rep-list__elem stars">Stars: ${stars}</span>
   </div>
   <a class="rep-list__btn"><img class="rep-list__img" src="img/cross-red.svg" alt=""></a>
  </li>`
  elemUlrep.insertAdjacentHTML("afterbegin",lirep)
}


function render(arrNames) {
  const Ulelem = document.querySelector('.search-ul')
  for (let i = 0; i < arrNames.length; i++) {
    const element = arrNames[i];
    Ulelem.insertAdjacentHTML("beforeend", `<li id="${i}" class="search-li"><a>${arrNames[i]}</a></li>`)
  }
}
function removeEl() {
  const Ulelem = document.querySelector('.search-ul')
  Ulelem.innerHTML=''
}
function debounce(func, debounceTime) {
  let timeoutId = null;
  let lastArguments = null;
  let lastThis = null;

  return  function () {
    lastArguments = arguments;
    lastThis = this;

    const fnCall = () => {
      if (lastArguments !== null) {
        func.apply(lastThis, lastArguments);

        lastArguments = null;
        lastThis = null;
      }
    }

    clearTimeout(timeoutId);

    timeoutId = setTimeout(fnCall, debounceTime);
  }
}
function getNames(name,cb) {
  console.log(name)
  const xhr = new XMLHttpRequest()
  console.log(xhr)
  xhr.open('get',`https://api.github.com/search/repositories?q=${name}`)  
  xhr.addEventListener('load',()=>{
    let obj = JSON.parse(xhr.responseText)
    obj = obj.items
    console.log(obj)
    cb(obj)
  })
  xhr.send()
  
}
async function listener(event){
  console.log(event)
  zapros = input.value
  if (event.keyCode!==32&& input.value.length!==0) {

    const debouncedFn = debounce(await getNames,1000)
    debouncedFn(zapros.trim() ,function(res){
      let arrNames=[]
      let arrOwners=[]
      let arrStars=[]
      console.log(zapros)
      removeEl()
      if (res.length >= 5 && res != null) {

        for (let i = 0; i < 5; i++) {
          console.log(arrNames[i]=res[i].name)
          console.log(arrOwners[i]=res[i].owner.login)
          console.log(arrStars[i]=res[i].stargazers_count)
          arrNames[i]=res[i].name
          arrOwners[i]=res[i].owner.login
          arrStars[i]=res[i].stargazers_count
          console.log(`Name: ${res[i].name}, Owner: ${res[i].owner.login}, Stars: ${res[i].stargazers_count}`)
        }  
      ////добавить LI
      render(arrNames)
      ////отследить клик
      let liclick = document.querySelectorAll('.search-li')
      console.log(liclick)
      liclick.forEach(function(elem) {
        elem.addEventListener("click", function(event) {
            console.log(event.target.id)
            let num = event.target.id
            console.log(arrNames[num],arrOwners[num],arrStars[num])
            addList(arrNames[num],arrOwners[num],arrStars[num])
            console.log(input.value)
            input.value=''
            removeEl()
            let crossrep = document.querySelectorAll('.rep-list__btn')
    crossrep.forEach(function(elem) {
      elem.addEventListener("click", function(event) {
      let parent=  event.target.closest('li')
      parent.remove()
      console.log(parent)
      })})
        })
    })





      }
      else if(res.length < 5 &&res.length >0 && res != null){
        for (let i = 0; i < res.length; i++) {
          arrNames[i]=res[i].name
          arrOwners[i]=res[i].owner.login
          arrStars[i]=res[i].stargazers_count
          console.log(`Name: ${res[i].name}, Owner: ${res[i].owner.login}, Stars: ${res[i].stargazers_count}`)
        }  
      ////добавить LI
      render(arrNames)
      ////отследить клик
      let liclick = document.querySelectorAll('.search-li')
      console.log(liclick)
      liclick.forEach(function(elem) {
        elem.addEventListener("click", function(event) {
            console.log(event.target.id)
            let num = event.target.id
            console.log(arrNames[num],arrOwners[num],arrStars[num])
            addList(arrNames[num],arrOwners[num],arrStars[num])
            console.log(input.value)
            input.value=''
            removeEl()
            let crossrep = document.querySelectorAll('.rep-list__btn')
            crossrep.forEach(function(elem) {
              elem.addEventListener("click", function(event) {
              let parent=  event.target.closest('li')
              parent.remove()
              console.log(parent)
              })})
        })
    })



   

      }
      else if(res.length === 0){
        alert('Такого репозитория не существует!')
        input.value =''
      }
    })

  }
  else if(input.value.length==0){
    removeEl()
  }
}
const debouncekey = debounce(listener,1000)
let input = document.querySelector('.search-input')
input.addEventListener('keyup',debouncekey)



