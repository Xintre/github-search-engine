import { IconButton, Tooltip } from '@mui/material';

import { GitHub } from '@mui/icons-material';

export type OpenGHProfileButtonProps = {
	link?: string;
};

export function OpenGHProfileButton({ link }: OpenGHProfileButtonProps) {
	return (
		<Tooltip title="Open in new tab" placement="right" arrow>
			<IconButton
				disabled={!link}
				onClick={() => {
					window.open(link, '_blank', 'noopener,noreferrer');
				}}
			>
				<GitHub />
			</IconButton>
		</Tooltip>
	);
}
