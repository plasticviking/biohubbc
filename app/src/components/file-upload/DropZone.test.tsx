import { fireEvent, render, waitFor } from '@testing-library/react';
import React from 'react';
import DropZone from './DropZone';

const onFiles = jest.fn();

const renderContainer = () => {
  return render(<DropZone onFiles={onFiles} acceptedFileExtensions=".txt" />);
};

describe('DropZone', () => {
  it('renders default instruction text', () => {
    const { getByTestId } = renderContainer();

    expect(getByTestId('dropzone-instruction-text').textContent).toEqual('Drag your files here, or Browse Files');
  });

  it('renders default maximum file size text', () => {
    const { getByTestId } = renderContainer();

    expect(getByTestId('dropzone-max-size-text').textContent).toEqual('Maximum file size: 50 MB');
  });

  it('renders default maximum file cunt text', () => {
    const { getByTestId } = renderContainer();

    expect(getByTestId('dropzone-max-files-text').textContent).toEqual('Maximum files: 10');
  });

  it('calls the `onFiles` callback when files are selected', async () => {
    const { getByTestId } = renderContainer();

    const testFile = new File(['test png content'], 'testpng.txt', { type: 'text/plain' });

    const dropZoneInput = getByTestId('drop-zone-input');

    fireEvent.change(dropZoneInput, { target: { files: [testFile] } });

    await waitFor(() => {
      expect(onFiles).toHaveBeenCalledWith([testFile], [], expect.any(Object));
    });
  });
});