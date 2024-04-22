import React from 'react';
import { Icon, BlockChooser } from '@plone/volto/components';
import {
  blockHasValue,
  buildStyleClassNamesFromData,
} from '@plone/volto/helpers';
import { Button } from 'semantic-ui-react';
import includes from 'lodash/includes';
import isBoolean from 'lodash/isBoolean';
import { defineMessages, injectIntl } from 'react-intl';
import cx from 'classnames';
import config from '@plone/volto/registry';
import { doesNodeContainClick } from 'semantic-ui-react/dist/commonjs/lib';

import dragSVG from '@plone/volto/icons/drag.svg';
import addSVG from '@plone/volto/icons/circle-plus.svg';
import trashSVG from '@plone/volto/icons/delete.svg';

const messages = defineMessages({
  unknownBlock: {
    id: 'Unknown Block',
    defaultMessage: 'Unknown Block {block}',
  },
  delete: {
    id: 'delete',
    defaultMessage: 'delete',
  },
});

class EditBlockWrapper extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      addNewBlockOpened: false,
    };
  }

  componentDidMount() {
    document.addEventListener('mousedown', this.handleClickOutside, false);
  }

  componentWillUnmount() {
    document.removeEventListener('mousedown', this.handleClickOutside);
  }

  handleClickOutside = (e) => {
    if (
      this.blockNode.current &&
      doesNodeContainClick(this.blockNode.current, e)
    )
      return;

    if (this.state.addNewBlockOpened) {
      this.setState({
        addNewBlockOpened: false,
      });
      return true;
    }
  };

  blockNode = React.createRef();

  render() {
    const { intl, blockProps, draginfo, extraControls, disabled, children } =
      this.props;

    const {
      allowedBlocks,
      block,
      data,
      onSelectBlock,
      onDeleteBlock,
      onMutateBlock,
      onInsertBlock,
      selected,
    } = blockProps;
    const type = data['@type'];
    const { disableNewBlocks } = data;
    const dragVisible = !data.fixed;
    const visible = selected;

    const required = isBoolean(data.required)
      ? data.required
      : includes(config.blocks.requiredBlocks, type);

    const styles = buildStyleClassNamesFromData(data.styles);

    // Get editing instructions from block settings or props
    let instructions = data?.instructions?.data || data?.instructions;
    if (!instructions || instructions === '<p><br/></p>') {
      instructions = '';
    }

    return (
      <div ref={this.blockNode}>
        <div
          ref={draginfo?.innerRef}
          {...(selected ? draginfo?.draggableProps : null)}
          className={cx(`block-editor-${data['@type']}`, styles, {
            [data.align]: data.align,
          })}
        >
          {(!selected || !visible || disabled) && (
            <div
              style={{
                display: 'none',
                // keep react-beautiful-dnd happy
              }}
              {...draginfo.dragHandleProps}
            ></div>
          )}
          {visible && (
            <div className="block-toolbar">
              {instructions ? extraControls : ''}

              {!disabled && (
                <>
                  <div
                    style={{
                      display: dragVisible ? 'inline-block' : 'none',
                    }}
                    {...draginfo.dragHandleProps}
                    className="drag handle wrapper-group-block"
                  >
                    <Button icon basic title="Drag and drop">
                      <Icon name={dragSVG} size="19px" />
                    </Button>
                  </div>

                  {!disableNewBlocks && !blockHasValue(data) && (
                    <Button
                      icon
                      basic
                      title="Add block"
                      onClick={() => {
                        this.setState({
                          addNewBlockOpened: !this.state.addNewBlockOpened,
                        });
                      }}
                      className="group-block-add-button"
                    >
                      <Icon name={addSVG} className="" size="19px" />
                    </Button>
                  )}
                  {!required && (
                    <Button
                      icon
                      basic
                      title="Remove block"
                      onClick={() => onDeleteBlock(block)}
                      className="delete-button-group-block"
                      aria-label={intl.formatMessage(messages.delete)}
                    >
                      <Icon name={trashSVG} size="19px" />
                    </Button>
                  )}
                  {this.state.addNewBlockOpened && (
                    <BlockChooser
                      onMutateBlock={(id, value) => {
                        onMutateBlock(id, value);
                        this.setState({ addNewBlockOpened: false });
                      }}
                      onInsertBlock={(id, value) => {
                        onSelectBlock(onInsertBlock(id, value));
                        this.setState({ addNewBlockOpened: false });
                      }}
                      currentBlock={block}
                      allowedBlocks={allowedBlocks}
                    />
                  )}
                </>
              )}
            </div>
          )}

          <div
            className={cx('ui drag block wrapper inner', type, {
              multiSelected: this.props.multiSelected,
            })}
          >
            {children}
          </div>
        </div>
      </div>
    );
  }
}

export default injectIntl(EditBlockWrapper);
