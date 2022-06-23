// validate
function validateString(str) {
  if(typeof str == 'string'){
     return str;
  }
  throw new Error(`${str} is type ${typeof str}, not string`);
}

function validatedArray(arr) {
  if (Array.isArray(arr)) {
      return arr;
  }
  throw new Error(`${arr} is type ${typeof(arr)}, not array`);
}

function validateKeyExistAndHasValueInObject(obj,key) {
  if(obj[key] != "" && obj[key] != undefined){
    return true;
  }

  return false;
}

function validateKeyExistInObject(obj,key) {
  if(obj[key] != undefined){
    return true;
  }

  return false;
}

function validateArrayEmpty(arr){
  if(arr.length > 0){
      return false;
  }else{
      return true;
  }
}

// format
function formatdateHDMY(dateString) {
  const dateObj = new Date(dateString);
  const yyyy = dateObj.getFullYear();
  let mm = dateObj.getMonth() + 1; // Months start at 0!
  let dd = dateObj.getDate();
  // 👇️ With PM / AM
const withPmAm = dateObj.toLocaleTimeString('en-US', {
  // en-US can be set to 'default' to use user's browser settings
  hour: '2-digit',
  minute: '2-digit',
});

  if (dd < 10) dd = '0' + dd;
  if (mm < 10) mm = '0' + mm; 

  return `${withPmAm} ${dd}/${mm}/${yyyy}`;

}

// run now create data select input 
(function() {
    let start_year = 1990;
    let end_year = new Date().getFullYear();
    const select_year = document.getElementById('year');
  
    for (let i = start_year; i <= end_year; i++) {
      let option = document.createElement("option");
      option.text = i;
      option.value = i;
      select_year.appendChild(option);
    }
})();


// handle main

 /* start handle with localstorage */

        // users local storage

function handleGetAllUserInLocalStorage(){
  const users = localStorage.getItem('users');
  const data = JSON.parse(users);
  return data ? data : [];
}

function handleAddUserInLocalStorage(data){
  const users = handleGetAllUserInLocalStorage();
  const newData = [...users,data];
  handleUpdateUserInLocalStorage(newData);
}

function handleUpdateUserInLocalStorage(data){
  localStorage.setItem('users',JSON.stringify(data));
}

function handleDeleteUserInLocalStorage(id) {
  const data = handleGetAllUserInLocalStorage();
  let newData = [...data].filter(item => item.id !== id);
  handleUpdateUserInLocalStorage(newData);
}

        // users filter local storage//

function handleSetFilterUserInLocalStorage(obj) {
  localStorage.setItem('filter',JSON.stringify(obj));
}

function handleGetFilterUserInLocalStorage() {
  const data = localStorage.getItem('filter');
  const newData = JSON.parse(data);
  return newData ? newData : {};
}

function handleUpdateDataFilterUserInLocalStorage(data) {
  const filter = handleGetFilterUserInLocalStorage();
  let obj = {
    ...filter,
    data: data,
  }
  localStorage.setItem('filter',JSON.stringify(obj));
}


        // sort local storage //

function handleSetSortInLocalStorage(obj) {
  localStorage.setItem('sorts',JSON.stringify(obj));
}

function handleGetSortInLocalStorage() {
  const data = localStorage.getItem('sorts');
  const newData = JSON.parse(data);
  return newData ? newData : {};
}

/* end handle with localstorage */


/* start handle with DOM */

function showListUser(){
  hanldeSortUser();
  const users = handleGetAllUserInLocalStorage();
  const filter = handleGetFilterUserInLocalStorage();
  let data = [];

  if(validateKeyExistInObject(filter,'status') && filter.status){
    data = filter.data;
   }else{
    data = users;
   }

  const tbody = document.getElementById('tbody');
  tbody.innerHTML = '';

  [...data].forEach((item,index) => {
    tbody.appendChild(createOneRowUserOnTable(index + 1,item))
  });

}


function createOneRowUserOnTable(index,obj){
  let tr = document.createElement('tr');
  
  tr.innerHTML = ` <th scope="row">${index}</th>
                  <td>${obj['username']}</td>
                  <td>${obj['year']}</td>
                  <td>${obj['gender']}</td>
                  <td>${formatdateHDMY(obj['createBy'])}</td>`

  let td = document.createElement('td');
  let button = createButton('button','Delete',"btn btn-danger");
  button.addEventListener("click", () =>{
    notifyComfirm(`Bạn có muốn xóa '${obj['username']}' ?`,'Xóa Thành Công',() => { handleDeleteUser(obj['id']) })
  })

  td.appendChild(button);
  tr.appendChild(td);

  return tr;
}

function createButton(type='',text='',className='') {
  const validText = validateString(text);
  const validClassName = validateString(className);
  const validType = validateString(type);

  const button = document.createElement('button');
  button.type = validType;
  button.className = validClassName;
  button.textContent = validText;

  return button;
}


function addOptionInSelectFilter() {
  const data = handleGetAllUserInLocalStorage();
  const select_filter_year = document.getElementById('filter_year');
  select_filter_year.innerHTML = '<option value="">Năm sinh</option>';
  let years = [];

  [...data].map(item =>{
    years.push(item.year)
  })

  let newYears =  Array.from( new Set(years));

  newYears.forEach(element => {
    let option = document.createElement("option");
    option.text = element;
    option.value = element;
    select_filter_year.appendChild(option);
  });

}

