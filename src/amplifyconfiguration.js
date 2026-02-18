import { Amplify } from 'aws-amplify';

Amplify.configure({
  Auth: {
    Cognito: {
      userPoolId: 'us-east-1_HrSgoMuNL',
      userPoolClientId: '6nd3tt2a6m98pca4j1jnops45u',
      region: 'us-east-1',
    }
  }
});

export default Amplify;
