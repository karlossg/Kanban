class Board {
  constructor (name) {
    this.name = 'Kanban Board';
  }
  
  addColumn(column) {
    const element = document.querySelector('#board .column-container');
    element.append(column.element);
    initSortable();
  }

  addElement(child, parent) {parent.append(child)}
  
  removeElement(e) {e.remove()}
};

class Column extends Board {
  constructor (name) {
    super(name);
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
  let column = '';
  let card = '';
  const mainBoard = document.querySelector('.board');
  mainBoard.addEventListener('click', (e) => {
    if (e.target.matches('.btn-delete')) {
        const elementClicked = e.target;
        // const element = elementClicked.parentNode.className;
        // console.log(element)
        card.removeElement(elementClicked.parentNode);
    } else if (e.target.matches('.add-card')) {
        const elementClicked = e.target;
        card = new Card(prompt("Enter the name of the card"));
        card.addElement(card.element, elementClicked.parentNode.children[3]);
    } else if (e.target.matches('.create-column')) {
        column = new Column(prompt('Enter a column name'));
        column.addColumn(column);
    }
  });
})()


// FIRST SETUP
const todoColumn = new Column('To do');
const doingColumn = new Column('Doing');
const doneColumn = new Column('Done');

// ADDING COLUMNS TO THE BOARD
todoColumn.addColumn(todoColumn);
doingColumn.addColumn(doingColumn);
doneColumn.addColumn(doneColumn);

// CREATING CARDS
const card1 = new Card('New task');
const card2 = new Card('Create kanban boards');

// ADDING CARDS TO COLUMNS
todoColumn.addElement(card1.element, todoColumn.element.childNodes[3]);
doingColumn.addElement(card2.element, doingColumn.element.childNodes[3]);

