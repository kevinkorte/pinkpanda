import { Accounts } from 'meteor/accounts-base';

Accounts.emailTemplates.siteName = "SafeTAP";
Accounts.emailTemplates.from = 'SafeTAP <safetap@safetap.net>';

Accounts.emailTemplates.resetPassword.text = (user, url) => {
  return 'Hello ' + user.profile.name.first + '\n\n'
  + 'To reset your password, simply click the link below. \n\n'
  + url 
}

Accounts.emailTemplates.verifyEmail = {
  subject() {
    return 'Activate your account!'
  },
  text(user, url) {
    return `Hey ${user.profile.name.first}! Verify your e-mail by following this link: ${url}`;
  }
}