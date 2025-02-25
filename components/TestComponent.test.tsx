import '@testing-library/jest-dom';

import { render, screen } from '@testing-library/react';

import { TestComponent } from './TestComponent';

test('loads and displays greeting', async () => {
	// Arrange
	render(<TestComponent />);

	// Act
	const text = await screen.findByTestId('hello-text');

	// Assert
	expect(text).toHaveTextContent('Hello!');
});
