import NodeRSA from 'node-rsa';

Meteor.startup(function() {
	const { FederationKeys } = RocketChat.models;

	let federationPublicKey;

	// Create key pair if needed
	if (!FederationKeys.getPublicKey()) {
		console.log('[federation] Generating key pairs');

		const key = new NodeRSA({ b: 512 });
		key.generateKeyPair();

		federationPublicKey = key.exportKey('pkcs1-public-pem');
	} else {
		federationPublicKey = FederationKeys.getPublicKey();
	}

	RocketChat.settings.addGroup('Federation', function() {
		this.add('FEDERATION_Enabled', false, {
			type: 'boolean',
			i18nLabel: 'Enabled',
			i18nDescription: 'FEDERATION_Enabled',
			alert: 'FEDERATION_Enabled_Alert',
			public: true,
		});

		this.add('FEDERATION_Domain', '', {
			group: 'Peer',
			type: 'string',
			i18nLabel: 'FEDERATION_Domain',
			i18nDescription: 'FEDERATION_Domain_Description',
			alert: 'FEDERATION_Domain_Alert',
		});

		this.add('FEDERATION_Public_Key', federationPublicKey, {
			group: 'Peer',
			readonly: true,
			type: 'string',
			multiline: true,
			i18nLabel: 'FEDERATION_Public_Key',
			i18nDescription: 'FEDERATION_Public_Key_Description',
		});

		this.add('FEDERATION_Hub_URL', 'https://hub.rocket.chat', {
			group: 'Federation Hub',
			type: 'string',
			i18nLabel: 'FEDERATION_Hub_URL',
			i18nDescription: 'FEDERATION_Hub_URL_Description',
		});

		this.add('FEDERATION_Discovery_Method', false, {
			type: 'select',
			values: [{
				key: 'dns',
				i18nLabel: 'DNS',
			}, {
				key: 'hub',
				i18nLabel: 'Hub',
			}],
			i18nLabel: 'FEDERATION_Discovery_Method',
			i18nDescription: 'FEDERATION_Discovery_Method_Description',
			public: true,
		});

	});
});