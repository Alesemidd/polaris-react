import React from 'react';

import {classNames} from '../../utilities/css';
import {useFeatures} from '../../utilities/features';
import {useI18n} from '../../utilities/i18n';
import {useMediaQuery} from '../../utilities/media-query';
import {DisplayText} from '../DisplayText';
import {TextStyle} from '../TextStyle';
import {SkeletonDisplayText} from '../SkeletonDisplayText';
import {SkeletonBodyText} from '../SkeletonBodyText';

import styles from './SkeletonPage.scss';

export interface SkeletonPageProps {
  /** Page title, in large type */
  title?: string;
  /** Remove the normal max-width on the page */
  fullWidth?: boolean;
  /** Decreases the maximum layout width. Intended for single-column layouts */
  narrowWidth?: boolean;
  /** Shows a skeleton over the primary action */
  primaryAction?: boolean;
  /** Number of secondary page-level actions to display */
  secondaryActions?: number;
  /** Shows a skeleton over the breadcrumb */
  breadcrumbs?: boolean;
  /** The child elements to render in the skeleton page. */
  children?: React.ReactNode;
}

enum TitleDisplaySize {
  Small = 'small',
  Large = 'large',
}

export function SkeletonPage({
  children,
  fullWidth,
  narrowWidth,
  primaryAction,
  secondaryActions,
  title = '',
  breadcrumbs,
}: SkeletonPageProps) {
  const i18n = useI18n();
  const {newDesignLanguage} = useFeatures();
  const {isNavigationCollapsed} = useMediaQuery();

  const className = classNames(
    styles.Page,
    fullWidth && styles.fullWidth,
    narrowWidth && styles.narrowWidth,
    newDesignLanguage && styles.newDesignLanguage,
  );

  const headerClassName = classNames(
    styles.Header,
    breadcrumbs && styles['Header-hasBreadcrumbs'],
    secondaryActions && styles['Header-hasSecondaryActions'],
  );

  const getTitleDisplaySize = (): TitleDisplaySize => {
    if (newDesignLanguage) {
      return isNavigationCollapsed
        ? TitleDisplaySize.Large
        : TitleDisplaySize.Small;
    }

    return TitleDisplaySize.Large;
  };

  const titleMarkup =
    title !== null ? renderTitle(title, getTitleDisplaySize()) : null;

  const primaryActionMarkup = primaryAction ? (
    <div className={styles.PrimaryAction}>
      <SkeletonDisplayText size="large" />
    </div>
  ) : null;

  const secondaryActionsMarkup = secondaryActions
    ? renderSecondaryActions(secondaryActions)
    : null;

  const breadcrumbMarkup = breadcrumbs ? (
    <div className={styles.BreadcrumbAction} style={{width: 60}}>
      <SkeletonBodyText lines={1} />
    </div>
  ) : null;

  return (
    <div
      className={className}
      role="status"
      aria-label={i18n.translate('Polaris.SkeletonPage.loadingLabel')}
    >
      <div className={headerClassName}>
        {breadcrumbMarkup}
        <div className={styles.TitleAndPrimaryAction}>
          {titleMarkup}
          {primaryActionMarkup}
        </div>
        {secondaryActionsMarkup}
      </div>
      <div className={styles.Content}>{children}</div>
    </div>
  );
}

function renderSecondaryActions(actionCount: number) {
  const actions = [];
  for (let i = 0; i < actionCount; i++) {
    const width = Math.round(Math.random() * 40 + 60);
    actions.push(
      <div className={styles.Action} style={{width}} key={i}>
        <SkeletonBodyText lines={1} />
      </div>,
    );
  }
  return <div className={styles.Actions}>{actions}</div>;
}

function renderTitle(
  title: string,
  displaySize: TitleDisplaySize = TitleDisplaySize.Large,
) {
  const titleContent =
    title === '' ? (
      <SkeletonDisplayText size={displaySize} />
    ) : (
      <DisplayText size={displaySize} element="h1">
        <TextStyle variation="strong">{title}</TextStyle>
      </DisplayText>
    );
  return <div className={styles.Title}>{titleContent}</div>;
}
