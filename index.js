let myHeaders = new Headers();
myHeaders.append("Content-Type", "application/json");
let requestOptions = {
  method: "get",
  headers: myHeaders,
  redirect: "follow"
};

// Tab of your gSheet
let tab = "test1";

let datas;
let filteredData = [];

// Template filters
const checkboxTemplate = document.querySelector(".checkbox_template");
const radioTemplate = document.querySelector(".radio_template");

// Template element
let card = document.querySelector(".card");

// Container of the templates
const cardContainer = document.querySelector(".card_container");

// Array of the filters
let allFilters = {
  example: [],
};

// Example of a filter container
const filterContainer = document.querySelector(".filter_container");

// Loader script (/!\ Need a loader element in webflow having the class .loader)
const loader = document.querySelector(".loader");
let isLoading = true;

const loading = () => {
  if (isLoading) {
    loader.classList.remove("d-none");
  } else {
    loader.classList.add("d-none");
  }
};
loading();

// Generating elements in the container
let creatingElements = arrayData => {
  containerIsClear = false;

  if (cardContainer.children.length > 0) {
    while (cardContainer.children.length > 0) {
      cardContainer.removeChild(cardContainer.firstChild);
    }
    containerIsClear = true;
  } else {
    containerIsClear = true;
  }

  for (i = 0; i < arrayData.length; i++) {
    if(typeof arrayData[i] != 'string') {
      let cardCloned = card.cloneNode(true);
      cardCloned.classList.add("cardCloned");
  
      cardContainer.appendChild(cardCloned);
    }
  }

  card.remove();

  let cardCloned = document.querySelectorAll(".cardCloned");
  let cardImage = document.querySelectorAll(".card_image");
  let cardTitle = document.querySelectorAll(".card_title");
  let cardDescription = document.querySelectorAll(".card_description");
  let cardDate = document.querySelectorAll(".card_date");
  let cardTag = document.querySelectorAll(".card_tag");

  let fuuf = false
  for (i = 0; i < arrayData.length; i++) {
    if(typeof arrayData[i] != 'string') {
      cardCloned[i - fuuf].href = `/pagetemplate?id=${arrayData[i].record_id}`;
      cardCloned[i - fuuf].style.backgroundColor = arrayData[i].backgroundColor;
      cardImage[i - fuuf].src = arrayData[i].image;
      cardTitle[i - fuuf].textContent = arrayData[i].titre;
      cardDate[i - fuuf].textContent = arrayData[i].date;
      cardTag[i - fuuf].textContent = arrayData[i].tag;
    } else {
      fuuf = true      
    }
  }
};

let filterSelected = [];
let comparaisonArray = [];
const filtering = (method, _filter) => {
  let transitionArray = [];
  
  let arrayFilter = []
  if(method != "recheck" && filterSelected.length > 0) {
    if(method == "multi") {
      arrayFilter.push(_filter)
      for(filterSelectedIndex = 0; filterSelectedIndex < filterSelected.length; filterSelectedIndex++) {
        for(dataIndex = 0; dataIndex < datas.length; dataIndex++) {
          if(filterSelected[filterSelectedIndex][0] == datas[dataIndex][filterSelected[filterSelectedIndex][1]]) {
            if(!arrayFilter.find(item => item == datas[dataIndex])) {
              arrayFilter.push(datas[dataIndex])
            }
          }
        }
      }
      comparaisonArray.push(arrayFilter)
    
    } else if(method == "solo") {
      arrayFilter.push(_filter)
      for(dataIndex = 0; dataIndex < datas.length; dataIndex++) {
        if(filterSelected[0][0] == datas[dataIndex][filterSelected[0][1]]) {
          if(!arrayFilter.find(item => item == datas[dataIndex])) {
            arrayFilter.push(datas[dataIndex])
          }
        }
      }
      comparaisonArray.push(arrayFilter)
    }
  }
  
  let checkingExist = (array, itemToCheck) => {
    let checked
    for (h = 0; h < array.length; h++) {
      if(array[h].includes(itemToCheck)) {
        checked = true
      } else {
        checked = false
        break;
      }
    }
    return checked
  }

  if(comparaisonArray.length >= 0) {
    for(i = 0; i < comparaisonArray.length; i++) {
      for(j = 0; j < comparaisonArray[i].length; j++) {
        if(checkingExist(comparaisonArray, comparaisonArray[i][j])) {
          if(!transitionArray.find(dataFiltered => dataFiltered == comparaisonArray[i][j])) {
            transitionArray.push(comparaisonArray[i][j])
          }
        }
      }
    }
  }

  transitionArray.forEach((element, index) => {
    if(typeof element === 'string') { 
      transitionArray.splice(index, 1)
    }
  })

  filteredData = transitionArray

  let allFilters = document.querySelectorAll('.allFilters')
  if(!Object.values(allFilters).find(element => element.children[0].checked)) {
    creatingElements(datas)
  } else {
    creatingElements(filteredData)
  }
}

