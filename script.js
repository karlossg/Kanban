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
    const deleteButton = document.createElement("button");
    deleteButton.className = "btn-delete";
    deleteButton.textContent = "x";
    deleteButton.addEventListener('click', (event) => {
      $.ajax({
        url: baseUrl + '/' + event.target.parentNode.className + '/' + event.target.parentNode.id,
        method: 'DELETE',
        success: (response) => {
          Board.removeElement(document.getElementById(response.id));
        }
      });
    })
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
    const column = document.createElement("div");
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
    const columnTitle = document.createElement("h2");
    columnTitle.className = "column-title";
    columnTitle.textContent = this.name;
    columnTitle.addEventListener('click', (event) => {
      event.target.style.display = 'none';
      event.target.parentNode.children[4].style.display = 'inline';
      event.target.parentNode.children[4].value = event.target.textContent ;
      event.target.parentNode.children[4].focus();
      event.target.textContent = event.target.parentNode.children[4].value;
    })
    return columnTitle;
  }

  createColumnCardList() {
    const columnCardList = document.createElement("ul");
    columnCardList.className = "column-card-list";
    return columnCardList;
  }

  createColumnAddCardButton() {
    const columnAddCard = document.createElement("button");
    columnAddCard.className = "add-card";
    columnAddCard.textContent = "Add new card";
    columnAddCard.id = "addCard"
    columnAddCard.addEventListener('click', (event) => {
      event.target.style.visibility = "hidden";
      event.target.parentNode.children[5].style.visibility = "visible";
      event.target.parentNode.children[5].focus();
    })
    return columnAddCard;
  }

  createColumnAddCardName() {
    let cardName = document.createElement("input");
    cardName.className = "add-cardName";
    cardName.id = "cardNameInput";
    cardName.style.visibility = "hidden";
    cardName.placeholder = "Card name + (Enter)"
    cardName.type = "text";
    cardName.size = "20";
    cardName.maxLength = "23";
    cardName.addEventListener('keyup', (event) => {
      if (event.which === 13) {
        const columnId = event.target.parentNode.id;  
        const cardNameInput = event.target.parentNode.children[5];
        cardName =  event.target.value;
        if (cardName.length) {
          $.ajax({
            url: baseUrl + '/card',
            method: 'POST',
            data: {
              name: cardName,
              bootcamp_kanban_column_id: columnId
            },
            success: (response) => {
              const card = new Card(response.id, cardName);
              Board.addElement(card.element, event.target.parentNode.children[3]);
              event.target.style.visibility = "hidden";
              event.target.parentNode.children[2].style.visibility = "visible";
              cardNameInput.value = '';
            }
          });
      } else if (!cardName.length) {
      event.target.style.visibility = "hidden";
      event.target.parentNode.children[2].style.visibility = "visible";
        alert("Card name to short");
      }
    }
    })
    return cardName;
  }

  createColumnChangeName() {
    const newName = document.createElement("input");
    newName.className = "column-nameChange";
    newName.style.display = "none";
    newName.type = "text";
    newName.size = "20";
    newName.maxLength = "15";
    newName.addEventListener('keyup', event => {
      if (event.which === 13) {
        this.createColumnChangeNameAjax(event);
      }
    });
    newName.addEventListener('focusout', event => {this.createColumnChangeNameAjax(event)});
    return newName;
  }

  createColumnChangeNameAjax(event) {
    $.ajax({
      url: baseUrl + '/column' + '/' + event.target.parentNode.id,
      method: 'PUT',
      data: {
        name: event.target.value
      },
      success: (response) => {
        const currentColumn = document.getElementById(response.id)
        currentColumn.children[1].textContent = event.target.value;
        currentColumn.children[1].style.display = 'inline'
        event.target.style.display = 'none';
      }
    });
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
    const card = document.createElement("li");
    card.className = "card";
    card.id = this.id;
    card.appendChild(Board.createDeleteButton());
    card.appendChild(this.createCardDescription());
    card.appendChild(this.createCardChangeName());
    return card;
  }

  createCardDescription() {
    const cardDescription = document.createElement("p");
    cardDescription.className = "card-description";
    cardDescription.textContent = this.name;
    cardDescription.addEventListener('click', (event => {
      event.target.style.display = 'none';
      event.target.parentNode.children[2].style.display = 'inline';
      event.target.parentNode.children[2].value = event.target.textContent ;
      event.target.parentNode.children[2].focus();
      event.target.textContent = event.target.parentNode.children[2].value;
    }))
    return cardDescription;
  }

  createCardChangeName() {
    const newName = document.createElement("input");
    newName.className = "card-nameChange";
    newName.style.display = "none";
    newName.addEventListener('keyup', event => {
      if (event.which === 13) {
        this.createCardChangeNameAjax(event);
      }
    });
    newName.addEventListener('focusout', event => {this.createCardChangeNameAjax(event)});
    return newName;
  }

  createCardChangeNameAjax(event) {
    $.ajax({
      url: baseUrl + '/card' + '/' + event.target.parentNode.id,
      method: 'PUT',
      data: {
        name: event.target.value,
        bootcamp_kanban_column_id: event.target.parentNode.parentNode.parentNode.id
      },
      success: (response) => {
        const currentCard = document.getElementById(response.id)
        currentCard.children[1].textContent = event.target.value;
        currentCard.children[1].style.display = 'inline'
        event.target.style.display = 'none';
      }
    });
  }
}

