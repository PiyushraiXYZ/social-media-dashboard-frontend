import { useState, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { ChevronDown, Plus, Check, Building2 } from 'lucide-react';
import {
  useListBrandsQuery,
  useSwitchBrandMutation,
} from '../api.js';
import {
  setBrands,
  setActiveBrand,
  selectActiveBrand,
} from '../brandSlice.js';
import { apiClient } from '../../../lib/apiClient.js';
import { PATHS } from '../../../routes/routePaths.js';

export function BrandSwitcher() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const activeBrand = useSelector(selectActiveBrand);

  const { data: brandsData } = useListBrandsQuery();
  const [switchBrand] = useSwitchBrandMutation();

  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  // Sync brands to Redux
  useEffect(() => {
    if (brandsData) {
      const list = Array.isArray(brandsData) ? brandsData : [];
      dispatch(setBrands(list));

      // Auto-select default if no active brand
      if (!activeBrand && list.length > 0) {
        const defaultBrand =
          list.find((b) => b.is_default) || list[0];
        dispatch(setActiveBrand(defaultBrand));
      }
    }
  }, [brandsData, dispatch, activeBrand]);

  // Close on outside click
  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    };
    if (open) document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  /**
   * Handle brand switch.
   *
   * ✅ No full page reload.
   * ✅ Updates Redux active brand (persisted to localStorage).
   * ✅ Invalidates ALL brand-scoped RTK Query tags.
   *    → Every brand-scoped query auto-refetches with new brandId.
   *    → Prevents stale data from old brand.
   */
  const handleSwitch = async (brand) => {
    // Skip if already active
    if (activeBrand?.id === brand.id) {
      setOpen(false);
      return;
    }

    try {
      // 1. Backend switch (for any server-side side effects)
      await switchBrand(brand.id).unwrap();

      // 2. Update Redux + localStorage
      dispatch(setActiveBrand(brand));

      // 3. Invalidate ALL brand-scoped RTK Query tags
      //    This triggers auto-refetch of every visible query
      dispatch(
        apiClient.util.invalidateTags([
          'Account',
          'Post',
          'Analytics',
          'Schedule',
          'Workspace',
          'Brand',
        ])
      );

      setOpen(false);
    } catch (err) {
      console.error('Brand switch failed:', err);
    }
  };

  const brands = Array.isArray(brandsData) ? brandsData : [];

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm hover:bg-slate-50"
      >
        <Building2 size={14} className="text-slate-500" />
        <span className="max-w-[140px] truncate font-medium text-slate-800">
          {activeBrand?.name || 'Select brand'}
        </span>
        <ChevronDown
          size={14}
          className={`text-slate-400 transition-transform ${
            open ? 'rotate-180' : ''
          }`}
        />
      </button>

      {open && (
        <div className="absolute left-0 z-50 mt-2 w-72 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-lg">
          <div className="border-b border-slate-100 px-4 py-2">
            <div className="text-xs font-semibold uppercase text-slate-500">
              Switch Brand
            </div>
          </div>

          <div className="max-h-80 overflow-y-auto py-1">
            {brands.length === 0 && (
              <div className="px-4 py-3 text-sm text-slate-500">
                No brands yet
              </div>
            )}

            {brands.map((brand) => {
              const isActive = activeBrand?.id === brand.id;
              return (
                <button
                  key={brand.id}
                  onClick={() => handleSwitch(brand)}
                  className={`flex w-full items-center gap-3 px-4 py-2 text-left text-sm transition ${
                    isActive
                      ? 'bg-brand-50 text-brand-800'
                      : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <span className="grid h-6 w-6 shrink-0 place-items-center rounded-md bg-slate-100 text-xs font-semibold text-slate-600">
                    {brand.name?.charAt(0)?.toUpperCase() || 'B'}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="truncate font-medium">
                      {brand.name}
                      {brand.is_default && (
                        <span className="ml-2 text-[10px] font-normal uppercase text-slate-400">
                          Default
                        </span>
                      )}
                    </div>
                  </div>
                  {isActive && (
                    <Check size={14} className="text-brand-600" />
                  )}
                </button>
              );
            })}
          </div>

          <div className="border-t border-slate-100 p-2">
            <button
              onClick={() => {
                setOpen(false);
                navigate(PATHS.brands);
              }}
              className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-slate-600 hover:bg-slate-50"
            >
              <Plus size={14} />
              Create new brand
            </button>
            <button
              onClick={() => {
                setOpen(false);
                navigate(PATHS.brands);
              }}
              className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-slate-600 hover:bg-slate-50"
            >
              <Building2 size={14} />
              Manage brands
            </button>
          </div>
        </div>
      )}
    </div>
  );
}