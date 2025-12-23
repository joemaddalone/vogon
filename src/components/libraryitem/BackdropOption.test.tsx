import { describe, it, expect, vi } from 'vitest';
import { render, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BackdropOption } from './BackdropOption';

describe('BackdropOption', () => {
  const posterUrl = 'https://example.com/poster.jpg';
  const previewUrl = 'https://example.com/preview.jpg';
  const source = 'TMDB';

  it('renders poster image and source text', () => {
    const { getByTestId, getByAltText } = render(
      <BackdropOption
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
    const img = getByAltText(previewUrl);
    expect(img).toBeInTheDocument();
  });

  it('shows current badge when isCurrent is true', () => {
    const { getByTestId, queryByTestId } = render(
      <BackdropOption
        posterUrl={posterUrl}
        isCurrent={true}
        isBusy={false}
        onSelect={vi.fn()}
      />
    );
    expect(getByTestId('current-backdrop')).toBeInTheDocument();
    expect(queryByTestId('select-backdrop')).toBeNull();
  });

  it('calls onSelect when button clicked', () => {
    const onSelect = vi.fn();
    const { getByTestId } = render(
      <BackdropOption
        posterUrl={posterUrl}
        isCurrent={false}
        isBusy={false}
        onSelect={onSelect}
      />
    );
    const button = getByTestId('select-backdrop');
    fireEvent.click(button);
    expect(onSelect).toHaveBeenCalled();
  });

  it('disables button when isBusy is true', () => {
    const onSelect = vi.fn();
    const { getByRole } = render(
      <BackdropOption
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
