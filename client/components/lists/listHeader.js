BlazeComponent.extendComponent({
  editTitle(evt) {
    evt.preventDefault();
    const newTitle = this.childComponents('inlinedForm')[0].getValue().trim();
    const list = this.currentData();
    if (newTitle) {
      list.rename(newTitle.trim());
    }
  },

  isWatching() {
    const list = this.currentData();
    return list.findWatcher(Meteor.userId());
  },

  events() {
    return [{
      'click .js-open-list-menu': Popup.open('listAction'),
      'click .js-unselect-list'() {
        Session.set('currentList', null);
      },
      submit: this.editTitle,
    }];
  },
}).register('listHeader');

let currentListId = null;

Template.listActionPopup.onRendered(function() {
  currentListId = this.data._id;
});

Template.listActionPopup.helpers({
  isWatching() {
    return this.findWatcher(Meteor.userId());
  },
});

Template.listActionPopup.events({
  'click .js-add-card'() {
    const listDom = document.getElementById(`js-list-${this._id}`);
    const listComponent = BlazeComponent.getComponentForElement(listDom);
    listComponent.openForm({ position: 'top' });
    Popup.close();
  },
  'click .js-list-subscribe'() {},
  'click .js-select-cards'() {
    const cardIds = this.cards().map((card) => card._id);
    MultiSelection.add(cardIds);
    Popup.close();
  },
  'click .js-import-cards-tsv': Popup.open('listImportCardsTsv'),
  'click .js-import-card-other-board': Popup.open('importCardFromOtherBoard'),
  'click .js-import-redminecsv': Popup.open('listImportRedmine'),
  'click .js-list-settings': Popup.open('listSettings'),
  'click .js-toggle-watch-list'() {
    const currentList = this;
    const level = currentList.findWatcher(Meteor.userId()) ? null : 'watching';
    Meteor.call('watch', 'list', currentList._id, level, (err, ret) => {
      if (!err && ret) Popup.close();
    });
  },
  'click .js-close-list'(evt) {
    evt.preventDefault();
    this.archive();
    Popup.close();
  },
});

BlazeComponent.extendComponent({
  template() {
    return 'importCardFromOtherBoardPopup';
  },

  boards() {
    return Boards.find({
      archived: false,
      'members.userId': Meteor.userId(),
    }, {
      sort: ['title'],
    });
  },

  events() {
    return [{
      'click .js-select-list-from-board'(...args) {
        const fromBoard = this.currentData();
        new SubsManager().subscribe('board', fromBoard._id);
        Popup.open('importCardFromOtherList').call(this, ...args);
      },
    }];
  },
}).register('importCardFromOtherBoardPopup');

BlazeComponent.extendComponent({
  template() {
    return 'importCardFromOtherListPopup';
  },

  lists() {
    const boardId = Template.parentData(2).data._id;
    return Lists.find({boardId}, { sort: ['sort'] });
  },

  events() {
    return [{
      'click .js-import-card-from-list'() {
        const toList = Lists.findOne(currentListId);
        const fromList = this.currentData();
        const toBoard = toList.board();
        fromList.cards().forEach((card) => {
          const newCard = _.omit(card, ['_id', 'listId', 'boardId', 'labelIds', '__proto__']);
          newCard.listId = toList._id;
          newCard.boardId = toList.boardId;
          newCard.labelIds = [];
          card.labels().forEach((label) => {
            const newLabel = toBoard.getLabel(label.name, label.color);
            if (newLabel) newCard.labelIds.push(newLabel._id);
          });
          Cards.insert( newCard );
        });
        Popup.close();
      },
    }];
  },
}).register('importCardFromOtherListPopup');

