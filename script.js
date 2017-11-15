function randomString() {
  const chars = '0123456789abcdefghiklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXTZ';
  let str = '';
  for (let i = 0; i < 10; i++) {
      str += chars[Math.floor(Math.random() * chars.length)];
  }
  return str;
}

class Column {
  constructor (name) {
    this.id = randomString();
    this.name = name;
    this.element = this.createColumn();
  }
  
  createColumn() {
    let column = document.createElement("div");
    column.setAttribute("class", "column");
    
    column.appendChild(this.createColumnTitle());
    column.appendChild(this.createColumnDeleteButton());
    column.appendChild(this.createColumnAddCardButton());
    column.appendChild(this.createColumnCardList());
        
    return column;
  }
  
  createColumnTitle() {
    let columnTitle = document.createElement("h2");
    columnTitle.setAttribute("class", "column-title");
    columnTitle.innerHTML = this.name;
    return columnTitle;
  }

  createColumnCardList() {
    let columnCardList = document.createElement("ul");
    columnCardList.setAttribute("class", "column-card-list");
    return columnCardList;
  }

  createColumnDeleteButton() {
    let columnDelete = document.createElement("button");
    columnDelete.setAttribute("class", "btn-delete");
    columnDelete.setAttribute("onclick", 'this.removeColumn()');
    columnDelete.innerHTML = "x";

    // columnDelete.onclick = () => {
    //   this.removeColumn();
    // }

    return columnDelete;
  }
    
  createColumnAddCardButton() {
    let columnAddCard = document.createElement("button");
    columnAddCard.setAttribute("class", "add-card");
    columnAddCard.innerHTML = "Add a card";

    columnAddCard.onclick = () => {
      this.addCard(new Card(prompt("Enter the name of the card")));
    }

    return columnAddCard;
  }
}

Column.prototype.addCard = function(card) {
    this.$element.children('ul').append(card.$element);
}

Column.prototype.removeColumn = function() {
    this.$element.remove();
}

class Card {
  constructor (name) {
    this.id = randomString();
    this.name = name;
    this.element = createCard();
  }

  createCard() {
    let card = document.createElement("li");
    card.setAttribute("class", "card");

    card.appendChild(createCardDescription());
    card.appendChild(createCardDeleteButton());
    
    cardDelete.onclick = () => {
      self.removeCard();
    }
  }
  
  createCardDescription() {
    let cardDescription = document.createElement("p");
    cardDescription.setAttribute("class", "card-description");
    cardDescription.innerHTML(self.description);
    return cardDescription;
  }
  
  createCardDeleteButton() {
    let cardDelete = document.createElement("button");
    cardDelete.setAttribute("class", "btn-delete");
    cardDelete.innerHTML("x");
    return cardDelete;
  }
}

Card.prototype.removeCard = function() {
		this.$element.remove();
}


let board = {
  name: 'Kanban Board',
  addColumn: function(column) {
    (console.log(column))
    this.$element.append(column.element.innerHTML);
    initSortable();
  },
  $element: $('#board .column-container')
};

function initSortable() {
  $('.column-card-list').sortable({
    connectWith: '.column-card-list',
    placeholder: 'card-placeholder'
  }).disableSelection();
}

$('.create-column')
.click(function(){
const name = prompt('Enter a column name');
let column = new Column(name);

board.addColumn(column);
});


