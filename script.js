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
    console.log(response.columns)
  }
});

function setupColumns(columns) {
  columns.forEach(function (column) {
    var col = new Column(column.id, column.name);
    // console.log(col.element)
    // console.log(column.cards)
    Board.addElement(col.element);
    setupCards(col, column.cards);
  });
}

function setupCards(col, cards) {
	cards.forEach(function (card, col) {
    console.log(col + '-' + card.bootcamp_kanban_column_id) 
        var card = new Card(card.id, card.name, card.bootcamp_kanban_column_id);
        Board.addElement(card.element, );
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
        Board.removeElement(elementClicked.parentNode);
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
        const columnName = prompt('Enter a column name');
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

  // $.ajax({
  //   url: baseUrl + '/column',
  //   method: 'POST',
  //   data: {
  //         name: columnName
  //   },
  //   success: function(response){
  //     var column = new Column(response.id, columnName);
  //     board.createColumn(column);
  //       }
  //   });

  //   $.ajax({
  //     url: baseUrl + '/card',
  //     method: 'POST',
  //     data: {
  //     name: cardName,
  //     bootcamp_kanban_column_id: self.id
  //     },
  //     success: function(response) {
  //         var card = new Card(response.id, cardName);
  //         self.createCard(card);
  //     }
  // });