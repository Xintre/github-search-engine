import { render, screen } from '@testing-library/react';

import { OpenGHProfileButton } from './OpenGHProfileButton';
import React from 'react';
import userEvent from '@testing-library/user-event';

describe('OpenGHProfileButton', () => {
	it('should render a button', () => {
		// Arrange
		render(<OpenGHProfileButton />);

		// Assert
		const button = screen.getByRole('button');
		expect(button).toBeInTheDocument();
	});

	it('should open a new tab with the correct URL', async () => {
		// Arrange
		const user = userEvent.setup();

		render(<OpenGHProfileButton link="test" />);

		const openSpy = jest
			.spyOn(window, 'open')
			.mockImplementation(() => null);

		// Act
		const button = screen.getByRole('button');
		await user.click(button);

		// Assert
		expect(openSpy).toHaveBeenCalledWith(
			'test',
			'_blank',
			'noopener,noreferrer'
		);
	});

	it('should handle undefined username (be non-clickable)', async () => {
		// Arrange
		render(<OpenGHProfileButton />);

		// Assert
		const button = screen.getByRole('button');
		expect(button).toHaveStyle('pointer-events: none');
	});
});
