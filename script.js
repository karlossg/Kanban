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
    
    let columnTitle = document.createElement("h2");
    columnTitle.setAttribute("class", "column-title");
    let columnTitleText = document.createTextNode(self.name);
    columnTitle.appendChild(columnTitleText);

    let columnCardList = document.createElement("ul");
    columnCardList.setAttribute("class", "column-card-list");

    let columnDelete = document.createElement("button");
    columnDelete.setAttribute("class", "btn-delete");
    let deleteButtonName = document.createTextNode("x");
    columnDelete.appendChild(deleteButtonName);

    columnDelete.onclick = () => {
      self.removeColumn();
    }
    
    let columnAddCard = document.createElement("button");
    columnDelete.setAttribute("class", "add-card");
    let addCardButtonName = document.createTextNode("Add a card");
    columnAddCard.appendChild(addCardButtonName);

    columnAddCard.onclick = () => {
      self.addCard(new Card(prompt("Enter the name of the card")));
    }

    column.appendChild(columnTitle);
    column.appendChild(columnDelete);
    column.appendChild(columnAddCard);
    column.appendChild(columnCardList);
    
    return column;
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


let test = new Column('aaaa');

test.createColumn();