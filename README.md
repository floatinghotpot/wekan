# Wekan

[![Join the chat][gitter_badge]][gitter_chat]

Wekan is an open-source and collaborative kanban board application.

Whether you’re maintaining a personal todo list, planning your holidays with
some friends, or working in a team on your next revolutionary idea, Kanban
boards are an unbeatable tool to keep your things organized. They give you a
visual overview of the current state of your project, and make you productive by
allowing you to focus on the few items that matter the most.

[![Our roadmap is self-hosted on Wekan][screenshot]][roadmap]

Wekan supports most features you would expect of it including a real-time user
interface, cards comments, member assignations, customizable labels, filtered
views, and more.

Since it is a free software, you don’t have to trust us with your data and can
install Wekan on your own computer or server. In fact we encourage you to do
that by providing one-click installation on Heroku or [Sandstorm]
[sandstorm_market] platforms and verified [Docker][docker_image] images.

[![Deploy][heroku_button]][heroku_deploy]

[![Deploy to Scalingo][scalingo_button]][scalingo_deploy]

Wekan is released under the very permissive [MIT license](LICENSE), and made
with [Meteor](https://www.meteor.com).

[Our roadmap is self-hosted on Wekan][roadmap]

[screenshot]: http://i.imgur.com/cI4jW2h.png
[gitter_badge]: https://badges.gitter.im/Join%20Chat.svg
[gitter_chat]: https://gitter.im/wekan/wekan
[roadmap]: http://try.wekan.io/b/MeSsFJaSqeuo9M6bs/wekan-roadmap
[sandstorm_market]: https://oasis.sandstorm.io/appdemo/m86q05rdvj14yvn78ghaxynqz7u2svw6rnttptxx49g1785cdv1h
[docker_image]: https://hub.docker.com/r/mquandalle/wekan/
[heroku_button]: https://www.herokucdn.com/deploy/button.png
[heroku_deploy]: https://heroku.com/deploy?template=https://github.com/wekan/wekan/tree/master
[scalingo_button]: https://cdn.scalingo.com/deploy/button.svg
[scalingo_deploy]: https://my.scalingo.com/deploy?source=https://github.com/wekan/wekan#devel


## Cn-Wekan

Besides the features provided by author of Wekan (Maxime Quandalle), I (Raymond Xie) added following features (Thanks to the excellent architecture by author, it's quite easy to add new features):

### Improve Usability
* [x] Upload attachment from clipboard, drag & drop.
* [x] Preview attached pictures.
* [x] Translation of zh-CN.
* [x] On login form, auto show preferred language and allow selecting.
* [x] Support compact mode for mobile web
* [ ] Show card creater, allow filter by card creater.

### Batch Job
* [ ] Import template from another board (lists, members, labels), to quickly setup a board from template.
* [ ] Import all cards from another board/list（For example, import project plan to iteractoin board)

### Time Management
* [ ] Add man hour, due date, start date, finish date to card
* [ ] Display due date on mini card
* [ ] Configure list settings, when card drop into list, auto record start date, finish date.

### Push Notification
* [ ] Integrate with [QQ/smartqq-bot](https://github.com/floatinghotpot/qqbot)
* [ ] Input QQ number to user profile to accept notification.
* [ ] Configure list settings, when card drop into list, push notification to card creater, member, or list observer.
* [ ] When card assigned to member, or commented, push notification to card members.

### Data Migration
* [ ] Export/import cards with Excel CSV/TSV (Directly copy/paste in Excel)
* [ ] Import CSV file exported from Redmine

### Other
* Constantly merge the original branch, keep up to date
* I will also create PR of my features, and push to Maxime Quandalle ([v] marked above, means already merged)
