import { describe, it, expect, vi } from 'vitest';
import { render, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { PosterOption } from './PosterOption';


describe('PosterOption', () => {
	const posterUrl = 'https://example.com/poster.jpg';
	const previewUrl = 'https://example.com/preview.jpg';
	const source = 'TMDB';

	it('renders poster image and source text', () => {
		const { getByTestId, getByAltText } = render(
			<PosterOption
				index={0}
				posterUrl={posterUrl}
				previewUrl={previewUrl}
				source={source}
				isCurrent={false}
				isBusy={false}
				onSelect={vi.fn()}
			/>
		);
		expect(getByTestId('source')).toBeInTheDocument();
		expect(getByTestId('source')).toHaveTextContent(source);
	});

	it('shows current badge when isCurrent is true', () => {
		const { getByTestId, queryByTestId } = render(
			<PosterOption
				index={0}
				posterUrl={posterUrl}
				isCurrent={true}
				isBusy={false}
				onSelect={vi.fn()}
			/>
		);
		expect(getByTestId('current-poster')).toBeInTheDocument();
		expect(queryByTestId('select-poster')).toBeNull();
	});

	it('calls onSelect when button clicked', () => {
		const onSelect = vi.fn();
		const { getByTestId } = render(
			<PosterOption
				index={0}
				posterUrl={posterUrl}
				isCurrent={false}
				isBusy={false}
				onSelect={onSelect}
			/>
		);
		const button = getByTestId('select-poster');
		fireEvent.click(button);
		expect(onSelect).toHaveBeenCalled();
	});

	it('disables button when isBusy is true', () => {
		const onSelect = vi.fn();
		const { getByRole } = render(
			<PosterOption
				index={0}
				posterUrl={posterUrl}
				isCurrent={false}
				isBusy={true}
				onSelect={onSelect}
			/>
		);
		const button = getByRole('button', { name: /common.updating/i });
		expect(button).toBeDisabled();
	});
});
