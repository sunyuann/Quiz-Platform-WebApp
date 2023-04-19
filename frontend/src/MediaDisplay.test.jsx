import React from 'react';
import { render, screen } from '@testing-library/react';
import MediaDisplay from './components/MediaDisplay';

describe('Test MediaDisplay component', () => {
  it('Show nothing if mediaType is not url or image', () => {
    const { container } = render(<MediaDisplay />);
    expect(container).toBeEmptyDOMElement();
  });

  it('video if mediaType is url', () => {
    const src = 'fwesvsdf';
    render(<MediaDisplay mediaType={'url'} media={src} />);
    const node = screen.getByTitle('Question video')
    expect(node).toBeInTheDocument();
    expect(node.src.includes(src)).toBe(true);
  });

  it('img if mediaType is image', () => {
    const src = 'fwesvsdf';
    render(<MediaDisplay mediaType={'image'} media={src} />);
    const node = screen.getByRole('img');
    expect(node).toBeInTheDocument();
    expect(node.src.includes(src)).toBe(true);
  });
})