BlazeComponent.extendComponent({
  template() {
    return 'listSettingsPopup';
  },

  allStatus() {
    return Lists.simpleSchema()._schema.status.allowedValues;
  },

  list() {
    return Lists.findOne(currentListId);
  },

  noStatus() {
    const curList = this.list();
    return (!curList.status);
  },

  select(to) {
    const curList = this.list();
    this.allStatus().forEach((st) => {
      if(st === to) curList.setStatus(st);
    });
  },

  events() {
    return [{
      'click .js-select-none'() {
        this.select(null);
      },
      'click .js-select-todo'() {
        this.select('todo');
      },
      'click .js-select-doing'() {
        this.select('doing');
      },
      'click .js-select-done'() {
        this.select('done');
      },
    }];
  },
}).register('listSettingsPopup');

let csvRedmine = null;

BlazeComponent.extendComponent({
  template() {
    return 'listImportRedminePopup';
  },

  csvEncodings: () => {
    return ['utf8', 'gbk', 'big5'];
  },

  list() {
    return Lists.findOne(currentListId);
  },

  board() {
    return Boards.findOne(Session.get('currentBoard'));
  },

  getAdditionalData: () => {
    const listId = currentListId;
    const selector = `#js-list-${listId} .js-minicard:first`;
    const firstCardDom = $(selector).get(0);
    const sortIndex = Utils.calculateIndex(null, firstCardDom).base;
    const result = {listId, sortIndex};
    return result;
  },

  getDataGrid: (callback) => {
    if (!csvRedmine) return callback(null);

    const datamap = {};

    // all redmine field name should be defined in i18n for data mapping
    const currentUser = Meteor.user();
    if (currentUser && currentUser.profile && currentUser.profile.language) {
      const fields = 'number,project,type,parent,status,priority,title,owner,member,updatedat,category,version,startdate,duedate,manhour,spent,percent,createdat,finishdate,related,desc'.split(',');
      // #,Project,Tracker,Parent task,Status,Priority,Subject,Author,Assignee,Updated,Category,Target version,Start date,Due date,Estimated time,Spent time,% Done,Created,Closed,Related issues,Description
      const lang = currentUser.profile.language;
      const langFields = TAPi18n.__('redmine-csv-headers', {}, lang).split(',');
      if(fields.length === langFields.length) {
        for(let i=0; i<fields.length; i++) {
          datamap[ langFields[i] ] = fields[i];
        }
      }
    }

    // user can also use own data mapping file to handle fields & member names
    const maptext = $('textarea.js-select-mappingcsv').val();
    maptext.split('\n').forEach((line) => {
      const words = line.trim().split(',');
      if (words.length >= 2) {
        datamap[ words[0] ] = words[1];
      }
    });

    // now do data mapping if needed
    const csvEncoding = $('select.js-encodingcsv').val();
    window.Papa.parse(csvRedmine, {
      encoding: csvEncoding,
      newline: '\n',
      complete: (results) => {
        const rows = [];
        results.data.forEach((items) => {
          const row = [];
          items.forEach((item) => {
            const v = datamap[ item ];
            if (v) row.push(v);
            else row.push(item);
          });
          rows.push(row);
        });
        return callback(rows);
      },
    });

    return callback(null);
  },

  events() {
    return [{
      'change .js-select-redminecsv': (evt) => {
        FS.Utility.eachFile(evt, (f) => {
          csvRedmine = f;
        });
      },

      'change .js-select-mappingcsv': (evt) => {
        this.board().updateDataMapping($(evt.currentTarget).val());
      },

      'submit': (evt) => {
        evt.preventDefault();
        const self = this;
        this.getDataGrid((rows) => {
          if (!rows) {
            self.setError('error-json-malformed');
            return false;
          }

          // import batch cards will be more efficient on server-side
          Meteor.call('importCsvData', rows, self.getAdditionalData(), (err, res) => {
            if (err) {
              self.setError(err.error);
            } else {
              if (res && res.length) {
                res.forEach((cardId) => {
                  Filter.addException(cardId);
                });
              }
              self.onFinish(res);
            }
          });
        });
      },
    }];
  },

  onCreated() {
    this.error = new ReactiveVar('');
  },

  setError(error) {
    this.error.set(error);
  },

  onFinish() {
    Popup.close();
  },
}).register('listImportRedminePopup');
