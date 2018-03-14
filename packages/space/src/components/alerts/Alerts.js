import React from 'react';
import { connect } from 'react-redux';
import { compose, lifecycle } from 'recompose';
import { KinopsModule } from 'react-kinops-common';
import { Link } from 'react-router-dom';
import { List } from 'immutable';
import moment from 'moment';
import SVGInline from 'react-svg-inline';
import { PageTitle } from '../shared/PageTitle';
import wallyHappyImage from '../../images/wally-happy.svg';

import { Alert } from './Alert';

const { actions: kinopsActions } = KinopsModule;

const WallyEmptyMessage = ({ canEdit }) => {
  return (
    <div className="wally">
      <h5>No Alerts Right Now...</h5>
      <SVGInline svg={wallyHappyImage} />
      {canEdit && <h6>Add an alert by hitting the new button!</h6>}
    </div>
  );
};

const AlertsComponent = ({ alerts, loading, match, error, canEdit }) => {
  const selectedAlert = match.params.id;
  return (
    <div className="alerts-container">
      <PageTitle parts={['Alerts']} />

      {!loading && (
        <div className="alerts-content pane">
          <div>
            <div className="page-title-wrapper">
              <div className="page-title">
                <h3>
                  <Link to="/">home</Link> /
                </h3>
                <h1>Alerts</h1>
              </div>
              {canEdit && (
                <Link to="/alerts/new" className="btn btn-default">
                  Create New Alert
                </Link>
              )}
            </div>
            {error && <h3>There was a problem loading the alerts.</h3>}
            {!error &&
              alerts.size <= 0 && <WallyEmptyMessage canEdit={canEdit} />}
            {!error &&
              alerts.size > 0 && (
                <table className="alerts-table">
                  <thead>
                    <tr className="header">
                      <td width="25%">Title</td>
                      <td width="65%">Description</td>
                      {canEdit && (
                        <td className="actions" width="10%">
                          Actions
                        </td>
                      )}
                    </tr>
                  </thead>
                  <tbody>
                    {alerts.map(alert => (
                      <Alert
                        key={alert.id}
                        alert={alert}
                        active={alert.id === selectedAlert}
                      />
                    ))}
                  </tbody>
                </table>
              )}
          </div>
        </div>
      )}
    </div>
  );
};

export const mapStateToProps = ({ kinops }) => ({
  loading: kinops.alerts.loading,
  alerts: List(kinops.alerts.get('data'))
    .filter(
      alert =>
        !alert.values['End Date Time'] ||
        moment(alert.values['End Date Time']).isAfter(),
    )
    .filter(
      alert =>
        !alert.values['Start Date Time'] ||
        moment(alert.values['Start Date Time']).isBefore(),
    )
    .sortBy(alert =>
      moment(alert.values['Start Date Time'] || alert.createdAt).unix(),
    )
    .reverse(),
  error: kinops.alerts.error,
  canEdit: kinops.profile.spaceAdmin ? true : false,
});

export const mapDispatchToProps = {
  fetchAlerts: kinopsActions.fetchAlerts,
};

export const Alerts = compose(
  connect(mapStateToProps, mapDispatchToProps),
  lifecycle({
    componentWillMount() {
      this.props.fetchAlerts();
    },
  }),
)(AlertsComponent);
