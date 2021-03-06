import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import Measure from 'react-measure';

import { Col, Row, SparklineChart } from 'patternfly-react';

import { MEDIA_QUERY_SM } from '../../../utils';

import { InlineLoading } from '../../Loading';
import { NOT_AVAILABLE } from './strings';

export class UtilizationItem extends React.PureComponent {
  state = {
    dimensions: {
      width: -1,
    },
  };

  onResize = contentRect => {
    this.setState({ dimensions: contentRect.bounds });
  };

  render() {
    const { id, title, data, maxY, unit, isLoading, LoadingComponent } = this.props;
    const { width } = this.state.dimensions;

    const axis = {
      y: {
        show: true,
        padding: {
          top: 0,
          bottom: 0,
        },
        tick: {
          count: 3,
          format: v => `${v} ${unit}`,
        },
      },
      x: {
        show: false,
      },
    };
    if (maxY) {
      axis.y.max = maxY;
    }

    let actual;
    let chart = NOT_AVAILABLE;
    if (isLoading) {
      chart = <LoadingComponent />;
    } else if (data) {
      const chartData = {
        columns: [[unit, ...data.map(val => val.toFixed(1))]],
        unload: true,
        type: 'area',
      };
      actual = `${Math.round(data[data.length - 1])} ${unit}`;
      chart = <SparklineChart id={id} data={chartData} axis={axis} unloadBeforeLoad />;
    }

    let topClass;
    let rows;
    if (width < MEDIA_QUERY_SM) {
      topClass = 'kubevirt-utilization__item-narrow';
      rows = (
        <Fragment>
          <Row>
            <Col lg={6} md={6} sm={6} xs={6}>
              {title}
            </Col>
            <Col className="kubevirt-utilization__item-actual" lg={6} md={6} sm={6} xs={6}>
              {actual}
            </Col>
          </Row>
          <Row>
            <Col className="kubevirt-utilization__item-narrow-chart">{chart}</Col>
          </Row>
        </Fragment>
      );
    } else {
      topClass = 'kubevirt-utilization__item';
      rows = (
        <Row>
          <Col lg={2} md={2} sm={2} xs={2}>
            {title}
          </Col>
          <Col className="kubevirt-utilization__item-actual" lg={3} md={3} sm={3} xs={3}>
            {actual}
          </Col>
          <Col className="kubevirt-utilization__item-chart" lg={7} md={7} sm={7} xs={7}>
            {chart}
          </Col>
        </Row>
      );
    }

    return (
      <Measure bounds onResize={this.onResize}>
        {({ measureRef }) => (
          <div ref={measureRef} className={topClass}>
            {rows}
          </div>
        )}
      </Measure>
    );
  }
}

UtilizationItem.defaultProps = {
  maxY: null,
  data: null,
  LoadingComponent: InlineLoading,
  isLoading: false,
};

UtilizationItem.propTypes = {
  id: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  data: PropTypes.array,
  unit: PropTypes.string.isRequired,
  maxY: PropTypes.number,
  LoadingComponent: PropTypes.oneOfType([PropTypes.node, PropTypes.func]),
  isLoading: PropTypes.bool,
};
