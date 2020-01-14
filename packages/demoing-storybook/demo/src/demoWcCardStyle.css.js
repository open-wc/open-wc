/* eslint-disable import/no-extraneous-dependencies */
import { css } from 'lit-element';

export const demoWcCardStyle = css`
  :host {
    display: block;
    margin: 20px;
    position: relative;
    width: 250px;
    height: 200px;
    border-radius: 10px;
    transform-style: preserve-3d;
    transition: all 0.8s ease;
    font-family: sans-serif;
    --demo-wc-card-font-color: #2c3e50;
    --demo-wc-card-header-color-front: #217ff9;
    --demo-wc-card-header-color-back: #9b35fa;
    --demo-wc-card-header-font-size: 16px;
  }

  .header {
    padding: 10px;
    text-transform: uppercase;
    margin: -10px;
    color: white;
    font-weight: bold;
    font-size: var(--demo-wc-card-header-font-size);
    text-align: center;
  }

  .content {
    padding: 20px 10px 0 10px;
    flex-grow: 1;
    color: var(--demo-wc-card-font-color);
  }

  .footer {
    display: flex;
  }

  dl {
    margin: 0;
    text-align: left;
  }

  dd {
    margin-left: 15px;
  }

  button {
    border-radius: 15px;
    width: 30px;
    height: 30px;
    background: #fff;
    border: 1px solid #ccc;
    color: #000;
    font-size: 21px;
    line-height: 27px;
    font-weight: bold;
    cursor: pointer;
    margin: 5px;
  }

  .note {
    flex-grow: 1;
    color: #666;
    font-size: 16px;
    font-weight: bold;
    text-align: left;
    padding-top: 15px;
  }

  :host([back-side]) {
    transform: rotateY(180deg);
  }

  #front,
  #back {
    position: absolute;
    width: 250px;
    box-sizing: border-box;
    box-shadow: 0px 4px 10px 0px rgba(0, 0, 0, 0.25);
    padding: 10px;
    display: flex;
    flex-flow: column;
    top: 0;
    left: 0;
    height: 100%;
    border-radius: 10px;
    backface-visibility: hidden;
    overflow: hidden;
  }

  #front {
    background: #ededed;
  }

  #front .header {
    background-color: var(--demo-wc-card-header-color-front);
  }

  #back .header {
    background-color: var(--demo-wc-card-header-color-back);
  }

  #back {
    background: #ededed;
    text-align: center;
    transform: rotateY(180deg);
  }
`;
