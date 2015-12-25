Meteor.startup(() => {
  // XXX: print to console, for debug purpose only
  // Notifications.addSender('debug', (user, subject, text) => {
  //  console.log(`${user.getName()}\n${subject}\n${text}`);
  // });

  // send notification via email
  if (process.env.MAIL_URL && Email) {
    Notifications.addSender('email', (user, subject, text) => {
      try {
        Email.send({
          to: user.emails[0].address,
          from: Accounts.emailTemplates.from,
          subject,
          text,
        });
      } catch (e) {
        return;
      }
    });
  }

  // XXX: more notification services can be added here
  const QQBOT_HOST = process.env.QQBOT_HOST || '';
  const QQBOT_PORT = process.env.QQBOT_PORT || 3200;
  if (QQBOT_HOST && HTTP) {
    const url = `http://${QQBOT_HOST}:${QQBOT_PORT}/send`;
    Notifications.addSender('QQ', (user, subject, text) => {
      if (!user.profile || !user.profile.qq) return;
      const params = {
        type:'buddy',
        to: user.profile.qq,
        msg: `${subject}\n${text}`,
      };
      try {
        HTTP.post(url, { data: params }, (err, res) => {
          if (!err && res) return;
        });
      } catch (e) {
        return;
      }
    });
  }
});
