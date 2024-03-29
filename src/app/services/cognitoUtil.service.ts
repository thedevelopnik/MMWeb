import { Injectable } from '@angular/core';

declare let AWS: any;
declare let AWSCognito: any;

export interface CognitoCallback {
    cognitoCallback(message: string, result: any): void;
}

export interface LoggedInCallback {
    isLoggedIn(message: string, loggedIn: boolean): void;
}

export interface Callback {
    callback(): void;
    callbackWithParam(result: any): void;
}

@Injectable()
export class CognitoUtil {
    public static _REGION = 'us-east-1';

    public static _IDENTITY_POOL_ID = 'us-east-1:1aad2c04-bdfd-46e3-becd-bd12f1aeb73a';
    public static _USER_POOL_ID = 'us-east-1_ANxSTN6XS';
    public static _CLIENT_ID = '61hk09r83e3vhcgu5pner49q3v';

    public static _POOL_DATA = {
        UserPoolId: CognitoUtil._USER_POOL_ID,
        ClientId: CognitoUtil._CLIENT_ID
    }

    public static getUserPool() {
        console.log('getting user pool')
        const pool = new AWSCognito.CognitoIdentityServiceProvider.CognitoUserPool(CognitoUtil._POOL_DATA);
        return pool
    }

    public static getCurrentUser() {
        return CognitoUtil.getUserPool().getCurrentUser();
    }

    public static getCognitoIdentity(): string {
        console.log('getting cognito identity')
        return AWS.config.credentials.identityId;
    }

    public static getAccessToken(callback: Callback): void {
        if (callback === null) {
            throw('callback in getAccessToken is null ... returning')
        }
        CognitoUtil.getCurrentUser().getSession(function getSessionCallback(err, session) {
            if (err) {
                console.log(`Can't set the credentials: ${err}`);
                callback.callbackWithParam(null);
            } else {
                if (session.isValid()) {
                  callback.callbackWithParam(session.getAccessToken().getJwtToken());
                }
            }
        });
    }

    public static getIdToken(callback: Callback): void {
      if (callback === null) {
        throw('callback in getIdToken is null ... returning');
      }
      CognitoUtil.getCurrentUser().getSession(function getSessionCallback(err, session) {
        if (err) {
          console.log(`Can't set the credentials: ${err}`);
          callback.callbackWithParam(null)
        } else {
          if (session.isValid()) {
            console.log('getting jwt token')
            callback.callbackWithParam(session.getIdToken().getJwtToken());
          } else {
            console.log(`Got the id token, but the session isn't valid`);
          }
        }
      });
    }

    public static getRefreshToken(callback: Callback): void {
      if (callback === null) {
        throw(`callback in getRefreshToken is null ... returning`);
      }
      CognitoUtil.getCurrentUser().getSession(function getSessionCallback(err, session) {
        if (err) {
          console.log(`Can't set the credentials: ${err}`);
          callback.callbackWithParam(null)
        } else {
          if (session.isValid()) {
            callback.callbackWithParam(session.getRefreshToken());
          }
        }
      })
    }
}
