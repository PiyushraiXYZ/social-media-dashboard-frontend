import { PageHeader } from '../../../components/layout/PageHeader/PageHeader.jsx';
import { CompanyProfileForm } from '../components/CompanyProfileForm.jsx';
import { AssetUploader } from '../components/AssetUploader.jsx';
import { BrandPreview } from '../components/BrandPreview.jsx';
import { BrandingControls } from '../components/BrandingControls.jsx';

export function BrandSettingsPage() {
  return (
    <>
      <PageHeader
        eyebrow="03 / Content creation · Profile & brand assets"
        title="A consistent signature."
        subtitle="Manage the assets used to brand generated images across your workspace."
      />
      <div className="grid gap-4 lg:grid-cols-2">
        <CompanyProfileForm />
        <AssetUploader />
        <BrandPreview />
        <BrandingControls />
      </div>
    </>
  );
}
