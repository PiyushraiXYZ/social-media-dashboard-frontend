import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Plus, Star, Building2 } from 'lucide-react';
import { PageHeader } from '../../../components/layout/PageHeader/PageHeader.jsx';
import { Card } from '../../../components/ui/Card/Card.jsx';
import { Button } from '../../../components/ui/Button/Button.jsx';
import { Badge } from '../../../components/ui/Badge/Badge.jsx';
import { Skeleton } from '../../../components/ui/Skeleton/Skeleton.jsx';
import { Alert } from '../../../components/ui/Alert/Alert.jsx';
import { CreateBrandModal } from '../components/CreateBrandModal.jsx';
import {
  useListBrandsQuery,
  useSetDefaultBrandMutation,
} from '../api.js';
import {
  setBrands,
  setActiveBrand,
  selectActiveBrand,
} from '../brandSlice.js';

export function BrandsListPage() {
  const dispatch = useDispatch();
  const activeBrand = useSelector(selectActiveBrand);

  const { data, isLoading, isError, error, refetch } = useListBrandsQuery();
  const [setDefault] = useSetDefaultBrandMutation();

  const [createOpen, setCreateOpen] = useState(false);
  const [feedback, setFeedback] = useState(null);

  useEffect(() => {
    if (data) {
      const list = Array.isArray(data) ? data : [];
      dispatch(setBrands(list));
      if (!activeBrand && list.length > 0) {
        const defaultBrand = list.find((b) => b.is_default) || list[0];
        dispatch(setActiveBrand(defaultBrand));
      }
    }
  }, [data, dispatch, activeBrand]);

  const handleSetDefault = async (brandId) => {
    try {
      await setDefault(brandId).unwrap();
      setFeedback({ tone: 'success', message: 'Default brand updated ✅' });
      refetch();
    } catch (err) {
      setFeedback({
        tone: 'danger',
        message: err?.data?.detail || 'Failed to set default',
      });
    }
  };

  const brands = Array.isArray(data) ? data : [];

  return (
    <>
      <PageHeader
        eyebrow="Brands"
        title="Your brands."
        subtitle="Manage multiple brands. Each brand has its own workspace, accounts, and content."
        actions={
          <Button onClick={() => setCreateOpen(true)}>
            <Plus size={16} />
            Create brand
          </Button>
        }
      />

      {feedback && (
        <div className="mb-4">
          <Alert tone={feedback.tone}>{feedback.message}</Alert>
        </div>
      )}

      {isLoading && (
        <Card>
          <Skeleton rows={4} />
        </Card>
      )}

      {isError && (
        <Alert tone="danger" title="Could not load brands">
          {error?.data?.detail || error?.error || 'Network error'}
        </Alert>
      )}

      {!isLoading && !isError && brands.length === 0 && (
        <Card>
          <div className="p-8 text-center">
            <div className="text-lg font-semibold text-slate-800">
              No brands yet
            </div>
            <p className="mt-2 text-sm text-slate-500">
              Create your first brand to start managing your workspace.
            </p>
            <Button onClick={() => setCreateOpen(true)} className="mt-4">
              <Plus size={16} />
              Create brand
            </Button>
          </div>
        </Card>
      )}

      {brands.length > 0 && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {brands.map((brand) => {
            const isActive = activeBrand?.id === brand.id;
            return (
              <Card key={brand.id}>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="grid h-10 w-10 place-items-center rounded-lg bg-slate-100 text-slate-600">
                      <Building2 size={18} />
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-slate-800">
                        {brand.name}
                      </div>
                      <div className="text-xs text-slate-500">
                        {brand.slug}
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    {brand.is_default && <Badge tone="info">Default</Badge>}
                    {isActive && <Badge tone="success">Active</Badge>}
                  </div>
                </div>

                {brand.description && (
                  <p className="mt-3 line-clamp-2 text-xs text-slate-500">
                    {brand.description}
                  </p>
                )}

                <div className="mt-4 flex gap-2">
                  {!brand.is_default && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleSetDefault(brand.id)}
                    >
                      <Star size={14} />
                      Set default
                    </Button>
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      )}

      <CreateBrandModal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        onCreated={() => refetch()}
      />
    </>
  );
}