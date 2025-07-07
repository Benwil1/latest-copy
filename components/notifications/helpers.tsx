import React from 'react';
import { Bell, Heart, MessageSquare, Building } from 'lucide-react';
import type { NotificationType } from './types';

export function getNotificationIcon(type: NotificationType): React.ReactNode {
	switch (type) {
		case 'match':
			return <Heart className="h-5 w-5 text-red-500" />;
		case 'message':
			return <MessageSquare className="h-5 w-5 text-blue-500" />;
		case 'apartment':
			return <Building className="h-5 w-5 text-green-500" />;
		case 'system':
			return <Bell className="h-5 w-5 text-gray-500" />;
		default:
			return <Bell className="h-5 w-5" />;
	}
}
