class Board {
  constructor (name) {
    this.name = 'Kanban Board';
  }
  
  addElement(child, parent=document.querySelector('#board .column-container')) {
    parent.append(child)
    initSortable();
  }
  
  removeElement(e) {e.remove()}

  createDeleteButton() {
    let deleteButton = document.createElement("button");
    deleteButton.className = "btn-delete";
    deleteButton.textContent = "x";
    return deleteButton;
  }
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
    column.appendChild(this.createDeleteButton());
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
    card.appendChild(this.createDeleteButton());
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
        Card.prototype.removeElement(elementClicked.parentNode);
    } else if (e.target.matches('.add-card')) {
        const elementClicked = e.target;
        const card = new Card(prompt("Enter the name of the card"));
        card.addElement(card.element, elementClicked.parentNode.children[3]);
    } else if (e.target.matches('.create-column')) {
        const column = new Column(prompt('Enter a column name'));
        column.addElement(column.element);
    }
  });
})()

function setup(columnName, cardName) {
  const newColumn = new Column(columnName);
  newColumn.addElement(newColumn.element)
  if (cardName) {
    const card = new Card(cardName);
    newColumn.addElement(card.element, newColumn.element.childNodes[3]);
  }
}

setup('To do', 'New task');
setup('Doing', 'Create kanban boards');
setup('Done');