function initSortable() {
  $('.column-card-list').sortable({
    connectWith: '.column-card-list',
    placeholder: 'card-placeholder',
    opacity: 0.8,
    tolerance: "intersect",
    stop: function( event, ui ) {
      const moveCardId = ui.item[0].id
      const moveCardName = ui.item[0].children[1].textContent;
      const targetColumnId = ui.item[0].parentNode.parentNode.id;
      $.ajax({
        url: baseUrl + '/card',
        method: 'POST',
        data: {
          name: moveCardName,
          bootcamp_kanban_column_id: targetColumnId
        },
        success: (response) => {
          $.ajax({
            url: baseUrl + '/card' + '/' + moveCardId,
            method: 'DELETE'
          });
        }
      });
    }
  }).disableSelection()};


function showHideAddColumn(Hide) {
  const createButton = document.getElementById('createColumn');
  const addButton = document.getElementById('createColumn_add');
  const cancelButton = document.getElementById('createColumn_cancel');
  const input = document.getElementById('columnName');
  if (Hide) {
    createButton.style.display = 'inline';
    addButton.style.display = 'none';
    cancelButton.style.display = 'none';
    input.style.display = 'none';
  } else {
    createButton.style.display = 'none';
    addButton.style.display = 'inline';
    cancelButton.style.display = 'inline';
    input.style.display = 'inline';
  }
}

(function addEventListeneresForColumnAdding() {
  const mainBoard = document.querySelector('.board');
  mainBoard.addEventListener('click', (e) => {
  const elementClicked = e.target;
    switch (elementClicked.className) {

      case 'create-column':
        let columnNameInput = document.getElementById('columnName')
        columnNameInput.focus();
        showHideAddColumn();
        if (!columnNameInput.hasAttribute("data-listener")) {
          columnNameInput.setAttribute("data-listener", "true");
          columnNameInput.addEventListener('keyup', (event) => {
            if (event.which === 13) {
            const newColumnName = columnNameInput.value;
              $.ajax({
                url: baseUrl + '/column',
                method: 'POST',
                data: {
                  name: newColumnName
                },
                success: (response) => {
                  const column = new Column(response.id, newColumnName);
                  Board.addElement(column.element);
                }
              });
              showHideAddColumn('hide');
              columnNameInput.value = '';
            }
          })
        }
        columnNameInput.focus();
        break;
        
      case 'create-column create-column_add':
        let columnName = document.getElementById('columnName').value
        $.ajax({
          url: baseUrl + '/column',
          method: 'POST',
          data: {
            name: columnName
          },
          success: (response) => {
            const column = new Column(response.id, columnName);
            Board.addElement(column.element);
          }
        });
        showHideAddColumn('hide');
        document.getElementById('columnName').value = '';
        break;

      case 'create-column create-column_cancel':
        showHideAddColumn('hide');
        document.getElementById('columnName').value = '';
        break;
    }
  });
})()