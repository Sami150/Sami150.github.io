let posts = [
  {
    id: 1,
    text: "A beautiful sunset!",
    media: { type: "image", url: "https://www.google.com/search?client=ms-android-xiaomi-rvo3&sca_esv=04268fcd01117b60&sxsrf=AE3TifMAvlioeuDW3cNmiipk11EsNF1A1Q:1748018103985&udm=2&fbs=AIIjpHxU7SXXniUZfeShr2fp4giZ1Y6MJ25_tmWITc7uy4KIeuYzzFkfneXafNx6OMdA4MQRJc_t_TQjwHYrzlkIauOK_IaFSQcTHs2AgJbmYqOLNlPDT0Hy19TTgd1LyYk-nATqUlksEoQZVG09gZfle_U4HWWnSbP00Bg1jXXhxPXHO_ZklXeHNi63K93FV-i7HL9XSIXF&q=sunset&sa=X&sqi=2&ved=2ahUKEwiqmpjxgrqNAxWsRPEDHc2QAV4QtKgLegQIEhAB" },
    likes: 0,
    liked: false,
    comments: []
  },
  {
    id: 2,
    text: "Watch this amazing video!",
    media: { type: "video", url: "https://www.google.com/url?sa=t&source=web&rct=j&opi=89978449&url=https://www.youtube.com/watch%3Fv%3DIBdSl7yeIiw&ved=2ahUKEwi4l9qfg7qNAxWQhv0HHRQCE8wQz40FegQIFRAJ&usg=AOvVaw12EUALxo281nr66jgoS-tq" },
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
