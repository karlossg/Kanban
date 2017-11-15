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
    this.element = createColumn();
  }
  
  createColumn() {
    let column = document.createElement("div");
    column.setAttribute("class", "column");
    column.appendChild(createColumnTitle());
    column.appendChild(createColumnDeleteButton());
    column.appendChild(createColumnAddCardButton());
    column.appendChild(creaeColumnCardList());
    return column;
  }
  
  createColumnTitle() {
    let columnTitle = document.createElement("h2");
    columnTitle.setAttribute("class", "column-title");
    columnTitle.innerHTML(self.name);
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
    columnDelete.innerHTML("x");
    return columnDelete;
  }
    
  createColumnAddCardButton() {
    let columnAddCard = document.createElement("button");
    columnDelete.setAttribute("class", "add-card");
    columnAddCard.innerHTML("Add a card");
    return columnAddCard;
  }

    columnAddCard.onclick = () => {
      self.addCard(new Card(prompt("Enter the name of the card")));
    }
    columnDelete.onclick = () => {
      self.removeColumn();
    }
   
  
}

Column.prototype = {
  addCard: function(card) {
    this.$element.children('ul').append(card.$element);
  },
  removeColumn: function() {
    this.$element.remove();
  }
};


