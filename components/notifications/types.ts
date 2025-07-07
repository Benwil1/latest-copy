export type NotificationType = 'match' | 'message' | 'apartment' | 'system';

export interface Notification {
	id: string;
	type: NotificationType;
	title: string;
	message: string;
	timestamp: string;
	isRead: boolean;
	avatar?: string;
	userName?: string;
	actionUrl?: string;
}
