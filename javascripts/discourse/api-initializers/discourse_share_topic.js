import { apiInitializer } from "discourse/lib/api";

export default apiInitializer("0.11.1", (api) => {
  if (api.container.lookup("service:site").desktopView) {
    let position = "second";

    api.removePostMenuButton("share", () => {
      return true;
    });

    api.addPostMenuButton("copy", () => {
      return {
        action: "copyLink",
        icon: "d-post-share",
        className: "post-action-menu__copy-link",
        title: themePrefix("copy_title"),
        position,
      };
    });

    api.attachWidgetAction("post", "copyLink", function () {
      const postUrl = this.attrs.shareUrl;
      const postId = this.attrs.id;
      const shareUrl = new URL(postUrl, window.origin).toString();
      const copyLinkBtn = document.querySelector(
        `article[data-post-id='${postId}'] .post-action-menu__copy-link`
      );
      navigator.clipboard.writeText(shareUrl).then(
        () => {
          createAlert("Link copied!", "success", postId);
          createCheckmark(copyLinkBtn, postId);
        },
        () => {
          createAlert("Failed to copy link.", "fail");
        }
      );
    });
  }
});

function createAlert(message, type, postId) {
  let alertDiv = document.createElement("div");
  alertDiv.className =
    "link-copied-alert" + (type === "success" ? " -success" : " -fail");
  alertDiv.textContent = message;

  let post = document.querySelector(
    `article[data-post-id='${postId}'] .post-menu-area`
  );
  post.appendChild(alertDiv);

  alertDiv.classList.add("is-visible");
  setTimeout(function () {
    alertDiv.classList.remove("is-visible");
  }, 1500);

  setTimeout(function () {
    document
      .querySelector(`article[data-post-id='${postId}'] .post-menu-area`)
      .removeChild(alertDiv);
  }, 2000);
}

function createCheckmark(btn, postId) {
  let checkmark = makeSvg(postId);
  btn.appendChild(checkmark);

  setTimeout(() => {
    document.getElementById(postId).classList.remove("is-visible");
  }, 3000);

  setTimeout(() => {
    document
      .getElementById(postId)
      .parentNode.removeChild(document.getElementById(postId));
  }, 3500);
}

function makeSvg(postId) {
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("class", "post-action-menu__copylink-checkmark is-visible");
  svg.setAttribute("id", postId);
  svg.setAttribute("xmlns", "http://www.w3.org/2000/svg");
  svg.setAttribute("viewBox", "0 0 52 52");
  svg.innerHTML = `
<path class="checkmark__check" fill="none" d="M13 26 l10 10 20 -20"/>
      `;
  return svg;
}
