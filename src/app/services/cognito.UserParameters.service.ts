import { Injectable } from '@angular/core';
import { Callback, CognitoUtil } from './cognitoUtil.service';

@Injectable()
export default class UserParametersService {
    static getParameters(callback: Callback) {
        const cognitoUser = CognitoUtil.getCurrentUser();

        if (cognitoUser !== null) {
            cognitoUser.getSession(function paramsServiceGetSession(err, session) {
                if (err) {
                    console.log('Could not retrieve the user.');
                } else {
                    cognitoUser.getUserAttributes(function paramsServiceGetAtts(error, result) {
                        if (error) {
                            console.log(`Error in parameters: ${error}`);
                        } else {
                            callback.callbackWithParam(result);
                        }
                    });
                }
            });
        } else {
            callback.callbackWithParam(null);
        }
    }

    getParameter(name: string, callback: Callback) {}
}
