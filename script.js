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
    cardName.placeholder = "Card name + (Enter)"
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
        success: function(response) {
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

(function setEventListeneres() {
  const mainBoard = document.querySelector('.board');
  mainBoard.addEventListener('click', (e) => {

    switch (e.target.className) {

      case 'btn-delete':
        $.ajax({
          url: baseUrl + '/' + e.target.parentNode.className + '/' + e.target.parentNode.id,
          method: 'DELETE',
          success: function(response) {
            Board.removeElement(document.getElementById(response.id));
          }
        });
        break;

      case 'add-card':
        const addCardButton = e.target;
        const columnId = e.target.parentNode.id;  
        const cardNameInput = e.target.parentNode.children[5];
        let cardName = document.getElementById('addCard').value;
        addCardButton.style.visibility = "hidden";
        cardNameInput.style.visibility = "visible";
        cardNameInput.focus();
        if (!cardNameInput.hasAttribute("data-listener")) {
          cardNameInput.setAttribute("data-listener", "true");
          cardNameInput.addEventListener('keyup', (e) => {
            cardName = cardNameInput.value;
            if (e.which === 13 && cardName.length) {
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
            } else if (!cardName.length) {
              addCardButton.style.visibility = "visible";
              e.target.style.visibility = "hidden";
              alert("Card name to short");
            }
          })
        }
        break;

      case 'create-column':
        const columnNameInput = document.getElementById('columnName')
        columnNameInput.focus();
        showHideAddColumn();
        if (!columnNameInput.hasAttribute("data-listener")) {
          columnNameInput.setAttribute("data-listener", "true");
          columnNameInput.addEventListener('keyup', function(event) {
            if (event.which === 13) {
            const newColumnName = columnNameInput.value;
              $.ajax({
                url: baseUrl + '/column',
                method: 'POST',
                data: {
                  name: newColumnName
                },
                success: function(response) {
                  const column = new Column(response.id, newColumnName);
                  Board.addElement(column.element);
                }
              });
              showHideAddColumn('hide');
              document.getElementById('columnName').value = '';
            }
        
        })
      }
        columnNameInput.focus();
        break;

        
      case 'create-column create-column_add':
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
        showHideAddColumn('hide');
        document.getElementById('columnName').value = '';
        break;

      case 'create-column create-column_cancel':
        showHideAddColumn('hide');
        document.getElementById('columnName').value = '';
        break;
      

      case 'column-title':
        let columnTitleElement = e.target;
        let columnNameToChange = columnTitleElement.textContent;
        const newNameInput = columnTitleElement.parentNode.children[4];
        columnTitleElement.style.display = 'none';
        newNameInput.style.display = 'inline';
        newNameInput.value = columnNameToChange;
        newNameInput.focus();
        newNameInput.addEventListener('keyup', function() {
          columnNameToChange = newNameInput.value;
          if (event.which === 13) {
            $.ajax({
              url: baseUrl + '/' + columnTitleElement.parentNode.className + '/' + columnTitleElement.parentNode.id,
              method: 'PUT',
              data: {
                name: columnNameToChange
              },
              success: function(response) {
                const currentColumn = document.getElementById(response.id)
                currentColumn.children[1].textContent = columnNameToChange;
                currentColumn.children[1].style.display = 'inline'
                newNameInput.style.display = 'none';
              }
            });
          }
        });
        newNameInput.addEventListener('focusout', function() {
          columnNameToChange = newNameInput.value;
          $.ajax({
            url: baseUrl + '/' + e.target.parentNode.className + '/' + e.target.parentNode.id,
            method: 'PUT',
            data: {
              name: columnNameToChange
            },
            success: function(response) {
              const currentColumn = document.getElementById(response.id)
              currentColumn.children[1].textContent = columnNameToChange;
              currentColumn.children[1].style.display = 'inline'
              newNameInput.style.display = 'none';
            }
          });
        });
        break;

      case 'card-description':
        let cardDescriptionElement = e.target;
        let cardDescription = cardDescriptionElement.textContent;
        const newDescriptionInput = cardDescriptionElement.parentNode.children[2];
        const parentColumnId = e.target.parentNode.parentNode.parentNode.id;
        cardDescriptionElement.style.display = 'none';
        newDescriptionInput.style.display = 'inline';
        newDescriptionInput.value = cardDescription;
        newDescriptionInput.focus();

        newDescriptionInput.addEventListener('keyup', function(event) {
          cardDescription = newDescriptionInput.value;
          if (event.which === 13) {
            $.ajax({
              url: baseUrl + '/' + e.target.parentNode.className + '/' + e.target.parentNode.id,
              method: 'PUT',
              data: {
                name: cardDescription,
                bootcamp_kanban_column_id: parentColumnId
              },
              success: function(response) {
                const currentCard = document.getElementById(response.id)
                currentCard.children[1].textContent = cardDescription;
                currentCard.children[1].style.display = 'inline'
                newDescriptionInput.style.display = 'none';
              }
            });
          }
        });
        newDescriptionInput.addEventListener('focusout', function(event) {
          cardDescription = newDescriptionInput.value;
          $.ajax({
            url: baseUrl + '/' + e.target.parentNode.className + '/' + e.target.parentNode.id,
            method: 'PUT',
            data: {
              name: cardDescription,
              bootcamp_kanban_column_id: parentColumnId
            },
            success: function(response) {
              const currentCard = document.getElementById(response.id)
              currentCard.children[1].textContent = cardDescription;
              currentCard.children[1].style.display = 'inline'
              newDescriptionInput.style.display = 'none';
            }
          });
        });
        break;
    }
  });
})()