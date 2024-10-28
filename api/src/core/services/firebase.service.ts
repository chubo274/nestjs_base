import { Injectable } from '@nestjs/common';
import FirebaseAdmin from 'firebase-admin';
import { MessagingPayload, TokenMessage } from 'firebase-admin/lib/messaging/messaging-api';
import { FirebaseConfig } from 'src/core/services/firebase-admin-sdk.config';

export enum TopicNoti {
  TopicForAllUser = 'TopicForAllUser',
}
@Injectable()
export class FirebaseService {
  constructor() {
    FirebaseAdmin.initializeApp({
      credential: FirebaseAdmin.credential.cert({
        clientEmail: FirebaseConfig.client_email,
        projectId: FirebaseConfig.project_id,
        privateKey: FirebaseConfig.private_key,
      }),
    });
  }

  async subscribeToTopic(tokens: string[], topic: string) {
    const _tokens: string[] = tokens.filter((value) => Boolean(value))
    try {
      await FirebaseAdmin.messaging().subscribeToTopic(_tokens, topic)
      return true
    } catch (error) {
      console.error('Error subscribeToTopic:', error);
      return false
    }
  }

  async unsubscribeFromTopic(tokens: string[], topic: string) {
    const _tokens: string[] = tokens.filter((value) => Boolean(value))
    try {
      await FirebaseAdmin.messaging().unsubscribeFromTopic(_tokens, topic)
      return true
    } catch (error) {
      console.error('Error unsubscribeFromTopic:', error);
      return false
    }
  }

  async firebaseSendTopic(messages: MessagingPayload, tokens: string[], topic: string) {
    try {
      await this.subscribeToTopic(tokens, topic)
      const res = await FirebaseAdmin.messaging().sendToTopic(topic, messages)
      console.info('firebaseSend Topic res: ', res);
      await this.unsubscribeFromTopic(tokens, topic)
      return true
    } catch (error) {
      console.error('send topic error: ', error);
      return false
    }
  }

  async firebaseDeleteInstance(fcmToken: string) {
    try {
      // await FirebaseAdmin.messaging().deleteInstanceId(fcmToken);
      return true
    } catch (error) {
      console.error('firebase delete instance error: ', error);
      return false
    }
  }

  async firebaseSendEach(messages: TokenMessage, tokens: string[]) {
    const _tokens: string[] = tokens.filter((value) => Boolean(value))
    const listMess = _tokens.map((token) => {
      const value = {
        ...messages,
        token,
      }
      if (!value?.notification?.title) delete value?.notification?.title
      if (!value?.notification?.body) delete value?.notification?.body
      if (!value?.notification?.imageUrl) delete value?.notification?.imageUrl
      return value
    })

    if (listMess.length > 0) {
      const response = await FirebaseAdmin.messaging().sendEach(listMess)
      console.info('firebaseSend Each res: ', response);

      return {
        successCount: response.successCount,
        failCount: response.failureCount,
      };
    }
    return true
  }
}
