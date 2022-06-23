import {notifyComfirm} from "./helpers/notifies.js"
import * as validates from "./helpers/validates.js"
import * as handleLocal from "./handleLocal.js"
import {formatdateHDMY} from "./helpers/formats.js"

/* start handle with DOM */

function showListUser(){
  hanldeSortUser();
  const users = handleLocal.handleGetAllUserInLocalStorage();
  const filter = handleLocal.handleGetFilterUserInLocalStorage();
  let data = [];

  if(validates.validateKeyExistInObject(filter,'status') && filter.status){
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
  const validText = validates.validateString(text);
  const validClassName =validates.validateString(className);
  const validType =validates.validateString(type);

  const button = document.createElement('button');
  button.type = validType;
  button.className = validClassName;
  button.textContent = validText;

  return button;
}


function addOptionInSelectFilter() {
  const data = handleLocal.handleGetAllUserInLocalStorage();
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

  handleLocal.handleAddUserInLocalStorage(data);
  showListUser();
  addOptionInSelectFilter();
  cleanForm();
}


function handleDeleteUser(id) {
  handleLocal.handleDeleteUserInLocalStorage(id);
  showListUser();
  addOptionInSelectFilter();
}

function handleChangeFilterUser(select) {
  const  users = handleLocal.handleGetAllUserInLocalStorage(); 
  let  filter = handleLocal.handleGetFilterUserInLocalStorage(); 
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

 if(!validates.validateKeyExistAndHasValueInObject(fields,'year') && !validates.validateKeyExistAndHasValueInObject(fields,'gender')){
    filter.status = false;
    filter.data = [];
  }

  handleLocal.handleSetFilterUserInLocalStorage(filter);
  showListUser();
}

function handleReturnFilterUser(users,fields) {
  let data = users;

  if(validates.validateKeyExistAndHasValueInObject(fields,'year') && !validates.validateKeyExistAndHasValueInObject(fields,'gender')){
    data = [...users].filter(item => item.year == fields['year']);

  }

  if(validates.validateKeyExistAndHasValueInObject(fields,'year') && validates.validateKeyExistAndHasValueInObject(fields,'gender')){
    data = [...users].filter(item => item.year == fields['year'] &&   item.gender == fields['gender']);
  }

  if(validates.validateKeyExistAndHasValueInObject(fields,'gender') && !validates.validateKeyExistAndHasValueInObject(fields,'year')){
    data = [...users].filter(item => item.gender == fields['gender']);

  }

  return data;
}


function handleChangeSortUser(select) {
  let sorts = handleLocal.handleGetSortInLocalStorage(); 
  let newSorts = {
    ...sorts,
    [select.target.name] : select.target.value
  }

  if(newSorts.sort_direction == undefined){
    newSorts.sort_direction = "up";
  }
  
  
  handleLocal.handleSetSortInLocalStorage(newSorts);
  showListUser();
}

function hanldeSortUser() {
  let filter = handleLocal.handleGetFilterUserInLocalStorage(); 
  let users = handleLocal.handleGetAllUserInLocalStorage();

  if(validates.validateArrayEmpty(users)){
    return
  }

  if(filter.status){
    users = filter.data
  }

 let data = handleReturnSort(users);

 if(validates.validateKeyExistInObject(filter,'status') && filter.status){
  handleLocal.handleUpdateDataFilterUserInLocalStorage(data);
 }else{
  handleLocal.handleUpdateUserInLocalStorage(data);
 }

}

function handleReturnSort(users) {
  const sorts = handleLocal.handleGetSortInLocalStorage(); 
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