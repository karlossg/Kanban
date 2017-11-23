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
  success: (response) => {setupColumns(response.columns)}
});

function setupColumns(columns) {
  columns.forEach(function (column) {
    const col = new Column(column.id, column.name);
    Board.addElement(col.element);
    setupCards(col, column.id, column.cards);
  });
}

function setupCards(col, columnID, cards) {
	cards.forEach(function (card, index) {
      const newCard = new Card(card.id, card.name, card.bootcamp_kanban_column_id);
      const x = document.getElementById(columnID);
      Board.addElement(newCard.element, x.childNodes[3]);
  	})
}

class Board {
  constructor (name) {
    this.name = 'Kanban Board';
  }
  
  static addElement(child, parent=document.querySelector('#board .column-container')) {
    parent.appendChild(child)
    initSortable();
  }
  
  static removeElement(e) {e.remove()}

  static createDeleteButton() {
    let deleteButton = document.createElement("button");
    deleteButton.className = "btn-delete";
    deleteButton.textContent = "x";
    return deleteButton;
  }
};

class Column extends Board {
  constructor (id, name) {
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
    columnAddCard.textContent = "+";
    return columnAddCard;
  }
}

class Card extends Board {
  constructor (id, name) {
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
    return card;
  }
  
  createCardDescription() {
    let cardDescription = document.createElement("p");
    cardDescription.className = "card-description";
    cardDescription.textContent = this.name;
    return cardDescription;
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
          success: function(response){
            const elementToRemove = document.getElementById(response.id)
            Board.removeElement(elementToRemove);
            }
        });
    } else if (e.target.matches('.add-card')) {
        const elementClicked = e.target;
        const columnId = elementClicked.parentNode.id
        const cardName = prompt("Enter the name of the card");
        $.ajax({
			    url: baseUrl + '/card',
			    method: 'POST',
			    data: {
			    name: cardName,
			    bootcamp_kanban_column_id: columnId
			    },
			    success: function(response) {
              const card = new Card(response.id, cardName);
              Board.addElement(card.element, elementClicked.parentNode.children[3]);
			    }
		  	});
    } else if (e.target.matches('.create-column')) {
        const addButton = e.target;
        addButton.style.display = 'none';
        const input = document.getElementById('columnName');
        input.style.display = 'inline';
        
        const columnName = input.value;
        $.ajax({
          url: baseUrl + '/column',
          method: 'POST',
          data: {
                name: columnName
          },
          success: function(response){
            const column = new Column(response.id, columnName);
            Board.addElement(column.element);
              }
        });
    }
  });
})()
