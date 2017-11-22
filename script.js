var baseUrl = 'https://kodilla.com/pl/bootcamp-api';
var myHeaders = {
  'X-Client-Id': '2342',
  'X-Auth-Token': 'df50b9650201d2c5485d36b77888b4f8'
};

$.ajaxSetup({
	headers: myHeaders
});

$.ajax({
  url: baseUrl + '/board',
  method: 'GET',
  success: function(response) {
    setupColumns(response.columns);
  }
});

function setupColumns(columns) {
  columns.forEach(function (column) {
    var col = new Column(column.id, column.name);
      board.createColumn(col);
      setupCards(col, column.cards);
  });
}

function setupCards(col, cards) {
	cards.forEach(function (card) {
        var card = new Card(card.id, card.name, card.bootcamp_kanban_column_id);
    	col.createCard(card);
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
  
  static removeElement(e) {
    $.ajax({
      url: baseUrl + e.className + self.id,
      method: 'DELETE',
      success: function(response){
        e.remove();
        }
    });
  }

  static createDeleteButton() {
    let deleteButton = document.createElement("button");
    deleteButton.className = "btn-delete";
    deleteButton.textContent = "x";
    return deleteButton;
  }
};

class Column extends Board {
  constructor (name, id) {
    super(name, id);
    this.id = id;
    this.name = name || 'no name';
    this.element = this.createColumn();
  }
  
  createColumn() {
    let column = document.createElement("div");
    column.className = "column";
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
  constructor (name) {
    super(name);
    this.id = randomString();
    this.name = name;
    this.element = this.createCard();
  }

  createCard() {
    let card = document.createElement("li");
    card.className = "card";
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
        Board.removeElement(elementClicked.parentNode);
    } else if (e.target.matches('.add-card')) {
        const elementClicked = e.target;
        const card = new Card(prompt("Enter the name of the card"));
        Board.addElement(card.element, elementClicked.parentNode.children[3]);
    } else if (e.target.matches('.create-column')) {
        const column = new Column(prompt('Enter a column name'));
        Board.addElement(column.element);
    }
  });
})()

