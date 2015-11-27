Meteor.subscribe('boards');

BlazeLayout.setRoot('body');

// see: https://github.com/softwarerero/meteor-accounts-t9n#language-codes-and-contributions
const mapTagi18nToT9n = {
  'es-ES': 'es_ES',
  'no-NB': 'no_NB',
  'pt-BR': 'pt',
  'pt-PT': 'pt_PT',
  'zh-CN': 'zh_cn',
  'zh-HK': 'zh_hk',
  'zh-TW': 'zh_tw',
};

const i18nTagToT9n = (i18nTag) => {
  return mapTagi18nToT9n[i18nTag] || i18nTag.split('-')[0];
};

Template.userFormsLayout.onRendered(() => {
  const i18nTag = navigator.language;
  if (i18nTag) {
    T9n.setLanguage(i18nTagToT9n(i18nTag));
  }
  EscapeActions.executeAll();
});

Template.userFormsLayout.helpers({
  languages() {
    return _.map(TAPi18n.getLanguages(), (lang, tag) => {
      const name = lang.name;
      return { tag, name };
    });
  },

  isCurrentLanguage() {
    const t9nTag = i18nTagToT9n(this.tag);
    const curLang = T9n.getLanguage() || 'en';
    return t9nTag === curLang;
  },
});

Template.userFormsLayout.events({
  'change .js-userform-set-language'(evt) {
    const i18nTag = $(evt.currentTarget).val();
    T9n.setLanguage(i18nTagToT9n(i18nTag));
    evt.preventDefault();
  },
});

Template.defaultLayout.events({
  'click .js-close-modal': () => {
    Modal.close();
  },
});
