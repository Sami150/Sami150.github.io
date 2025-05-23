let posts = [
  {
    id: 1,
    text: "A beautiful sunset!",
    media: { type: "image", url: "https://drive.google.com/file/d/1pjyP7kW8G49UpBMrVCDh5KLmnzeTxliz/view?usp=drivesdk" },
    likes: 0,
    liked: false,
    comments: []
  },
  {
    id: 2,
    text: "Watch this amazing video!",
    media: { type: "video", url: "vedio.mp4" },
    likes: 0,
    liked: false,
    comments: []
  }
];

const saved = JSON.parse(localStorage.getItem("socialFeedData"));
if (saved) {
  posts = posts.map(post => {
    const match = saved.find(s => s.id === post.id);
    return match ? { ...post, ...match } : post;
  });
}

function saveData() {
  const dataToSave = posts.map(p => ({
    id: p.id,
    likes: p.likes,
    liked: p.liked,
    comments: p.comments || []
  }));
  localStorage.setItem("socialFeedData", JSON.stringify(dataToSave));
}

function renderPosts() {
  const feed = document.getElementById("feed");
  feed.innerHTML = "";

  posts.forEach(post => {
    const postEl = document.createElement("div");
    postEl.className = "post";

    postEl.innerHTML = `
      <h3>User</h3>
      <p>${post.text}</p>
    `;

    // Add media
    if (post.media) {
      if (post.media.type === "image") {
        postEl.innerHTML += `<img src="${post.media.url}" class="post-media" alt="post image">`;
      } else if (post.media.type === "video") {
        postEl.innerHTML += `
          <video controls class="post-media">
            <source src="${post.media.url}" type="video/mp4">
            Your browser does not support the video tag.
          </video>
        `;
      }
    }

    const commentCount = (post.comments || []).length;

    postEl.innerHTML += `
      <button class="like-btn ${post.liked ? "liked" : ""}" onclick="toggleLike(${post.id})">
        ${post.liked ? "Unlike" : "Like"} (${post.likes})
      </button>
      <button class="comment-toggle-btn" onclick="toggleCommentBox(${post.id})">
        Comment (${commentCount})
      </button>

      <div class="comments" id="comments-${post.id}">
        ${(post.comments || []).map(c => `<div class="comment">${c}</div>`).join("")}
        <div class="comment-input-container">
          <input class="comment-input" id="input-${post.id}" placeholder="Write a comment..." />
          <button class="send-btn" onclick="submitComment(${post.id})">Send</button>
        </div>
      </div>
    `;

    feed.appendChild(postEl);
  });
}

function toggleLike(id) {
  const post = posts.find(p => p.id === id);
  post.liked = !post.liked;
  post.likes += post.liked ? 1 : -1;
  saveData();
  renderPosts();
}

function toggleCommentBox(id) {
  const box = document.getElementById(`comments-${id}`);
  box.classList.toggle("visible");
}

function submitComment(postId) {
  const input = document.getElementById(`input-${postId}`);
  const text = input.value.trim();
  if (text) {
    const post = posts.find(p => p.id === postId);
    if (!post.comments) post.comments = [];
    post.comments.push(text);
    input.value = "";
    saveData();
    renderPosts();
    toggleCommentBox(postId);
    setTimeout(() => toggleCommentBox(postId), 0);
  }
}

renderPosts();
