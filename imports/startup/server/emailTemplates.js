import { Accounts } from 'meteor/accounts-base';

Accounts.emailTemplates.from = 'TAP <tap@tap.com>';

Accounts.emailTemplates.resetPassword.text = (user, url) => {
  return 'Hello ' + user.profile.name.first + '\n\n'
  + 'To reset your password, simply click the link below. \n\n'
  + url 
}