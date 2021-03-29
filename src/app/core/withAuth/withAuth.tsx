import { useFirebase } from '@core/useFirebase/useFirebase';
import { FlexLayout } from 'la-danze-ui';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

export function withAuth(Component: React.ElementType) {
  return function Render(): JSX.Element {
    const { t } = useTranslation();
    const { authenticate } = useFirebase();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
      authenticate().then(() => setLoading(false));
    }, []);

    if (loading) {
      return (
        <FlexLayout fullHeight flexDirection="column" alignItems="center" justifyContent="center">
          {t('common.loading')}
        </FlexLayout>
      );
    }

    return <Component />;
  };
}