// clear form
function cleanForm() {
  form.reset();
}

/* end handle with DOM */



/* start handle event */

function handleAddUser(e){
  const formData = e.target
  let data = {
    id: Math.floor(Math.random() * 1000),
    username: formData['username'].value,
    year: formData['year'].value,
    gender: formData['gender'].value,
    createBy: new Date()
  }

  handleAddUserInLocalStorage(data);
  showListUser();
  addOptionInSelectFilter();
  cleanForm();
}


function handleDeleteUser(id) {
  handleDeleteUserInLocalStorage(id);
  showListUser();
  addOptionInSelectFilter();
}

function handleChangeFilterUser(select) {
  const  users = handleGetAllUserInLocalStorage(); 
  let  filter = handleGetFilterUserInLocalStorage(); 
  let fields = {
    ...filter.fields,
    [select.target.name] : select.target.value
  }
 let data = handleReturnFilterUser(users,fields);

 filter = {
  ...filter,
  status: true,
  fields: fields,
  data: data
 }

 if(!validateKeyExistAndHasValueInObject(fields,'year') && !validateKeyExistAndHasValueInObject(fields,'gender')){
    filter.status = false;
    filter.data = [];
  }

  handleSetFilterUserInLocalStorage(filter);
  showListUser();
}

function handleReturnFilterUser(users,fields) {
  let data = users;

  if(validateKeyExistAndHasValueInObject(fields,'year') && !validateKeyExistAndHasValueInObject(fields,'gender')){
    data = [...users].filter(item => item.year == fields['year']);

  }

  if(validateKeyExistAndHasValueInObject(fields,'year') && validateKeyExistAndHasValueInObject(fields,'gender')){
    data = [...users].filter(item => item.year == fields['year'] &&   item.gender == fields['gender']);
  }

  if(validateKeyExistAndHasValueInObject(fields,'gender') && !validateKeyExistAndHasValueInObject(fields,'year')){
    data = [...users].filter(item => item.gender == fields['gender']);

  }

  return data;
}


function handleChangeSortUser(select) {
  let sorts = handleGetSortInLocalStorage(); 
  let newSorts = {
    ...sorts,
    [select.target.name] : select.target.value
  }

  if(newSorts.sort_direction == undefined){
    newSorts.sort_direction = "up";
  }
  
  
  handleSetSortInLocalStorage(newSorts);
  showListUser();
}

function hanldeSortUser() {
  let filter = handleGetFilterUserInLocalStorage(); 
  let users = handleGetAllUserInLocalStorage();

  if(validateArrayEmpty(users)){
    return
  }

  if(filter.status){
    users = filter.data
  }

 let data = handleReturnSort(users);

 if(validateKeyExistInObject(filter,'status') && filter.status){
  handleUpdateDataFilterUserInLocalStorage(data);
 }else{
  handleUpdateUserInLocalStorage(data);
 }

}

function handleReturnSort(users) {
  const sorts = handleGetSortInLocalStorage(); 
  let data = [];

    switch (sorts.sort_field) {
      case "year":
          if(sorts.sort_direction == 'up'){
            data = [...users].sort((a,b) => a.year - b.year)
          }else{
            data = [...users].sort((a,b) => b.year - a.year)
          }
        break;

        case "username":
          if(sorts.sort_direction == 'up'){
            data = [...users].sort((a,b) => a.username.localeCompare(b.username))
          }else{
            data = [...users].sort((a,b) => b.username.localeCompare(a.username))
          }
        break;

        case "gender":
          if(sorts.sort_direction == 'up'){
            data = [...users].sort((a,b) => a.gender.toUpperCase() - b.gender.toUpperCase())
          }else{
            data = [...users].sort((a,b) => b.gender.toUpperCase() - a.gender.toUpperCase())
          }
        break;

      case "createBy":
          if(sorts.sort_direction == 'up'){
            data = [...users].sort((a,b) =>  new Date(a.createBy) - new Date(b.createBy))
          }else{
            data = [...users].sort((a,b) =>  new Date(b.createBy) - new Date(a.createBy))
          }
        break;
    
      default:
          if(sorts.sort_direction == 'down'){
            data = [...users].sort((a,b) => b.username.localeCompare(a.username))
          }else{
            data = [...users].sort((a,b) => a.username.localeCompare(b.username))
          }
        break;
    }

    return data;
}

/* end handle event */

/* start notify */
function notifyComfirm(title,reply,callbak){
  Swal.fire({
    title: title,
    showCancelButton: true,
    confirmButtonText: 'Lưu',
    cancelButtonText: 'Hủy',
  }).then((result) => {
    if (result.isConfirmed) {
      callbak();
      Swal.fire(reply, '', 'success')
    } 
  })
}

/* end notify */


const form = document.getElementById('form_user');

document.getElementById('sort_field').addEventListener('change',handleChangeSortUser);
document.getElementById('sort_direction').addEventListener('change',handleChangeSortUser);

document.getElementById('filter_year').addEventListener('change',handleChangeFilterUser);
document.getElementById('filter_gender').addEventListener('change',handleChangeFilterUser);

form.addEventListener('submit',function(e){
  e.preventDefault();
  notifyComfirm('Bạn có muốn lưu?','Lưu Thành Công',() => { handleAddUser(e) })
});

showListUser();
addOptionInSelectFilter();



