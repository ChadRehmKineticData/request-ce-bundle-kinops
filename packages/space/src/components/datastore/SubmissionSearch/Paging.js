import React, { Fragment } from 'react';

import { connect } from 'react-redux';
import { push } from 'connected-react-router';
import { compose, withHandlers } from 'recompose';

import {
  actions,
  selectSubmissionPage,
  DATASTORE_LIMIT,
} from '../../../redux/modules/datastore';

const getPageText = (pageTokens, nextPageToken, submissions) => {
  let pages = pageTokens.size + 1;
  const initialOffset = submissions.size === 1 ? 0 : 1;

  const bottom = pages > 1 ? pages * DATASTORE_LIMIT + 1 : pages;
  const top = nextPageToken
    ? // Has more pages
      pages > 1 ? (pages + 1) * DATASTORE_LIMIT : pages * DATASTORE_LIMIT
    : // Does not have more pages.
      pages > 1
      ? pages * DATASTORE_LIMIT + initialOffset + submissions.size
      : submissions.size;

  return ` ${bottom} to ${top}`;
};

const PagingComponent = ({
  submissions,
  allSubmissions,
  nextPageToken,
  pageTokens,
  handleNextThousandPage,
  handlePrevThousandPage,
}) =>
  (nextPageToken !== null || pageTokens > 0) && (
    <Fragment>
      <div className="search-lookup-fotter">
        {(pageTokens.size > 0 || nextPageToken !== null) && (
          <span className="search-lookup-error">
            {`The Datastore contains too many records to display at one time.
      Please enter additional search criteria to narrow down the
      results, or use the buttons below the table to navigate between
      chunks of ${DATASTORE_LIMIT} records.`}
          </span>
        )}
      </div>
      <div className="datastore-top-pagination">
        <button
          className="btn btn-primary"
          disabled={pageTokens.size === 0}
          onClick={handlePrevThousandPage}
        >
          <span className="fa fa-fw fa-caret-left" />
          Previous 1000
        </button>
        <span>
          <strong>Sorting &amp; Filtering</strong>
          {submissions.size > 0
            ? getPageText(pageTokens, nextPageToken, allSubmissions)
            : ''}
        </span>
        <button
          className="btn btn-primary"
          disabled={nextPageToken === null}
          onClick={handleNextThousandPage}
        >
          Next 1000
          <span className="fa fa-fw fa-caret-right" />
        </button>
      </div>
    </Fragment>
  );

export const mapStateToProps = state => ({
  submissions: selectSubmissionPage(state),
  allSubmissions: state.datastore.submissions,
  pageTokens: state.datastore.pageTokens,
  nextPageToken: state.datastore.nextPageToken,
  simpleSearchActive: state.datastore.simpleSearchActive,
});

export const mapDispatchToProps = {
  push,
  fetchSubmissionsAdvanced: actions.fetchSubmissionsAdvanced,
  fetchSubmissionsSimple: actions.fetchSubmissionsSimple,
  pushPageToken: actions.pushPageToken,
  popPageToken: actions.popPageToken,
  setNextPageToken: actions.setNextPageToken,
  setPageOffset: actions.setPageOffset,
};

const handleNextThousandPage = ({
  simpleSearchActive,
  fetchSubmissionsSimple,
  fetchSubmissionsAdvanced,
}) => () => {
  simpleSearchActive ? fetchSubmissionsSimple() : fetchSubmissionsAdvanced();
};

const handlePrevThousandPage = ({
  setNextPageToken,
  popPageToken,
  pageTokens,
  fetchSubmissions,
}) => () => {
  popPageToken();
  fetchSubmissions();
};

export const Paging = compose(
  connect(mapStateToProps, mapDispatchToProps),
  withHandlers({
    handlePrevThousandPage,
    handleNextThousandPage,
  }),
)(PagingComponent);
