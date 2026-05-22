import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchComments, createComment, editComment, deleteComment } from "../redux/comments";

export default function RecipeComments({ recipeId, sessionUser }) {
  const dispatch = useDispatch();
  const data = useSelector(s => s.comments.byRecipe[recipeId]);
  const comments = data?.comments || [];
  const [content, setContent] = useState("");

  useEffect(() => { dispatch(fetchComments(recipeId)); }, [dispatch, recipeId]);

  const submit = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;
    const err = await dispatch(createComment(recipeId, content));
    if (!err) setContent("");
  };

  return (
    <div className="comments">
      <h3>Comments ({data?.total ?? 0})</h3>

      {sessionUser && (
        <form onSubmit={submit}>
          <textarea value={content} onChange={e => setContent(e.target.value)} placeholder="Share your thoughts..." />
          <button type="submit">Post</button>
        </form>
      )}

      <ul>
        {comments.map(c => (
          <li key={c.id}>
            <div>
              <strong>{c.username ?? "User " + c.user_id}</strong>
              <p>{c.content}</p>
            </div>
            {sessionUser?.id === c.user_id && (
              <small>
                <button onClick={() => {
                  const next = prompt("Edit comment:", c.content);
                  if (next !== null) dispatch(editComment(recipeId, c.id, next));
                }}>Edit</button>
                <button onClick={() => dispatch(deleteComment(recipeId, c.id))}>Delete</button>
              </small>
            )}
          </li>
        ))}
      </ul>

      {(data?.pages || 1) > 1 && (
        <button onClick={() => dispatch(fetchComments(recipeId, (data.current_page || 1) + 1))}>
          Load more
        </button>
      )}
    </div>
  );
}