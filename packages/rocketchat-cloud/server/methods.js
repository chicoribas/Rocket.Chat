import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';

import { retrieveRegistrationStatus } from './functions/retrieveRegistrationStatus';
import { connectWorkspace } from './functions/connectWorkspace';
import { getOAuthAuthorizationUrl } from './functions/getOAuthAuthorizationUrl';
import { finishOAuthAuthorization } from './functions/finishOAuthAuthorization';

Meteor.methods({
	'cloud:checkRegisterStatus'() {
		if (!Meteor.userId()) {
			throw new Meteor.Error('error-invalid-user', 'Invalid user', { method: 'cloud:checkRegisterStatus' });
		}

		if (!RocketChat.authz.hasPermission(Meteor.userId(), 'manage-cloud')) {
			throw new Meteor.Error('error-not-authorized', 'Not authorized', { method: 'cloud:checkRegisterStatus' });
		}

		return retrieveRegistrationStatus();
	},
	'cloud:updateEmail'(email) {
		check(email, String);

		if (!Meteor.userId()) {
			throw new Meteor.Error('error-invalid-user', 'Invalid user', { method: 'cloud:updateEmail' });
		}

		if (!RocketChat.authz.hasPermission(Meteor.userId(), 'manage-cloud')) {
			throw new Meteor.Error('error-not-authorized', 'Not authorized', { method: 'cloud:updateEmail' });
		}

		RocketChat.models.Settings.updateValueById('Organization_Email', email);
	},
	'cloud:connectWorkspace'(token) {
		check(token, String);

		if (!Meteor.userId()) {
			throw new Meteor.Error('error-invalid-user', 'Invalid user', { method: 'cloud:connectServer' });
		}

		if (!RocketChat.authz.hasPermission(Meteor.userId(), 'manage-cloud')) {
			throw new Meteor.Error('error-not-authorized', 'Not authorized', { method: 'cloud:connectServer' });
		}

		return connectWorkspace(token);
	},
	'cloud:getOAuthAuthorizationUrl'() {
		if (!Meteor.userId()) {
			throw new Meteor.Error('error-invalid-user', 'Invalid user', { method: 'cloud:connectServer' });
		}

		if (!RocketChat.authz.hasPermission(Meteor.userId(), 'manage-cloud')) {
			throw new Meteor.Error('error-not-authorized', 'Not authorized', { method: 'cloud:connectServer' });
		}

		return getOAuthAuthorizationUrl();
	},
	'cloud:finishOAuthAuthorization'(code, state) {
		check(code, String);
		check(state, String);

		if (!Meteor.userId()) {
			throw new Meteor.Error('error-invalid-user', 'Invalid user', { method: 'cloud:finishOAuthAuthorization' });
		}

		if (!RocketChat.authz.hasPermission(Meteor.userId(), 'manage-cloud')) {
			throw new Meteor.Error('error-not-authorized', 'Not authorized', { method: 'cloud:connectServer' });
		}

		return finishOAuthAuthorization(code, state);
	},
});
