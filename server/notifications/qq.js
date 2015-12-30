// notification service for QQ, IM services used by 600M people in China

// qqbot required, see: 
// https://github.com/floatinghotpot/qqbot

Meteor.startup(() => {
  const QQBOT_HOST = process.env.QQBOT_HOST || '';
  const QQBOT_PORT = process.env.QQBOT_PORT || 3200;
  if (!QQBOT_HOST) return;

  Notifications.subscribe('qq', (user, title, description, params) => {
    if (!user.profile.qq) return;
    if (!user.hasTag('notify-qq')) return;
    try {
      // add quote to make titles easier to read in email text
      const quoteParams = _.clone(params);
      ['card', 'list', 'oldList', 'board', 'comment'].forEach((key) => {
        if (quoteParams[key]) quoteParams[key] = `"${params[key]}"`;
      });
      const lang = user.getLanguage();

      const url = `http://${QQBOT_HOST}:${QQBOT_PORT}/send`;
      const qqbotParams = {
        type:'buddy',
        to: user.profile.qq,
        msg: `${params.user} ${TAPi18n.__(description, quoteParams, lang)}\n${params.url}`,
      };

      HTTP.post(url, { data: qqbotParams }, (err, res) => {
        if (!err && res) return;
      });
    } catch (e) {
      return;
    }
  });
});
