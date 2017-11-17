

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
    return card;
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

const board = {
  name: 'Kanban Board',
  addColumn: function(column) {
    this.element.append(column.element);
    initSortable();
  },
  element: document.querySelector('#board .column-container')
};

function initSortable() {
  $('.column-card-list').sortable({
    connectWith: '.column-card-list',
    placeholder: 'card-placeholder'
  }).disableSelection();
}

function randomString() {
  const chars = '0123456789abcdefghiklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXTZ';
  let str = '';
  for (let i = 0; i < 10; i++) {
      str += chars[Math.floor(Math.random() * chars.length)];
  }
  return str;
}

(function setEventListeneres() {
  const mainBoard = document.querySelector('.board');
  mainBoard.addEventListener('click', (e) => {
    if (e.target.matches('.btn-delete')) {
        const elementClicked = e.target;
        Column.prototype.removeColumn(elementClicked.parentNode);
    } else if (e.target.matches('.add-card')) {
        const elementClicked = e.target;
        Column.prototype.addCard(new Card(prompt("Enter the name of the card")), elementClicked.parentNode.children[3]);
    } else if (e.target.matches('.create-column')) {
        const column = new Column(prompt('Enter a column name'));
        board.addColumn(column);
    }
  });
})()



const todoColumn = new Column('To do');
const doingColumn = new Column('Doing');
const doneColumn = new Column('Done');

// ADDING COLUMNS TO THE BOARD
board.addColumn(todoColumn);
board.addColumn(doingColumn);
board.addColumn(doneColumn);

// CREATING CARDS
const card1 = new Card('New task');
const card2 = new Card('Create kanban boards');

// ADDING CARDS TO COLUMNS
todoColumn.addCard(card1, todoColumn.element.childNodes[3]);
doingColumn.addCard(card2, doingColumn.element.childNodes[3]);

