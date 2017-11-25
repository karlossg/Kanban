const baseUrl = 'https://kodilla.com/pl/bootcamp-api';
const myHeaders = {
  'X-Client-Id': '2342',
  'X-Auth-Token': 'df50b9650201d2c5485d36b77888b4f8'
};

$.ajaxSetup({
  headers: myHeaders
});

$.ajax({
  url: baseUrl + '/board',
  method: 'GET',
  success: (response) => {
    setupColumns(response.columns)
  }
});

function setupColumns(columns) {
  columns.forEach(function(column) {
    const col = new Column(column.id, column.name);
    Board.addElement(col.element);
    setupCards(col, column.id, column.cards);
  });
}

function setupCards(col, columnID, cards) {
  cards.forEach(function(card, index) {
    const newCard = new Card(card.id, card.name, card.bootcamp_kanban_column_id);
    const x = document.getElementById(columnID);
    Board.addElement(newCard.element, x.childNodes[3]);
  })
}

class Board {
  constructor(name) {
    this.name = 'Kanban Board';
  }

  static addElement(child, parent = document.querySelector('#board .column-container')) {
    parent.appendChild(child)
    initSortable();
  }

  static removeElement(e) {
    e.remove()
  }

  static createDeleteButton() {
    let deleteButton = document.createElement("button");
    deleteButton.className = "btn-delete";
    deleteButton.textContent = "x";
    return deleteButton;
  }

  
};

class Column extends Board {
  constructor(id, name) {
    super(id, name);
    this.id = id;
    this.name = name || 'no name';
    this.element = this.createColumn();
  }

  createColumn() {
    let column = document.createElement("div");
    column.className = "column";
    column.id = this.id;
    
    column.appendChild(Board.createDeleteButton());
    
    column.appendChild(this.createColumnTitle());
   
    column.appendChild(this.createColumnAddCardButton());
    column.appendChild(this.createColumnCardList());
    column.appendChild(this.createColumnChangeName());
    column.appendChild(this.createColumnAddCardName());
    
    return column;
  }

  createColumnTitle() {
    let columnTitle = document.createElement("h2");
    columnTitle.className = "column-title";
    columnTitle.textContent = this.name;
    
    return columnTitle;
  }

  createColumnCardList() {
    let columnCardList = document.createElement("ul");
    columnCardList.className = "column-card-list";
    return columnCardList;
  }

  createColumnAddCardButton() {
    let columnAddCard = document.createElement("button");
    columnAddCard.className = "add-card";
    columnAddCard.textContent = "Add new card";
    columnAddCard.id = "addCard"
    return columnAddCard;
  }

  createColumnAddCardName() {
    let cardName = document.createElement("input");
    cardName.className = "add-cardName";
    cardName.id = "cardNameInput";
    cardName.style.visibility = "hidden";
    cardName.placeholder = "Enter new card name"
    return cardName;
  }

  createColumnChangeName() {
    let newName = document.createElement("input");
    newName.className = "column-nameChange";
    newName.style.display = "none";
    return newName;
  }
}

class Card extends Board {
  constructor(id, name) {
    super(id, name);
    this.id = id;
    this.name = name;
    this.element = this.createCard();
  }

  createCard() {
    let card = document.createElement("li");
    card.className = "card";
    card.id = this.id;
    card.appendChild(Board.createDeleteButton());
    card.appendChild(this.createCardDescription());
    card.appendChild(this.createCardChangeName());
    return card;
  }

  createCardDescription() {
    let cardDescription = document.createElement("p");
    cardDescription.className = "card-description";
    cardDescription.textContent = this.name;
    return cardDescription;
  }

  createCardChangeName() {
    let newName = document.createElement("input");
    newName.className = "card-nameChange";
    newName.style.display = "none";
    return newName;
  }
}

function initSortable() {
  $('.column-card-list').sortable({
    connectWith: '.column-card-list',
    placeholder: 'card-placeholder',
    opacity: 0.8,
    tolerance: "intersect"
  }).disableSelection();
}


