import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchComments, createComment, editComment, deleteComment } from "../../redux/comments";

export default function CommentsPanel({ recipeId, sessionUser }) {
  const dispatch = useDispatch();
  const data = useSelector((s) => s.comments?.byRecipe?.[recipeId]);
  const comments = data?.comments || [];
  const [content, setContent] = useState("");

  useEffect(() => {
    if (!recipeId) return;
    dispatch(fetchComments(recipeId));
  }, [dispatch, recipeId]);

  const submit = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;
    const err = await dispatch(createComment(recipeId, content));
    if (!err) setContent("");
  };

  return (
    <div className="comments-panel" style={{ marginTop: 20 }}>
      <h3>Comments ({data?.total ?? 0})</h3>

      {sessionUser && (
        <form onSubmit={submit} style={{ display: "grid", gap: 8, margin: "8px 0 12px" }}>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Share your thoughts..."
            rows={3}
          />
          <button type="submit">Post</button>
        </form>
      )}

      <ul style={{ listStyle: "none", padding: 0, display: "grid", gap: 10 }}>
        {comments.map((c) => (
          <li key={c.id} style={{ border: "1px solid #eee", borderRadius: 10, padding: "8px 12px" }}>
            <div><strong>{c.username ?? `User ${c.user_id}`}</strong></div>
            <div>{c.content}</div>
            {sessionUser?.id === c.user_id && (
              <div style={{ marginTop: 6 }}>
                <button
                  type="button"
                  onClick={() => {
                    const next = prompt("Edit comment:", c.content);
                    if (next !== null) dispatch(editComment(recipeId, c.id, next));
                  }}
                  style={{ marginRight: 8, background: "none", border: "none", color: "#0a72ff", cursor: "pointer" }}
                >
                  Edit
                </button>
                <button
                  type="button"
                  onClick={() => dispatch(deleteComment(recipeId, c.id))}
                  style={{ background: "none", border: "none", color: "#c02626", cursor: "pointer" }}
                >
                  Delete
                </button>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}