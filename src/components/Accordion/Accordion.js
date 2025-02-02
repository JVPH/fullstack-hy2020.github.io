import './Accordion.scss';

import React, { Component } from 'react';

import { BodyText } from '../BodyText/BodyText';
import { Link } from 'gatsby';
import PropTypes from 'prop-types';
import ReactGA from 'react-ga';
import snakeCase from 'lodash/fp/snakeCase';

ReactGA.initialize('UA-135975842-1');

class Accordion extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isOpened: false,
    };
  }

  componentDidMount() {
    this.props.initiallyOpened && this.setState({ isOpened: true });
  }

  handleClick() {
    const { isOpened } = this.state;
    const { title, track } = this.props;

    this.setState({ isOpened: !isOpened }, () => {
      track &&
        ReactGA.event({
          category: 'FAQ',
          action: `${title} ${!isOpened ? 'expanded' : 'closed'}`,
        });
    });
  }

  render() {
    const {
      title,
      content,
      className,
      containerClassName,
      list,
      titleStyle,
      selectedItem,
    } = this.props;
    const { isOpened } = this.state;

    const identifier = snakeCase(title);

    return (
      <div
        className={`accordion__container col-8 push-right-1 ${containerClassName}`}
      >
        <button
          className={`accordion accordion__title ${
            isOpened ? 'active' : ''
          } ${className}`}
          style={titleStyle}
          aria-controls={identifier}
          aria-expanded={isOpened}
          onClick={() => this.handleClick()}
        >
          {title}
        </button>
        {isOpened && (
          <div className="panel" id={identifier}>
            {content && (
              <BodyText className="col-8 push-right-1" text={content} />
            )}
            {list && (
              <ul>
                {list.map(l => (
                  <li
                    key={l.text}
                    className={selectedItem === l.id ? 'selected' : undefined}
                  >
                    <Link to={l.href}>{l.text}</Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>
    );
  }
}

Accordion.propTypes = {
  title: PropTypes.string.isRequired,
  track: PropTypes.bool,
  content: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
  list: PropTypes.array,
  className: PropTypes.string,
  containerClassName: PropTypes.string,
  initiallyOpened: PropTypes.bool,
  titleStyle: PropTypes.object,
  selectedItem: PropTypes.string
};

Accordion.defaultProps = {
  className: '',
  track: false,
  containerClassName: '',
  initiallyOpened: false,
  titleStyle: {},
};

export default Accordion;