(function setEventListeneres() {
  const mainBoard = document.querySelector('.board');
  mainBoard.addEventListener('click', (e) => {
    if (e.target.matches('.btn-delete')) {
      const elementClicked = e.target;
      $.ajax({
        url: baseUrl + '/' + elementClicked.parentNode.className + '/' + elementClicked.parentNode.id,
        method: 'DELETE',
        success: function(response) {
          const elementToRemove = document.getElementById(response.id)
          Board.removeElement(elementToRemove);
        }
      });
    } else if (e.target.matches('.add-card')) {
      const addCardButton = e.target;
      const columnId =  e.target.parentNode.id;
      let cardName = document.getElementById('addCard').value;
      addCardButton.style.visibility = "hidden";
      const cardNameInput = addCardButton.parentNode.children[5];
      cardNameInput.style.visibility = "visible";
      cardNameInput.focus();
      if (!cardNameInput.hasAttribute("data-listener")) {
      cardNameInput.addEventListener('focusout', (e) => {
        cardNameInput.setAttribute("data-listener", "true");
        cardName = cardNameInput.value;
        if (cardName.length) {
        $.ajax({
          url: baseUrl + '/card',
          method: 'POST',
          data: {
            name: cardName,
            bootcamp_kanban_column_id: columnId
          },
          success: function(response) {
            const card = new Card(response.id, cardName);
            Board.addElement(card.element, e.target.parentNode.children[3]);
            addCardButton.style.visibility = "visible";
            e.target.style.visibility = "hidden";
            cardNameInput.value = '';
            
          }
        });
      } else {
        addCardButton.style.visibility = "visible";
        e.target.style.visibility = "hidden";
        alert("Card name to short");
      }
      })
    }
      
    } else if (e.target.matches('.create-column')) {
      const createButton = document.getElementById('createColumn');
      createButton.style.display = 'none';
      const addButton = document.getElementById('createColumn_add');
      addButton.style.display = 'inline';
      const cancelButton = document.getElementById('createColumn_cancel');
      cancelButton.style.display = 'inline';
      const input = document.getElementById('columnName');
      input.style.display = 'inline';
    }

    if (e.target.matches('.create-column_add')) {
      const columnName = document.getElementById('columnName').value
      $.ajax({
        url: baseUrl + '/column',
        method: 'POST',
        data: {
          name: columnName
        },
        success: function(response) {
          const column = new Column(response.id, columnName);
          Board.addElement(column.element);
        }
      });
      document.getElementById('columnName').value = '';
      const createButton = document.getElementById('createColumn');
      createButton.style.display = 'inline';
      const addButton = document.getElementById('createColumn_add');
      addButton.style.display = 'none';
      const cancelButton = document.getElementById('createColumn_cancel');
      cancelButton.style.display = 'none';
      const input = document.getElementById('columnName');
      input.style.display = 'none';
    } else if (e.target.matches('.create-column_cancel')) {
      document.getElementById('columnName').value = '';
      const createButton = document.getElementById('createColumn');
      createButton.style.display = 'inline';
      const addButton = document.getElementById('createColumn_add');
      addButton.style.display = 'none';
      const cancelButton = document.getElementById('createColumn_cancel');
      cancelButton.style.display = 'none';
      const input = document.getElementById('columnName');
      input.style.display = 'none';
    }

    if (e.target.matches('.column-title')) {
      let columnTitleElement = e.target;
      columnTitleElement.style.display = 'none';
      let columnName = columnTitleElement.textContent;
      const newNameInput = columnTitleElement.parentNode.children[4];
      newNameInput.style.display = 'inline';
      newNameInput.value = columnName;
      newNameInput.focus();
      
      newNameInput.addEventListener('keyup', function () {
        columnName = newNameInput.value;
        if (event.which === 13) {
          $.ajax({
            url: baseUrl + '/' + columnTitleElement.parentNode.className + '/' + columnTitleElement.parentNode.id,
            method: 'PUT',
            data: {
              name: columnName
            },
            success: function(response) {
              const currentColumn = document.getElementById(response.id)
              currentColumn.children[1].textContent = columnName;
              currentColumn.children[1].style.display = 'inline'
              newNameInput.style.display = 'none';
            }
          });
          
        }
      });
      newNameInput.addEventListener('focusout', function () {
        columnName = newNameInput.value;
        $.ajax({
          url: baseUrl + '/' + e.target.parentNode.className + '/' + e.target.parentNode.id,
          method: 'PUT',
          data: {
            name: columnName
          },
          success: function(response) {
            const currentColumn = document.getElementById(response.id)
            currentColumn.children[1].textContent = columnName;
            currentColumn.children[1].style.display = 'inline'
            newNameInput.style.display = 'none';
          }
        });
      });
    }

    if (e.target.matches('.card-description')) {
      let cardDescriptionElement = e.target;
      cardDescriptionElement.style.display = 'none';
      let cardName = cardDescriptionElement.textContent;
      const newNameInput = cardDescriptionElement.parentNode.children[2];
      newNameInput.style.display = 'inline';
      newNameInput.value = cardName;
      newNameInput.focus();
      
      newNameInput.addEventListener('keyup', function (event) {
        cardName = newNameInput.value;
        if (event.which === 13) {
          $.ajax({
            url: baseUrl + '/' + cardDescriptionElement.parentNode.className + '/' + cardDescriptionElement.parentNode.id,
            method: 'PUT',
            data: {
              name: cardName
            },
            success: function(response) {
              const currentCard = document.getElementById(response.id)
              currentCard.children[1].textContent = columnName;
              currentColumn.children[1].style.display = 'inline'
              newNameInput.style.display = 'none';
            }
          });
          
        }
      });
      newNameInput.addEventListener('focusout', function (event) {
        columnName = newNameInput.value;
        $.ajax({
          url: baseUrl + '/' + e.target.parentNode.className + '/' + e.target.parentNode.id,
          method: 'PUT',
          data: {
            name: columnName
          },
          success: function(response) {
            const currentColumn = document.getElementById(response.id)
            currentColumn.children[1].textContent = columnName;
            currentColumn.children[1].style.display = 'inline'
            newNameInput.style.display = 'none';
          }
        });
      });
    }

  });
})()