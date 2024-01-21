import React from 'react';

/**
 * @typedef {import("@storybook/react").Decorator} Decorator
 *
 * @typedef {Object} LayoutDecoratorConfig
 * @prop {string} [margin="1em"] The all-around margin CSS setting
 * @prop {string} [padding="0"] The all-around padding CSS setting
 * @prop {string} [width="auto"] The width CSS setting
 * @prop {string} [backgroundColor="white"] The background color CSS setting
 */

/**
 * Add a wrapper around the story to control some layout aspects like:
 * - Outer spacing
 * - BG color
 * - Width
 *
 * @param {LayoutDecoratorConfig} [config] The overrides for the layout wrapper default settings
 * @returns {Decorator} A Storybook Decorator
 */
const LayoutDecorator =
  ({ margin = '1em', padding = '0', width = 'auto', backgroundColor = 'white' } = {}) =>
  Story =>
    (
      <div style={{ margin, padding, width, backgroundColor }}>
        <Story />
      </div>
    );

export default LayoutDecorator;
