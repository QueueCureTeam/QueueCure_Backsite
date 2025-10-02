const {
    CognitoUserPool,
    CognitoUserAttribute,
    CognitoUser
} = require("amazon-cognito-identity-js");

const poolData = {
    UserPoolId: process.env.USER_POOL_ID,
    ClientId: process.env.CLIENT_ID
};
const userPool = new CognitoUserPool(poolData);

exports.signUp = async (username, password, attributes) => {

    const attributeList = [
        new CognitoUserAttribute({ Name: "email", Value: attributes.email }),
        new CognitoUserAttribute({ Name: "given_name", Value: attributes.givenName }),
        new CognitoUserAttribute({ Name: "family_name", Value: attributes.familyName }),
        new CognitoUserAttribute({ Name: "birthdate", Value: attributes.birthdate }),
        new CognitoUserAttribute({ Name: "gender", Value: attributes.gender }),
        new CognitoUserAttribute({ Name: "custom:National_ID", Value: String(attributes.nationalId) }),
        new CognitoUserAttribute({ Name: "custom:Phone_Number", Value: attributes.phoneNumber })
    ];
    return new Promise((resolve, reject) => {
        userPool.signUp(username, password, attributeList, null, (err, result) => {
            if (err) return reject(err);
            resolve(result.user.getUsername());
        });
    });
};

exports.confirmUser = (username, code) => {
    return new Promise((resolve, reject) => {
        const userData = { Username: username, Pool: userPool };
        const cognitoUser = new CognitoUser(userData);

        cognitoUser.confirmRegistration(code, true, (err, result) => {
            if (err) {
                return reject(new Error(clientMessage));
            }

            resolve(result);
        });
    });
};
