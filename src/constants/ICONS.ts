import { Users } from '../enum/Chat';
import { EnvironmentMode } from '../enum/EnvironmentMode';

export const USERS_ICON_URL: { [key in Users]: string } = {
	[Users.ARCHITECT]: '/assets/icons/Users/architect.png',
	[Users.BUILDER]: '/assets/icons/Users/builder.png',
	[Users.SYSTEM]: '/assets/icons/Users/settings.png',
	[Users.NEBULA]: '/assets/icons/Users/robot.png',
	[Users.UNKNOWN]: '/assets/icons/Users/unknown.png',
};

export const ENVIRONMENT_MODE_ICON_URL: { [key in EnvironmentMode]: string } = {
	[EnvironmentMode.COCORELI]: '/assets/icons/environmentMode/cocoreli.png',
	[EnvironmentMode.MINECRAFT]: '/assets/icons/environmentMode/minecraft.png',
};
