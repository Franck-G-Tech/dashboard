// hooks/use-breadcrumb.ts
import useNavigationStore from '@/store/navigationStore';

function useBreadcrumb() {
  return useNavigationStore((state) => state.route); 
}

export default useBreadcrumb;