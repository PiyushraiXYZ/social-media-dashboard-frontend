import { PageHeader } from '../../../components/layout/PageHeader/PageHeader.jsx';
import { SuccessPanel } from '../components/SuccessPanel.jsx';
import { PartialSuccessPanel } from '../components/PartialSuccessPanel.jsx';
import { FailurePanel } from '../components/FailurePanel.jsx';

export function PublicationResultPage() {
  // In real app, derive branch from state.
  const branch = 'partial';
  return (
    <>
      <PageHeader
        eyebrow="06 / Publication · Result"
        title="Publication result."
        subtitle="Each destination receives an independent job; results may differ."
      />
      {branch === 'success' && <SuccessPanel />}
      {branch === 'partial' && <PartialSuccessPanel />}
      {branch === 'failed' && <FailurePanel />}
    </>
  );
}