let activeFilter = (
  _filter,
  _template,
  filterCloned,
  _filterType
) => {
  let buttonsOfTheFilter = document.querySelectorAll(`.${_filter}Cloned`);
  filterCloned.forEach(element => {
    element.addEventListener("click", e => {
      e.preventDefault();
      elementUndefined = false

      comparaisonArray.find((element, index) => {
        if(element != undefined) {
          if(element[0] == _filter) {
            comparaisonArray.splice(index, 1)
          }
        } else {
          elementUndefined = true
        }
      })

      if (element.children[0].checked) {
        element.children[0].checked = false;
        filterSelected = [];
          Object.values(buttonsOfTheFilter).filter(element => {
            if (element.children[0].checked) {
              filterSelected.push([element.children[1].textContent, _filter]);
            }
          })
          elementUndefined = true
      } else {
        element.children[0].checked = true;
        if(_filterType == "checkbox") {
            if(filterSelected.length == 0) {
              filterSelected = []
              filterSelected.push([element.children[1].textContent, _filter]);
            } else {
              if (!filterSelected.find(filter => filter[0] == element.children[1].textContent) && filterSelected[0][1] != _filter) {
                filterSelected = []
                filterSelected.push([element.children[1].textContent, _filter]);
              } else {
                filterSelected.push([element.children[1].textContent, _filter]);
              }
            }
          } else {   
            if(filterSelected.length > 0) {
              if(filterSelected.find((element, index) => {
                element[0][1] == _filter
              })) {
                filterSelected.splice(index, 1)
              }
            }
            filterSelected = []
            filterSelected.push([element.children[1].textContent, _filter])
          }
        }

      if(!elementUndefined || filterSelected.length > 0) {
        if(_filterType == "checkbox") {
          filtering("multi", _filter)
        } else {
          filtering("solo", _filter)
        }
      } else {
        filtering("recheck", _filter)
      }
    })
  })
}

let generationFilter = (
  globalData,
  _filterArray,
  _template,
  _filter,
  _filterContainer,
  _filterType
) => {
  globalData.forEach(datas => {
    if (_filterArray.length == 0) {
      _filterArray.push(datas[_filter]);
    } else {
      if (!_filterArray.find(element => element == datas[_filter])) {
        _filterArray.push(datas[_filter]);
      }
    }
  });

  if (_filterType != "select") {
    for (i = 0; i < _filterArray.length; i++) {
      let filterClone = _template.cloneNode(true);
      filterClone.classList.add("allFilters");
      filterClone.classList.add(`${_filter}Cloned`);

      _filterContainer.appendChild(filterClone);
    }

    _template.remove();
  }

  let filterCloned = document.querySelectorAll(`.${_filter}Cloned`);

  switch (_filterType) {
    case "checkbox":
      filterCloned.forEach((element, key) => {
        element.children[1].textContent = _filterArray[key];
      });
      break;
      
      case "radio":
        filterCloned.forEach((element, key) => {
          element.children[0].name = _filter
          element.children[0].value = _filterArray[key];
          element.children[1].textContent = _filterArray[key];
      });
      break;

    case "select":
      let clear = false;
      if (clear == false) {
        while (_template.children.length > 0) {
          _template.removeChild(_template.firstChild);
        }
        clear = true;
      }
      let resetOpt = document.createElement("option");
      resetOpt.value = "Reset";
      resetOpt.innerHTML = "Reset";
      _template.add(resetOpt);
      _filterArray.forEach(element => {
        let opt = document.createElement("option");
        opt.value = element;
        opt.innerHTML = element;
        _template.add(opt);
      });
      break;
  }
  activeFilter(
    _filter,
    _template,
    filterCloned,
    _filterType
  );
};

fetch(
  `https://v1.nocodeapi.com/nicolastr/google_sheets/zIPKRzkQmyYXnwRQ?tabId=${tab}`,
  requestOptions
)
  .then(response => response.text())
  .then(result => {
    let parsedData = JSON.parse(result).data;
    datas = parsedData;

    // Example of using generationFilter(globalData, _filterArray, _template, _filter, _filterContainer, _filterType)
    generationFilter(datas, allFilters.example, radioTemplate, "Ville", filterContainer, "radio")

    // Generating element without filter
    creatingElements(datas);

    isLoading = false;
    loading();
  })
  .catch(error => console.log("error", error));
