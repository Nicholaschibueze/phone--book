class PhoneBook {
  constructor() {
    this.storageName = 'PhoneBook';
    this.data = this.loadData();
    this.connectForm();
    this.display();
  }

  loadData() {
    const data = localStorage.getItem(this.storageName);
    if (data) {
      return JSON.parse(data);
    }
    return {
      contacts: {},
      index: 1,
    };
  }

  saveData() {
    const data = JSON.stringify(this.data);
    localStorage.setItem(this.storageName, data);
  }

  connectForm() {
    this.form = document.getElementById('form');
    this.inputs = document.getElementsByTagName('input');
    this.form.onsubmit = (ev) => {
      ev.preventDefault();
      if (this.form.checkValidity()) {
        const name = this.inputs.namedItem('name').value;
        const email = this.inputs.namedItem('email').value;
        const phones = this.inputs.namedItem('phones').value;
        const address = this.inputs.namedItem('address').value;
        const nums = phones.split(',').map(num => num.trim());
        const numbers = {
          home: nums[1],
          mobile: nums[0],
          office: nums[2]
        };
        const action = this.inputs.item(this.inputs.length - 1);
        if (action.name === 'add') {
          this.addContact(name, numbers, email, address);
        } else {
          const id = Number(action.name.split('-')[1]);
          console.log(id, numbers);
          this.editContact(id, {
            name,
            mobile: numbers.mobile,
            home: numbers.home,
            office: numbers.office
          });
          action.setAttribute('name', 'add');
        }
        this.form.reset();
      } else {
        alert(`Invalid form: ${this.form.validityMessage}`);
      }
    };
  }

  addContact(name, numbers, email, address) {
    this.data.contacts[this.data.index] = {
      id: this.data.index,
      name,
      numbers,
      email,
      address,
    };
    this.data.index++;
    this.display();
    this.saveData();
  }

  deleteContact(id) {
    delete this.data.contacts[id];
    this.display();
    this.saveData();
  }

  setEditForm(contact) {
    const nums = Object.values(contact.numbers).filter(n => !!n);
    const name = this.inputs.namedItem('name').value = contact.name;
    const email = this.inputs.namedItem('email').value = contact.email;
    const phones = this.inputs.namedItem('phones').value = nums.join(', ');
    const address = this.inputs.namedItem('address').value = contact.address;
    const save = this.inputs.item(this.inputs.length - 1)
      .setAttribute('name', `edit-${contact.id}`);
  }

  editContact(id, {
    name,
    mobile,
    home,
    office
  }) {
    const contact = this.data.contacts[id];
    this.data.contacts[id] = {
      ...this.data.contacts[id],
      name: name || contact.name,
      numbers: {
        mobile: mobile || contact.numbers.mobile,
        home: home || contact.numbers.home,
        office: office || contact.numbers.office,
      }
    };
    this.display();
    this.saveData();
  }

  makeEmptyRow(text) {
    const row = document.createElement('tr');
    const td = document.createElement('td');
    td.setAttribute('colspan', '6');
    td.setAttribute('class', 'uk-text-center');
    td.innerHTML = text;
    row.appendChild(td);
    return row;
  }

  makeElement(tag, text) {
    const element = document.createElement(tag);
    element.setAttribute('class', 'uk-text-capitalize');
    element.innerHTML = text;
    return element;
  }

  makeButton(label, onClick, color) {
    const button = document.createElement('button');
    button.setAttribute('class', `uk-button uk-button-small uk-button-text uk-text-${color}`);
    button.addEventListener('click', onClick);
    button.innerHTML = label;
    return button;
  }
  
  makeAction(editAction, deleteAction) {
  	const inlineCon = document.createElement('div');
    inlineCon.setAttribute('class', 'uk-inline');
    const button = document.createElement('button');
    button.setAttribute('class', 'uk-button uk-button-primary uk-button-small');
    button.setAttribute('type', 'button');
    button.innerHTML = '<span uk-icon="more" />';
    inlineCon.appendChild(button);
    const drop = document.createElement('div');
    drop.setAttribute('uk-dropdown', 'mode: click');
    const list = document.createElement('ul');
    list.setAttribute('class', 'uk-nav uk-dropdown-nav');
    const item1 = document.createElement('li');
    item1.appendChild(editAction);
    const item2 = document.createElement('li');
    item2.appendChild(deleteAction);
    list.appendChild(item1);
    list.appendChild(item2);
    drop.appendChild(list);
    inlineCon.appendChild(drop);
    return inlineCon;
  }

  makeRow(sn, contact) {
    const row = document.createElement('tr');
    let numbers = '';
    Object.keys(contact.numbers).forEach((key) => {
      if (contact.numbers[key]) {
        numbers += `${key}: ${contact.numbers[key]}<br/>`;
      }
    });
    const actionTd = this.makeElement('td', '');
    row.appendChild(this.makeElement('td', sn));
    row.appendChild(this.makeElement('td', contact.name));
    row.appendChild(this.makeElement('td', contact.email));
    row.appendChild(this.makeElement('td', numbers));
    row.appendChild(this.makeElement('td', contact.address));
    const editButton = this.makeButton('Edit', () => {
      this.setEditForm(contact);
    }, 'secondary');
    const deleteButton = this.makeButton('Delete', () => {
      this.deleteContact(contact.id);
    }, 'danger');
    actionTd.appendChild(this.makeAction(editButton, deleteButton));
    row.appendChild(actionTd);
    return row;
  }

  display() {
    const tBody = document.getElementById('tbody');
    tBody.innerHTML = '';
    const contacts = Object.values(this.data.contacts);
    if (contacts.length < 1) {
      tBody.appendChild(this.makeEmptyRow('-- No Contacts --'));
    } else {
      contacts.forEach((contact, index) => {
        tBody.appendChild(this.makeRow(index + 1, contact));
      });
    }
  }

}

new PhoneBook();
