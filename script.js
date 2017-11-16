

class Column {
  constructor (name) {
    this.id = randomString();
    this.name = name;
    this.element = this.createColumn();
  }
  
  createColumn() {
    let column = document.createElement("div");
    column.className = "column";
    
    column.appendChild(this.createColumnTitle());
    column.appendChild(this.createColumnDeleteButton());
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

  createColumnDeleteButton() {
    let columnDelete = document.createElement("button");
    columnDelete.className = "btn-delete";
    columnDelete.textContent = "x";
    
    return columnDelete;
  }
    
  createColumnAddCardButton() {
    let columnAddCard = document.createElement("button");
    columnAddCard.className = "add-card";
    columnAddCard.textContent = "Add a card";

    // columnAddCard.addEventListener onclick = () => this.addCard(new Card(prompt("Enter the name of the card")));
    
    return columnAddCard;
  }
}

Column.prototype.addCard = function(card) {
    this.$element.children('ul').append(card.$element);
}

Column.prototype.removeColumn = function(e) {
    e.remove();
}

class Card {
  constructor (name) {
    this.id = randomString();
    this.name = name;
    this.element = createCard();
  }

  createCard() {
    let card = document.createElement("li");
    card.className = "card";
    card.appendChild(createCardDescription());
    card.appendChild(createCardDeleteButton());
    
    return card;
    cardDelete.onclick = () => {
      self.removeCard();
    }
  }
  
  createCardDescription() {
    let cardDescription = document.createElement("p");
    cardDescription.className = "card-description";
    cardDescription.textContent = self.description;
    return cardDescription;
  }
  
  createCardDeleteButton() {
    let cardDelete = document.createElement("button");
    cardDelete.className = "btn-delete";
    cardDelete.textContent = "x";
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
    this.$element.append(column.element);
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
setEventListeneres();
});

function randomString() {
  const chars = '0123456789abcdefghiklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXTZ';
  let str = '';
  for (let i = 0; i < 10; i++) {
      str += chars[Math.floor(Math.random() * chars.length)];
  }
  return str;
}

function setEventListeneres() {
  const deleteButtonsArr = document.getElementsByClassName('btn-delete');
  const length = deleteButtonsArr.length;
  for (var i = 0; i < length; i++) {
    element = deleteButtonsArr[i].addEventListener('click', function (e) {
      const elementClicked = e.target;
     
        Column.prototype.removeColumn(elementClicked.parentNode);
      
    }, false);
  }
}

