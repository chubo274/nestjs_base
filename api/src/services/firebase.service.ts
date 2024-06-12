import { Injectable } from '@nestjs/common';
import FirebaseAdmin from 'firebase-admin';
import { Message } from 'firebase-admin/lib/messaging/messaging-api';
import { FirebaseConfig } from 'src/common/firebase-admin-sdk.config';
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
    async firebaseMessaging(messages: Message[]) {
        const response = await FirebaseAdmin.messaging().sendEach(messages)

        return {
            successCount: response.successCount,
            failCount: response.failureCount,
        };
    }
}
