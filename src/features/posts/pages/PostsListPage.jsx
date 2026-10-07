import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { PageHeader } from '../../../components/layout/PageHeader/PageHeader.jsx';
import { Card } from '../../../components/ui/Card/Card.jsx';
import { PostTable } from '../components/PostTable.jsx';
import { PostFilters } from '../components/PostFilters.jsx';
import { Button } from '../../../components/ui/Button/Button.jsx';
import { PATHS } from '../../../routes/routePaths.js';

export function PostsListPage() {
  const navigate = useNavigate();
  const posts = useSelector((s) => s.workspace.recentPosts || []);
  return (
    <>
      <PageHeader
        eyebrow="04 / Review & Approval"
        title="Every post, from idea to outcome."
        subtitle="Review drafts, confirm approvals, and follow independent destination results."
        actions={<Button onClick={() => navigate(PATHS.createPost)}>Create post</Button>}
      />
      <Card>
        <PostFilters />
        <div className="mt-4"><PostTable posts={posts} /></div>
      </Card>
    </>
  );
}
