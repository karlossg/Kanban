

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

    return columnAddCard;
  }
}

Column.prototype.addCard = (card, parent) => parent.appendChild(card.element);

Column.prototype.removeColumn = e => e.remove();

class Card {
  constructor (name) {
    this.id = randomString();
    this.name = name;
    this.element = this.createCard();
  }

  createCard() {
    let card = document.createElement("li");
    card.className = "card";
    card.appendChild(this.createCardDescription());
    card.appendChild(this.createCardDeleteButton());
    console.log(card)
    return card;
    
    // cardDelete.onclick = () => {
    //   self.removeCard();
    // }
  }
  
  createCardDescription() {
    let cardDescription = document.createElement("p");
    cardDescription.className = "card-description";
    cardDescription.textContent = this.name;
    return cardDescription;
  }
  
  createCardDeleteButton() {
    let cardDelete = document.createElement("button");
    cardDelete.className = "btn-delete";
    cardDelete.textContent = "x";
    return cardDelete;
  }
}

Card.prototype.removeCard = e => e.remove();


let board = {
  name: 'Kanban Board',
  addColumn: function(column) {
    this.$element.append(column.element);
    initSortable();
    setEventListeneres();
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
  const deleteButtonsArrLength = deleteButtonsArr.length;

  const addCardButtonsArr = document.getElementsByClassName('add-card');
  const addCardButtonsArrLength = addCardButtonsArr.length;

  for (var i = 0; i < deleteButtonsArrLength; i++) {
    deleteButtonsArr[i].addEventListener('click', function (e) {
      const elementClicked = e.target;
      Column.prototype.removeColumn(elementClicked.parentNode);
    });
  }

  for (var i = 0; i < addCardButtonsArrLength; i++) {
    if (addCardButtonsArr[i].getAttribute('listener') !== 'true') {
    addCardButtonsArr[i].addEventListener('click', function (e) {
      const elementClicked = e.target;
      elementClicked.setAttribute('listener', 'true');
      Column.prototype.addCard(new Card(prompt("Enter the name of the card")), elementClicked.parentNode.children[3]);
    });
  }
  }
}

// var todoColumn = new Column('To do');
var doingColumn = new Column('Doing');
var doneColumn = new Column('Done');

// ADDING COLUMNS TO THE BOARD
board.addColumn(new Column('To do'));
board.addColumn(doingColumn);
board.addColumn(doneColumn);

// CREATING CARDS
var card1 = new Card('New task');
var card2 = new Card('Create kanban boards');

// ADDING CARDS TO COLUMNS
// todoColumn.addCard(card1, todoColumn.element.childNodes[3]);
// doingColumn.addCard(card2, doingColumn.element.childNodes[3]);

