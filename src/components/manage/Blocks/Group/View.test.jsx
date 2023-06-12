import React from 'react';
import View from './View';
import renderer from 'react-test-renderer';
import { render } from '@testing-library/react';
import { RenderBlocks } from '@plone/volto/components';
import '@testing-library/jest-dom/extend-expect';

jest.mock('@plone/volto/components', () => ({
  RenderBlocks: jest.fn(() => <div>RenderBlocks</div>),
}));

describe('View', () => {
  it('should render without crashing', () => {
    const props = {
      data: {},
      metadata: {},
      properties: {},
    };
    const component = renderer.create(<View {...props} />);

    const json = component.toJSON();
    expect(json).toMatchSnapshot();
  });

  it('renders with default tag and without crashing', () => {
    const props = {
      data: {},
      metadata: {},
      properties: {},
    };
    const { container } = render(<View {...props} />);
    expect(container.querySelector('div')).toBeInTheDocument();
  });

  it('renders with a custom tag and custom id', () => {
    const props = {
      data: {
        as: 'section',
        title: 'Test Title',
        data: { key: 'value' },
      },
      properties: {},
    };
    const { container } = render(<View {...props} />);
    expect(container.querySelector('section')).toBeInTheDocument();
    expect(container.querySelector('#test-title')).toBeInTheDocument();
  });

  it('renders RenderBlocks with correct props', () => {
    const props = {
      data: {
        as: 'section',
        title: 'Test Title',
        data: { key: 'value' },
      },
      metadata: { meta: 'data' },
      properties: { prop: 'erty' },
    };
    render(<View {...props} />);
    expect(RenderBlocks).toHaveBeenCalledWith(
      expect.objectContaining({
        metadata: props.metadata,
        content: props.data.data,
      }),
      {},
    );
  });
});
